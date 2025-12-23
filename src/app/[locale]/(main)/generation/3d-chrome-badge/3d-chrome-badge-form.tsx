"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAtom } from "jotai";
import { exampleStoreAtom } from "@/stores/slices/example_store";
import { examples } from "./examples";
import { useGenerateImage } from "@/hooks/use-generate-image";
import { useTranslations } from "next-intl";
import { HexColorPicker } from "react-colorful";
import { threeDChromeBadgePrompt } from "./prompt";
import { models } from "@/constants/models";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function ThreeDChromeBadgeForm() {
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const { isGenerating, generateImg } = useGenerateImage();
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [slogan, setSlogan] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const t = useTranslations();
  const [model, setModel] = useState("gpt-image-1");
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const colorBoxRef = useRef<HTMLDivElement>(null);

  // 处理点击外部关闭颜色选择器
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickerRef.current &&
        colorBoxRef.current &&
        !colorPickerRef.current.contains(event.target as Node) &&
        !colorBoxRef.current.contains(event.target as Node)
      ) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };

  const handleGenerate = async () => {
    // 表单验证可以在此添加
    // if (!description) {
    //   toast.error("请输入徽章图案");
    //   return;
    // }
    const defaultValues = {
      description: t("3d_chrome_badge.defaultValue.description"),
      title: t("3d_chrome_badge.defaultValue.title"),
      slogan: t("3d_chrome_badge.defaultValue.slogan"),
      backgroundColor: t("3d_chrome_badge.defaultValue.backgroundColor"),
    };
    await generateImg({
      rawPrompt: threeDChromeBadgePrompt(
        description || defaultValues.description,
        title || defaultValues.title,
        slogan || defaultValues.slogan,
        backgroundColor || defaultValues.backgroundColor
      ),
      prompt: threeDChromeBadgePrompt(
        description || defaultValues.description,
        title || defaultValues.title,
        slogan || defaultValues.slogan,
        backgroundColor || defaultValues.backgroundColor
      ),
      type: "3d_chrome_badge",
      model,
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col gap-6 md:flex-row">
        {/* 左侧区域 - 徽章图案、上方标题、下方标题 */}
        <div className="flex w-full flex-col space-y-4 md:w-1/2">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="description" className="w-24">
                {t("3d_chrome_badge.label.description")}
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("3d_chrome_badge.placeholder.description")}
                className="flex-1"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label htmlFor="title" className="w-24">
                {t("3d_chrome_badge.label.title")}
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("3d_chrome_badge.placeholder.title")}
                className="flex-1"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label htmlFor="slogan" className="w-24">
                {t("3d_chrome_badge.label.slogan")}
              </Label>
              <Input
                id="slogan"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                placeholder={t("3d_chrome_badge.placeholder.slogan")}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {/* 右侧区域 - 背景颜色和生成按钮 */}
        <div className="mt-4 flex w-full flex-1 flex-col justify-between space-y-12 md:ml-4 md:mt-0 md:w-1/2">
          <div>
            <div className="relative space-y-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="model-select" className="w-14 flex-shrink-0">
                  {t("common.model")}
                </Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger id="model-select" className="w-full">
                    <SelectValue placeholder={t("common.model")} />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((modelOption) => (
                      <SelectItem key={modelOption} value={modelOption}>
                        {modelOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="backgroundColor" className="w-14">
                  {t("3d_chrome_badge.label.backgroundColor")}
                </Label>
                <div className="flex flex-1 items-center space-x-2">
                  <Input
                    id="backgroundColor"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    placeholder={t(
                      "3d_chrome_badge.placeholder.backgroundColor"
                    )}
                    className="flex-1"
                  />
                  <div
                    ref={colorBoxRef}
                    className="h-10 w-10 cursor-pointer rounded-full border border-gray-300"
                    style={{ backgroundColor }}
                    onClick={toggleColorPicker}
                  ></div>
                </div>
              </div>

              {showColorPicker && (
                <div
                  ref={colorPickerRef}
                  className="absolute right-0 z-10 mt-2"
                >
                  <div className="rounded-md border border-gray-200 bg-white p-3 shadow-lg">
                    <div className="mb-2 text-sm font-medium">
                      {t("3d_chrome_badge.label.selectColor")}
                    </div>
                    <HexColorPicker
                      color={backgroundColor}
                      onChange={(color) => setBackgroundColor(color)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
            <Button
              onClick={handleGenerate}
              className="w-full rounded-md bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
            >
              {t("global.generate_image")}
            </Button>
            <button
              className="text-center text-sm text-purple-500 underline sm:text-left lg:flex-shrink-0"
              onClick={() =>
                setExampleStore((prev) => ({
                  ...prev,
                  isModalOpen: true,
                  examples,
                }))
              }
            >
              {t("global.example")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
