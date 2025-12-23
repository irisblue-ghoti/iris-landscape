# 用户系统使用说明

## 概述

项目已成功添加用户注册登录功能和积分系统。用户可以通过邮箱密码注册登录，并使用积分进行操作。

**重要：现在访问任何页面都需要先登录。未登录用户会自动重定向到登录页面。**

## 功能特性

- ✅ 邮箱 + 密码注册登录
- ✅ 用户信息展示
- ✅ 积分系统（充值/消费/退款）
- ✅ 保留原有分享码登录方式（可选）
- ✅ 支持中文、英文、日文界面
- ✅ 全局认证保护（所有页面需登录）
- ✅ 自动积分加载

## 环境配置

### 1. 配置环境变量

复制 `.env.example` 为 `.env.local`，并配置以下变量：

```bash
# 数据库配置
DATABASE_URL="postgresql://username:password@localhost:5432/iris_landscape"

# NextAuth 配置
NEXTAUTH_SECRET="your-secret-key-here"  # 使用 openssl rand -base64 32 生成
NEXTAUTH_URL="http://localhost:3000"
```

### 2. 初始化数据库

```bash
# 生成 Prisma Client
npx prisma generate

# 创建数据库表
npx prisma db push

# 或使用迁移（推荐生产环境）
npx prisma migrate dev --name init
```

### 3. 启动项目

```bash
pnpm dev
```

## 使用说明

### 认证流程

1. **首次访问**：用户访问任何页面时，系统会检查登录状态
2. **未登录**：自动重定向到 `/auth` 登录页面
3. **登录成功**：重定向回首页，可以正常使用所有功能
4. **已登录访问登录页**：自动重定向到首页

### 用户注册登录

1. 访问网站任意页面会自动跳转到 `/auth` 页面
2. 点击"使用账号登录"切换到用户登录模式
3. 首次使用点击"注册"，填写邮箱和密码
4. 已有账号直接登录
5. 也可以切换回"使用分享码登录"（原有功能）

### 积分系统

#### 查询积分

```typescript
import { useCredits } from "@/hooks/user";

const { credits, fetchCredits } = useCredits();

// 获取最新积分
await fetchCredits();
```

#### 更新积分

```typescript
import { useCredits } from "@/hooks/user";

const { updateCredits } = useCredits();

// 充值积分
await updateCredits(100, "recharge", "购买积分");

// 消费积分
await updateCredits(-10, "consume", "生成图片");

// 退款
await updateCredits(10, "refund", "退款说明");
```

### 获取用户信息

```typescript
import { useUser } from "@/hooks/user";

const { user, isLoading } = useUser();

// user.id - 用户ID
// user.email - 邮箱
// user.name - 用户名
// user.credits - 积分余额
```

## 数据库模型

### User 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 用户ID (CUID) |
| email | String | 邮箱（唯一） |
| password | String | 加密密码 |
| name | String? | 用户名（可选） |
| credits | Int | 积分余额 |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

### CreditRecord 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 记录ID (CUID) |
| userId | String | 用户ID |
| amount | Int | 变动金额 |
| type | String | 类型 (recharge/consume/refund) |
| description | String? | 说明 |
| createdAt | DateTime | 创建时间 |

## API 接口

### 用户注册
- **路径**: `POST /api/user/register`
- **参数**: `{ email, password, name? }`
- **返回**: 用户信息

### 积分查询
- **路径**: `GET /api/user/credits`
- **返回**: `{ credits: number }`

### 积分操作
- **路径**: `POST /api/user/credits`
- **参数**: `{ amount, type, description? }`
- **返回**: `{ credits: number }`

## 支付集成（预留）

积分系统已预留支付接口对接功能。当需要对接支付服务时：

1. 在支付回调中调用 `/api/user/credits` 接口充值积分
2. 传入 `type: "recharge"` 和充值金额
3. 系统会自动记录充值记录

示例：

```typescript
// 支付成功回调
async function handlePaymentSuccess(userId: string, amount: number, orderId: string) {
  await fetch("/api/user/credits", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: amount,
      type: "recharge",
      description: `订单 ${orderId} 充值`
    })
  });
}
```

## 开发工具

### Prisma Studio

可视化管理数据库：

```bash
npx prisma studio
```

### 数据库迁移

```bash
# 创建新的迁移
npx prisma migrate dev --name migration_name

# 应用迁移到生产环境
npx prisma migrate deploy
```

## 注意事项

1. **密码安全**: 使用 bcrypt 加密，加密强度为 12
2. **Session 管理**: 使用 JWT，token 有效期跟随 NextAuth 配置
3. **积分操作**: 使用事务确保数据一致性
4. **环境变量**: 生产环境务必使用强密码和安全的 SECRET

## 技术栈

- **数据库**: PostgreSQL
- **ORM**: Prisma 5.x
- **认证**: NextAuth.js 5 (beta)
- **密码加密**: bcryptjs
- **状态管理**: Jotai
- **国际化**: next-intl

## 认证架构

### 核心组件

1. **AppAuth** (`src/components/global/app-auth/index.tsx`)
   - 全局认证守卫
   - 检查用户登录状态
   - 未登录自动重定向到登录页
   - 已登录访问登录页重定向到首页

2. **AuthLoadingGuard** (`src/components/global/auth-loading-guard/index.tsx`)
   - 显示加载状态
   - 避免认证检查时的页面闪烁
   - 提升用户体验

3. **AppSession** (`src/components/global/app-session/index.tsx`)
   - NextAuth SessionProvider 包装器
   - 提供全局 session 上下文

### 认证流程

```
用户访问页面
    ↓
AuthLoadingGuard 显示加载状态
    ↓
AppAuth 检查登录状态
    ↓
未登录? → 重定向到 /auth
    ↓
已登录 → 加载用户信息和积分
    ↓
显示页面内容
```

## 故障排查

### 无法连接数据库

检查 `DATABASE_URL` 配置是否正确，确保 PostgreSQL 服务正在运行。

### 登录失败

1. 检查邮箱和密码是否正确
2. 查看浏览器控制台是否有错误信息
3. 检查 NextAuth 配置是否正确

### 积分更新失败

1. 确保用户已登录
2. 检查 API 请求参数是否正确
3. 查看服务器日志获取详细错误信息

## 未来扩展

- [ ] 邮箱验证
- [ ] 密码重置
- [ ] 第三方登录（微信、支付宝）
- [ ] 积分充值页面
- [ ] 交易记录查询
- [ ] 用户资料编辑
