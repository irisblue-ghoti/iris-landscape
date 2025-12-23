import { useCallback, useRef } from "react";

export function useWebRTC() {
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  /**
   * 解析 WebRTC URL 并转换为 HTTP API 端点
   * 支持格式:
   * - webrtc://domain/path/stream?params
   * - https://domain/path/stream/whep
   * - rtmp://domain/path (自动转换)
   */
  const parseWebRTCUrl = (url: string): string => {
    if (!url || typeof url !== "string") {
      throw new Error("Invalid URL: URL is required");
    }

    const trimmedUrl = url.trim();

    // 如果已经是 HTTP/HTTPS 端点，直接返回
    if (trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")) {
      return trimmedUrl;
    }

    // 处理 webrtc:// 协议
    if (trimmedUrl.startsWith("webrtc://")) {
      // 移除 webrtc:// 前缀
      const withoutProtocol = trimmedUrl.substring(9);

      // 检查是否为空
      if (!withoutProtocol) {
        throw new Error("Invalid WebRTC URL: missing domain and path");
      }

      // 分离域名和路径（保留查询参数）
      const firstSlashIndex = withoutProtocol.indexOf("/");

      if (firstSlashIndex === -1) {
        // 只有域名，没有路径
        throw new Error("Invalid WebRTC URL: missing stream path");
      }

      const domain = withoutProtocol.substring(0, firstSlashIndex);
      const pathWithQuery = withoutProtocol.substring(firstSlashIndex + 1);

      // 腾讯云 WebRTC 使用 HTTPS + /webrtc/v1/pullstream 端点
      if (domain.includes("myqcloud.com") || domain.includes("tencent")) {
        // 腾讯云格式: webrtc://domain/path/stream?params
        // 转换为: https://domain/webrtc/v1/pullstream?path/stream&params
        return `https://${domain}/webrtc/v1/pullstream?${pathWithQuery}`;
      }

      // 其他服务尝试标准 WHEP 端点
      return `https://${domain}/${pathWithQuery}/whep`;
    }

    // 处理 rtmp:// 协议（部分服务支持 RTMP 转 WebRTC）
    if (trimmedUrl.startsWith("rtmp://")) {
      console.warn("RTMP protocol detected. Attempting conversion to WebRTC...");
      const withoutProtocol = trimmedUrl.substring(7);
      const firstSlashIndex = withoutProtocol.indexOf("/");

      if (firstSlashIndex === -1) {
        throw new Error("Invalid RTMP URL: missing stream path");
      }

      const domain = withoutProtocol.substring(0, firstSlashIndex);
      const path = withoutProtocol.substring(firstSlashIndex + 1);

      // 尝试转换为 WebRTC
      return `https://${domain}/webrtc/v1/pullstream?${path}`;
    }

    throw new Error(
      `Unsupported URL format: "${trimmedUrl}". Please use webrtc://, https://, or http:// protocol.`
    );
  };

  const connectWebRTC = useCallback(
    async (url: string, videoElement: HTMLVideoElement) => {
      try {
        console.log("=== WebRTC Connection Start ===");
        console.log("Original URL:", url);
        console.log("URL type:", typeof url);
        console.log("URL length:", url?.length);

        // 解析 WebRTC URL 为 HTTP API 端点
        const apiEndpoint = parseWebRTCUrl(url);
        console.log("Parsed API endpoint:", apiEndpoint);

        // 创建 PeerConnection
        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
          ],
        });

        peerConnectionRef.current = pc;

        // 添加接收器
        pc.addTransceiver("video", { direction: "recvonly" });
        pc.addTransceiver("audio", { direction: "recvonly" });

        // 监听远程流
        pc.ontrack = (event) => {
          console.log("Received remote track:", event.track.kind);
          if (videoElement && event.streams && event.streams[0]) {
            videoElement.srcObject = event.streams[0];
            // 确保视频自动播放
            videoElement.play().catch((e) => {
              console.error("Failed to play video:", e);
            });
          }
        };

        // ICE 连接状态变化
        pc.oniceconnectionstatechange = () => {
          console.log("ICE Connection State:", pc.iceConnectionState);
        };

        // 连接状态变化
        pc.onconnectionstatechange = () => {
          console.log("Connection State:", pc.connectionState);
        };

        // 创建 Offer
        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });
        await pc.setLocalDescription(offer);

        console.log("Created SDP offer");

        // 等待 ICE gathering 完成
        await new Promise<void>((resolve) => {
          if (pc.iceGatheringState === "complete") {
            resolve();
          } else {
            const checkState = () => {
              if (pc.iceGatheringState === "complete") {
                pc.removeEventListener("icegatheringstatechange", checkState);
                resolve();
              }
            };
            pc.addEventListener("icegatheringstatechange", checkState);
            // 超时保护
            setTimeout(resolve, 3000);
          }
        });

        console.log("Signaling endpoint:", apiEndpoint);

        // 通过代理服务器发送 SDP offer（绕过 CORS）
        console.log("Sending SDP offer through proxy...");
        const response = await fetch("/api/webrtc/proxy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: apiEndpoint,
            sdp: pc.localDescription?.sdp,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `Signaling failed: ${response.status} ${response.statusText}`
          );
        }

        // 接收 SDP answer
        const answerSdp = await response.text();
        console.log("Received SDP answer");

        // 设置远程描述
        await pc.setRemoteDescription({
          type: "answer",
          sdp: answerSdp,
        });

        console.log("WebRTC connection established");
        return pc;
      } catch (error) {
        console.error("WebRTC connection failed:", error);
        throw error;
      }
    },
    []
  );

  const disconnect = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
  }, []);

  return {
    connectWebRTC,
    disconnect,
  };
}
