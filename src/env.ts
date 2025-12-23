import { createEnv } from "@t3-oss/env-nextjs";
import { ZodError, z } from "zod";

// Define and validate the environment variables
export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]), // Ensure NODE_ENV is either 'development' or 'production'
    // Huawei Cloud OBS Configuration
    HUAWEI_OBS_ACCESS_KEY: z.string().optional(),
    HUAWEI_OBS_SECRET_KEY: z.string().optional(),
    HUAWEI_OBS_BUCKET: z.string().optional(),
    HUAWEI_OBS_ENDPOINT: z.string().optional(),
    HUAWEI_OBS_REGION: z.string().optional(),
    HUAWEI_OBS_CUSTOM_DOMAIN: z.string().optional(),
    HUAWEI_OBS_PATH_PREFIX: z.string().default("underwater-images"),
    HUAWEI_OBS_PUBLIC_URL: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error"]),
    NEXT_PUBLIC_302_WEBSITE_URL_GLOBAL: z.string(),
    NEXT_PUBLIC_302_WEBSITE_URL_CHINA: z.string(),
    NEXT_PUBLIC_302_API_KEY: z.string().optional(),
    NEXT_PUBLIC_API_URL: z.string(),
    NEXT_PUBLIC_AUTH_API_URL: z.string(),
    NEXT_PUBLIC_AUTH_PATH: z.string(),
    NEXT_PUBLIC_IS_CHINA: z.boolean(),
    NEXT_PUBLIC_DEFAULT_LOCALE: z.string(),
    NEXT_PUBLIC_DEFAULT_MODEL_NAME: z.string(),
    NEXT_PUBLIC_DEV_HOST_NAME: z.string().optional(),
    NEXT_PUBLIC_HIDE_BRAND: z.boolean().optional(),
  },
  // Runtime environment configuration
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    // Huawei Cloud OBS
    HUAWEI_OBS_ACCESS_KEY: process.env.HUAWEI_OBS_ACCESS_KEY,
    HUAWEI_OBS_SECRET_KEY: process.env.HUAWEI_OBS_SECRET_KEY,
    HUAWEI_OBS_BUCKET: process.env.HUAWEI_OBS_BUCKET,
    HUAWEI_OBS_ENDPOINT: process.env.HUAWEI_OBS_ENDPOINT,
    HUAWEI_OBS_REGION: process.env.HUAWEI_OBS_REGION,
    HUAWEI_OBS_CUSTOM_DOMAIN: process.env.HUAWEI_OBS_CUSTOM_DOMAIN,
    HUAWEI_OBS_PATH_PREFIX: process.env.HUAWEI_OBS_PATH_PREFIX,
    HUAWEI_OBS_PUBLIC_URL: process.env.HUAWEI_OBS_PUBLIC_URL,
    // Client variables
    NEXT_PUBLIC_LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL,
    NEXT_PUBLIC_302_WEBSITE_URL_GLOBAL:
      process.env.NEXT_PUBLIC_302_WEBSITE_URL_GLOBAL,
    NEXT_PUBLIC_302_WEBSITE_URL_CHINA:
      process.env.NEXT_PUBLIC_302_WEBSITE_URL_CHINA,
    NEXT_PUBLIC_302_API_KEY: process.env.NEXT_PUBLIC_302_API_KEY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_AUTH_API_URL: process.env.NEXT_PUBLIC_AUTH_API_URL,
    NEXT_PUBLIC_AUTH_PATH: process.env.NEXT_PUBLIC_AUTH_PATH,
    NEXT_PUBLIC_IS_CHINA: process.env.NEXT_PUBLIC_IS_CHINA === "true",
    NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
    NEXT_PUBLIC_DEFAULT_MODEL_NAME: process.env.NEXT_PUBLIC_DEFAULT_MODEL_NAME,
    NEXT_PUBLIC_DEV_HOST_NAME: process.env.NEXT_PUBLIC_DEV_HOST_NAME,
    NEXT_PUBLIC_HIDE_BRAND: process.env.NEXT_PUBLIC_HIDE_BRAND === "true",
  },
  // Handle validation errors
  onValidationError: (error: ZodError) => {
    console.error(
      "❌ Invalid environment variables:",
      error.flatten().fieldErrors
    );
    process.exit(1);
  },
  emptyStringAsUndefined: true, // Treat empty strings as undefined
});
