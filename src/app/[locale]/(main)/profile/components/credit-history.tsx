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
import {
  Loader2,
  ArrowUpCircle,
  ArrowDownCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CreditRecord {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function CreditHistory() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<CreditRecord[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchRecords(1);
  }, []);

  const fetchRecords = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/user/credit-records?page=${page}&limit=20`);
      if (res.ok) {
        const data = await res.json();
        setRecords(data.records);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch credit records:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    const typeMap: Record<
      string,
      { label: string; variant: "default" | "secondary" | "destructive" }
    > = {
      recharge: { label: "充值", variant: "default" },
      consume: { label: "消费", variant: "destructive" },
      refund: { label: "退款", variant: "secondary" },
      reward: { label: "奖励", variant: "default" },
    };
    return typeMap[type] || { label: type, variant: "default" as const };
  };

  if (loading && records.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>积分记录</CardTitle>
            <CardDescription>查看您的所有积分变动记录</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchRecords(pagination.page)}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-slate-100 p-4 dark:bg-slate-800">
              <ArrowUpCircle className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-lg font-medium text-slate-900 dark:text-white">
              暂无记录
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              您还没有任何积分变动记录
            </p>
          </div>
        ) : (
          <>
            {/* 记录列表 */}
            <div className="space-y-3">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between rounded-lg border bg-white p-4 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/50"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        record.amount > 0
                          ? "bg-green-100 dark:bg-green-900/20"
                          : "bg-red-100 dark:bg-red-900/20"
                      }`}
                    >
                      {record.amount > 0 ? (
                        <ArrowUpCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <ArrowDownCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getTypeLabel(record.type).variant}>
                          {getTypeLabel(record.type).label}
                        </Badge>
                        {record.description && (
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {record.description}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {new Date(record.createdAt).toLocaleString("zh-CN", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`text-lg font-semibold ${
                      record.amount > 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {record.amount > 0 ? "+" : ""}
                    {record.amount}
                  </div>
                </div>
              ))}
            </div>

            {/* 分页控制 */}
            {pagination.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between border-t pt-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  共 {pagination.total} 条记录，第 {pagination.page} /{" "}
                  {pagination.totalPages} 页
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchRecords(pagination.page - 1)}
                    disabled={pagination.page === 1 || loading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    上一页
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchRecords(pagination.page + 1)}
                    disabled={
                      pagination.page === pagination.totalPages || loading
                    }
                  >
                    下一页
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
