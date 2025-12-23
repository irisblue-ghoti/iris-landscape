// 积分系统配置

export const CREDIT_CONFIG = {
  REGISTRATION_BONUS: 100, // 注册奖励
  DAILY_CHECKIN_REWARD: 10, // 每日签到奖励
} as const;

export const CREDIT_TYPES = {
  REGISTRATION: "registration",
  DAILY_CHECKIN: "daily_checkin",
  RECHARGE: "recharge",
  CONSUME: "consume",
  REFUND: "refund",
  AI_USAGE: "ai_usage",
} as const;

export type CreditType = (typeof CREDIT_TYPES)[keyof typeof CREDIT_TYPES];
