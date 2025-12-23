"use client";

import { useState, useEffect } from "react";
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
import { useUser } from "@/hooks/user";
import { Loader2, Save, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/global/use-toast";

interface ProfileData {
  id: string;
  email: string;
  name: string | null;
  credits: number;
  createdAt: string;
  updatedAt: string;
}

export function ProfileSettings() {
  const { user } = useUser();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setName(data.name || "");
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 验证密码
      if (newPassword || confirmPassword) {
        if (newPassword !== confirmPassword) {
          toast({
            title: "错误",
            description: "两次输入的密码不一致",
            variant: "destructive",
          });
          return;
        }
        if (newPassword.length < 6) {
          toast({
            title: "错误",
            description: "密码长度至少为6位",
            variant: "destructive",
          });
          return;
        }
        if (!currentPassword) {
          toast({
            title: "错误",
            description: "请输入当前密码",
            variant: "destructive",
          });
          return;
        }
      }

      const updateData: any = { name };
      if (newPassword) {
        updateData.password = newPassword;
        updateData.currentPassword = currentPassword;
      }

      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (res.ok) {
        toast({
          title: "成功",
          description: "个人资料已更新",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        await fetchProfile();
      } else {
        const error = await res.json();
        toast({
          title: "错误",
          description: error.error || "更新失败",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "错误",
        description: "网络错误",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 账户信息卡片 */}
      <Card>
        <CardHeader>
          <CardTitle>账户信息</CardTitle>
          <CardDescription>查看您的账户基本信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-sm text-slate-600 dark:text-slate-400">
                邮箱
              </Label>
              <p className="mt-1 text-base font-medium">{profile.email}</p>
            </div>
            <div>
              <Label className="text-sm text-slate-600 dark:text-slate-400">
                当前积分
              </Label>
              <p className="mt-1 text-base font-medium text-amber-600">
                {profile.credits}
              </p>
            </div>
            <div>
              <Label className="text-sm text-slate-600 dark:text-slate-400">
                注册时间
              </Label>
              <p className="mt-1 text-base font-medium">
                {new Date(profile.createdAt).toLocaleDateString("zh-CN")}
              </p>
            </div>
            <div>
              <Label className="text-sm text-slate-600 dark:text-slate-400">
                最后更新
              </Label>
              <p className="mt-1 text-base font-medium">
                {new Date(profile.updatedAt).toLocaleDateString("zh-CN")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 编辑资料卡片 */}
      <Card>
        <CardHeader>
          <CardTitle>编辑资料</CardTitle>
          <CardDescription>更新您的个人信息和密码</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 昵称 */}
            <div className="space-y-2">
              <Label htmlFor="name">昵称</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入昵称"
              />
            </div>

            {/* 修改密码区域 */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-medium">修改密码</h3>

              <div className="space-y-2">
                <Label htmlFor="currentPassword">当前密码</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="请输入当前密码"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">新密码</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="请输入新密码（至少6位）"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">确认新密码</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="请再次输入新密码"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  保存更改
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
