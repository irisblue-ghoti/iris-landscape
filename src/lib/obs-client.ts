/**
 * 华为云 OBS 上传服务
 * Huawei Cloud OBS Upload Service
 */

import ObsClient from "esdk-obs-nodejs";
import { env } from "@/env";
import { nanoid } from "nanoid";
import { Readable } from "stream";

// OBS 客户端实例
let obsClient: ObsClient | null = null;

/**
 * 通过文件头检测实际的图片类型
 * @param buffer 图片的 Buffer 数据
 * @returns MIME 类型
 */
function detectImageType(buffer: Buffer): string {
  // 检查文件头（Magic Numbers）
  if (buffer.length < 4) {
    return "image/jpeg"; // 默认
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return "image/jpeg";
  }

  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    return "image/png";
  }

  // GIF: 47 49 46
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
    return "image/gif";
  }

  // WebP: 52 49 46 46 ... 57 45 42 50
  if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) {
    if (buffer.length >= 12 && buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
      return "image/webp";
    }
  }

  // 默认返回 JPEG
  return "image/jpeg";
}

/**
 * 获取 OBS 客户端实例（单例模式）
 */
export function getObsClient(): ObsClient {
  if (!obsClient) {
    const {
      HUAWEI_OBS_ACCESS_KEY,
      HUAWEI_OBS_SECRET_KEY,
      HUAWEI_OBS_ENDPOINT
    } = env;

    if (!HUAWEI_OBS_ACCESS_KEY || !HUAWEI_OBS_SECRET_KEY || !HUAWEI_OBS_ENDPOINT) {
      throw new Error("华为云 OBS 配置不完整，请检查环境变量");
    }

    obsClient = new ObsClient({
      access_key_id: HUAWEI_OBS_ACCESS_KEY,
      secret_access_key: HUAWEI_OBS_SECRET_KEY,
      server: `https://${HUAWEI_OBS_ENDPOINT}`,
    });

    // console.log("✅ 华为云 OBS 客户端初始化成功");
  }

  return obsClient;
}

/**
 * 检查 OBS 配置是否完整
 */
export function isObsConfigured(): boolean {
  const {
    HUAWEI_OBS_ACCESS_KEY,
    HUAWEI_OBS_SECRET_KEY,
    HUAWEI_OBS_BUCKET,
    HUAWEI_OBS_ENDPOINT
  } = env;

  return !!(
    HUAWEI_OBS_ACCESS_KEY &&
    HUAWEI_OBS_SECRET_KEY &&
    HUAWEI_OBS_BUCKET &&
    HUAWEI_OBS_ENDPOINT
  );
}

/**
 * 上传图片到 OBS
 * @param base64Data Base64 格式的图片数据（支持 data:image/... 格式）
 * @param filename 文件名（可选，自动生成）
 * @returns 图片的公开访问 URL
 */
export async function uploadImageToObs(
  base64Data: string,
  filename?: string
): Promise<string> {
  try {
    const client = getObsClient();
    const { HUAWEI_OBS_BUCKET, HUAWEI_OBS_PATH_PREFIX, HUAWEI_OBS_CUSTOM_DOMAIN, HUAWEI_OBS_ENDPOINT } = env;

    if (!HUAWEI_OBS_BUCKET) {
      throw new Error("OBS Bucket 未配置");
    }

    // 如果已经是 OBS URL，直接返回
    if (base64Data.startsWith("https://") && base64Data.includes("obs")) {
      return base64Data;
    }

    // 如果是外部 URL，也跳过上传
    if (base64Data.startsWith("http://") || base64Data.startsWith("https://")) {
      return base64Data;
    }

    // 解析 base64 数据
    let imageBuffer: Buffer;
    let contentType = "image/jpeg";

    if (base64Data.startsWith("data:")) {
      // 提取 MIME 类型和数据 - 使用更健壮的字符串分割方式
      const commaIndex = base64Data.indexOf(",");
      if (commaIndex === -1) {
        throw new Error("Invalid base64 data format: no comma separator");
      }

      const header = base64Data.substring(0, commaIndex); // "data:image/xxx;base64"
      const base64String = base64Data.substring(commaIndex + 1).trim(); // 移除可能的空白字符

      // 从 header 提取 content-type
      const typeMatch = header.match(/^data:([^;]+)/);
      const declaredContentType = typeMatch ? typeMatch[1] : "image/jpeg";

      // 验证 base64 字符串是否有效
      if (base64String.length === 0) {
        throw new Error("Invalid base64 data: empty string");
      }

      imageBuffer = Buffer.from(base64String, "base64");

      // 检测实际的文件类型（通过文件头）
      const actualContentType = detectImageType(imageBuffer);

      if (actualContentType !== declaredContentType) {
        contentType = actualContentType;
      } else {
        contentType = declaredContentType;
      }
    } else {
      // 纯 base64 数据
      imageBuffer = Buffer.from(base64Data, "base64");
      // 检测实际类型
      contentType = detectImageType(imageBuffer);
    }

    // 生成文件名
    const ext = contentType.split("/")[1] || "jpg";
    const objectKey = filename || `${nanoid()}.${ext}`;

    // 完整路径（包含前缀）
    const fullPath = HUAWEI_OBS_PATH_PREFIX
      ? `${HUAWEI_OBS_PATH_PREFIX}/${objectKey}`
      : objectKey;

    // 验证 Buffer 是否为有效图片数据
    if (imageBuffer.length < 100) {
      console.error(`❌ [OBS] Buffer 太小，可能不是有效的图片数据: ${imageBuffer.length} bytes`);
    }

    // 上传到 OBS - 使用 Stream 避免编码问题
    // 将 Buffer 转换为 Readable Stream
    const bufferStream = new Readable();
    bufferStream.push(imageBuffer);
    bufferStream.push(null); // 标记流结束

    const result = await client.putObject({
      Bucket: HUAWEI_OBS_BUCKET,
      Key: fullPath,
      Body: bufferStream,
      ContentLength: imageBuffer.length,  // 明确指定内容长度
      ContentType: contentType,
    });

    if (result.CommonMsg.Status !== 200) {
      console.error(`❌ [OBS] 上传失败，状态码: ${result.CommonMsg.Status}`);
      throw new Error(`OBS 上传失败: ${result.CommonMsg.Message}`);
    }

    // 生成访问 URL
    let publicUrl: string;

    if (HUAWEI_OBS_CUSTOM_DOMAIN) {
      // 使用自定义 CDN 域名
      publicUrl = `${HUAWEI_OBS_CUSTOM_DOMAIN}/${fullPath}`;
    } else if (env.HUAWEI_OBS_PUBLIC_URL) {
      // 使用配置的公共 URL
      publicUrl = `${env.HUAWEI_OBS_PUBLIC_URL}/${fullPath}`;
    } else {
      // 使用默认的 OBS 域名
      publicUrl = `https://${HUAWEI_OBS_BUCKET}.${HUAWEI_OBS_ENDPOINT}/${fullPath}`;
    }

    return publicUrl;
  } catch (error) {
    console.error("❌ OBS 上传失败:", error);
    throw error;
  }
}

/**
 * 批量上传图片到 OBS
 * @param base64Images Base64 图片数据数组
 * @returns 上传成功的 URL 数组
 */
export async function uploadImagesToObs(
  base64Images: string[]
): Promise<string[]> {
  const uploadPromises = base64Images.map((base64) => uploadImageToObs(base64));
  return Promise.all(uploadPromises);
}

/**
 * 从 OBS 删除图片
 * @param objectKey 对象键（文件路径）
 */
export async function deleteImageFromObs(objectKey: string): Promise<void> {
  try {
    const client = getObsClient();
    const { HUAWEI_OBS_BUCKET } = env;

    if (!HUAWEI_OBS_BUCKET) {
      throw new Error("OBS Bucket 未配置");
    }

    const result = await client.deleteObject({
      Bucket: HUAWEI_OBS_BUCKET,
      Key: objectKey,
    });

    if (result.CommonMsg.Status !== 204) {
      throw new Error(`删除失败: ${result.CommonMsg.Message}`);
    }

    // console.log(`🗑️ 图片已从 OBS 删除: ${objectKey}`);
  } catch (error) {
    console.error("❌ OBS 删除失败:", error);
    throw error;
  }
}

/**
 * 从 URL 提取 OBS 对象键
 * @param url OBS 图片 URL
 * @returns 对象键
 */
export function extractObjectKeyFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    // 移除开头的 "/"
    return urlObj.pathname.substring(1);
  } catch {
    return null;
  }
}

/**
 * 生成带时效的签名 URL
 * @param objectKey 对象键（文件路径）
 * @param expiresInSeconds 过期时间（秒），默认 7 天
 * @returns 签名后的临时访问 URL
 */
export async function generateSignedUrl(
  objectKey: string,
  expiresInSeconds: number = 7 * 24 * 60 * 60 // 默认 7 天
): Promise<string> {
  try {
    const client = getObsClient();
    const { HUAWEI_OBS_BUCKET } = env;

    if (!HUAWEI_OBS_BUCKET) {
      throw new Error("OBS Bucket 未配置");
    }

    // 使用 OBS SDK 生成签名 URL
    const result = client.createSignedUrlSync({
      Method: "GET",
      Bucket: HUAWEI_OBS_BUCKET,
      Key: objectKey,
      Expires: expiresInSeconds,
    });

    // console.log(`🔗 生成签名 URL: ${objectKey}, 有效期: ${expiresInSeconds}秒`);
    return result.SignedUrl;
  } catch (error) {
    console.error("❌ 生成签名 URL 失败:", error);
    throw error;
  }
}

/**
 * 从 OBS URL 生成带时效的分享链接
 * @param obsUrl 原始 OBS URL
 * @param expiresInSeconds 过期时间（秒），默认 7 天
 * @returns 签名后的临时访问 URL
 */
export async function generateShareUrl(
  obsUrl: string,
  expiresInSeconds: number = 7 * 24 * 60 * 60
): Promise<string> {
  // 如果不是 OBS URL，直接返回原 URL
  if (!obsUrl.includes("obs") && !obsUrl.includes(env.HUAWEI_OBS_BUCKET || "")) {
    return obsUrl;
  }

  const objectKey = extractObjectKeyFromUrl(obsUrl);
  if (!objectKey) {
    throw new Error("无法从 URL 提取对象键");
  }

  return generateSignedUrl(objectKey, expiresInSeconds);
}

/**
 * 批量生成分享链接
 * @param obsUrls OBS URL 数组
 * @param expiresInSeconds 过期时间（秒），默认 7 天
 * @returns 签名后的 URL 数组
 */
export async function generateShareUrls(
  obsUrls: string[],
  expiresInSeconds: number = 7 * 24 * 60 * 60
): Promise<string[]> {
  const signedUrls = await Promise.all(
    obsUrls.map((url) => generateShareUrl(url, expiresInSeconds))
  );
  return signedUrls;
}
