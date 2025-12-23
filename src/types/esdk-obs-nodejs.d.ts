declare module "esdk-obs-nodejs" {
  import { Readable } from "stream";

  interface ObsClientConfig {
    access_key_id: string;
    secret_access_key: string;
    server: string;
  }

  interface PutObjectParams {
    Bucket: string;
    Key: string;
    Body: Buffer | string | Readable;
    ContentType?: string;
    ContentLength?: number;
    [key: string]: any;
  }

  interface GetObjectParams {
    Bucket: string;
    Key: string;
  }

  interface DeleteObjectParams {
    Bucket: string;
    Key: string;
  }

  interface CreateSignedUrlParams {
    Method: string;
    Bucket: string;
    Key: string;
    Expires?: number;
  }

  interface ObsResponse {
    CommonMsg: {
      Status: number;
      Code?: string;
      Message?: string;
    };
    InterfaceResult?: {
      RequestId: string;
      Content?: Readable;
      [key: string]: any;
    };
  }

  interface SignedUrlResult {
    SignedUrl: string;
    ActualSignedRequestHeaders?: Record<string, string>;
  }

  class ObsClient {
    constructor(config: ObsClientConfig);
    putObject(params: PutObjectParams): Promise<ObsResponse>;
    getObject(params: GetObjectParams): Promise<ObsResponse>;
    deleteObject(params: DeleteObjectParams): Promise<ObsResponse>;
    createSignedUrlSync(params: CreateSignedUrlParams): SignedUrlResult;
    close(): void;
  }

  export default ObsClient;
}
