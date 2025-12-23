"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCredits } from "@/hooks/user";
import { useToast } from "@/hooks/global/use-toast";
import { Plus, Loader2 } from "lucide-react";

export function CreditTestPanel() {
  const { updateCredits } = useCredits();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("100");
  const [type, setType] = useState("recharge");
  const [description, setDescription] = useState("");

  const handleAddCredit = async () => {
    setLoading(true);
    try {
      const numAmount = parseInt(amount);
      if (isNaN(numAmount) || numAmount === 0) {
        toast({
          title: "错误",
          description: "请输入有效的积分数量",
          variant: "destructive",
        });
        return;
      }

      const success = await updateCredits(
        numAmount,
        type,
        description || `测试${type}`
      );
      if (success) {
        toast({
          title: "成功",
          description: `已${numAmount > 0 ? "增加" : "减少"} ${Math.abs(numAmount)} 积分`,
        });
        setDescription("");
      }
    } catch (error) {
      toast({
        title: "错误",
        description: "操作失败",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: "充值 +100", amount: 100, type: "recharge", desc: "测试充值" },
    { label: "消费 -10", amount: -10, type: "consume", desc: "测试消费" },
    { label: "退款 +50", amount: 50, type: "refund", desc: "测试退款" },
    { label: "奖励 +20", amount: 20, type: "reward", desc: "签到奖励" },
  ];

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="text-lg">测试工具</CardTitle>
        <CardDescription>用于测试积分系统（仅开发环境）</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 快捷操作 */}
        <div>
          <Label className="mb-2 block text-sm">快捷操作</Label>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                size="sm"
                onClick={async () => {
                  await updateCredits(action.amount, action.type, action.desc);
                  toast({
                    title: "成功",
                    description: action.desc,
                  });
                }}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* 自定义操作 */}
        <div className="space-y-3 border-t pt-4">
          <div className="space-y-2">
            <Label htmlFor="amount">积分数量</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="输入积分数量（正数增加，负数减少）"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">类型</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recharge">充值</SelectItem>
                <SelectItem value="consume">消费</SelectItem>
                <SelectItem value="refund">退款</SelectItem>
                <SelectItem value="reward">奖励</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">描述（可选）</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="输入操作描述"
            />
          </div>

          <Button
            onClick={handleAddCredit}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                处理中...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                执行操作
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
