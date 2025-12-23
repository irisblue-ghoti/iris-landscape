"use client";

import type React from "react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAtom } from "jotai";
import { exampleStoreAtom } from "@/stores/slices/example_store";
import { useImageGeneration } from "@/hooks/use-image-generation";
import { toast } from "sonner";
import ImageDrop from "@/components/basic/change-style/text/image-drop";
import { useTranslations } from "next-intl";
import { generationStoreAtom } from "@/stores/slices/generation_store";
import { coinImagePrompt, coinTextPrompt } from "./prompt";
import { examples } from "./examples";
import { models } from "@/constants/models";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
export default function CoinForm() {
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageForm, setImageForm] = useState("");
  const [activeTab, setActiveTab] = useState<"text" | "upload">("text");
  const [year, setYear] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [coinPattern, setCoinPattern] = useState("");
  const { isGenerating, generateWithImage } = useImageGeneration();
  const [generationCount, setGenerationCount] = useAtom(generationStoreAtom);
  const t = useTranslations();
  // 为每个标签页维护独立的模型选择状态
  const [textModel, setTextModel] = useState("gpt-image-1");
  const [uploadModel, setUploadModel] = useState("gpt-image-1");

  // 根据当前标签页获取可用的模型列表
  const getAvailableModels = () => {
    if (activeTab === "upload") {
      return [...models];
    }
    return models; // text 模式只使用基础模型
  };

  // 获取当前活动标签页的模型
  const getCurrentModel = () => {
    return activeTab === "text" ? textModel : uploadModel;
  };

  // 设置当前活动标签页的模型
  const setCurrentModel = (model: string) => {
    if (activeTab === "text") {
      setTextModel(model);
    } else {
      setUploadModel(model);
    }
  };
  const defaultValues = {
    year: t("coin.defaultValue.year"),
    bottomText: t("coin.defaultValue.bottomText"),
    coinPattern: t("coin.defaultValue.coinPattern"),
  };

  const handleGenerate = async () => {
    if (generationCount.generationCount >= 4) {
      toast.warning(t("global.error.max_generation"));
      return;
    }

    if (activeTab === "text") {
      try {
        await generateWithImage({
          rawPrompt: ` ${coinPattern || defaultValues.coinPattern},  ${year || defaultValues.year},  ${bottomText || defaultValues.bottomText}`,
          prompt: coinTextPrompt(
            coinPattern || defaultValues.coinPattern,
            year || defaultValues.year,
            bottomText || defaultValues.bottomText
          ),
          shouldUseImageInput: false,
          type: "coin",
          model: getCurrentModel(),
        });
      } catch (error) {
      } finally {
        setGenerationCount((prev) => ({
          ...prev,
          generationCount: Math.max(prev.generationCount - 1, 0),
        }));
      }
    }

    if (activeTab === "upload") {
      if (!imageForm) {
        toast.error(t("generation-form.image_warning"));
        return;
      }
      try {
        await generateWithImage({
          rawPrompt: `  ${year || defaultValues.year},  ${bottomText || defaultValues.bottomText}`,
          prompt: coinImagePrompt(
            year || defaultValues.year,
            bottomText || defaultValues.bottomText
          ),
          imageData: imageForm,
          shouldUseImageInput: true,
          type: "coin",
          model: getCurrentModel(),
        });
      } catch (error) {
      } finally {
        setGenerationCount((prev) => ({
          ...prev,
          generationCount: Math.max(prev.generationCount - 1, 0),
        }));
      }
    }
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col">
      <div className="mb-4 flex">
        <button
          onClick={() => setActiveTab("text")}
          className={`flex-1 rounded-l-md px-2 py-2 text-sm md:px-4 md:text-base ${
            activeTab === "text" ? "bg-purple-500 text-white" : "bg-gray-100"
          }`}
        >
          {t("generation-form.text_input")}
        </button>
        <button
          onClick={() => setActiveTab("upload")}
          className={`flex-1 rounded-r-md px-2 py-2 text-sm md:px-4 md:text-base ${
            activeTab === "upload" ? "bg-purple-500 text-white" : "bg-gray-100"
          }`}
        >
          {t("generation-form.upload_input")}
        </button>
      </div>

      <div className="flex w-full flex-col gap-4 md:flex-row">
        {activeTab === "upload" && (
          <div className="w-full md:w-3/5">
            <ImageDrop
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
              imageForm={imageForm}
              setImageForm={setImageForm}
              height="224px"
              width="100%"
            />
          </div>
        )}

        <div className={`w-full ${activeTab === "upload" ? "md:w-2/5" : ""}`}>
          <div className="mb-4 flex items-center gap-4">
            <Label htmlFor="model-select" className="w-28 text-sm font-medium">
              {t("common.model")}
            </Label>
            <Select value={getCurrentModel()} onValueChange={setCurrentModel}>
              <SelectTrigger id="model-select" className="w-full">
                <SelectValue placeholder={t("common.model")} />
              </SelectTrigger>
              <SelectContent>
                {getAvailableModels().map((modelOption) => (
                  <SelectItem key={modelOption} value={modelOption}>
                    {modelOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {activeTab === "text" && (
            <div className="mb-4 flex items-center">
              <label className="w-28 text-sm font-medium">
                {t("coin.label.coinPattern")}
              </label>
              <Input
                value={coinPattern}
                onChange={(e) => setCoinPattern(e.target.value)}
                placeholder={t("coin.placeholder.coinPattern")}
                className="flex-1"
              />
            </div>
          )}

          <div className="mb-4 flex items-center">
            <label className="w-28 text-sm font-medium">
              {t("coin.label.year")}
            </label>
            <Input
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder={t("coin.placeholder.year")}
              className="flex-1"
            />
          </div>

          <div className="mb-4 flex items-center">
            <label className="w-28 text-sm font-medium">
              {t("coin.label.bottomText")}
            </label>
            <Input
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
              placeholder={t("coin.placeholder.bottomText")}
              className="flex-1"
            />
          </div>

          <div className="mt-6 flex items-center justify-end space-x-2">
            <Button
              onClick={handleGenerate}
              className={`${activeTab === "text" ? "px-8" : ""} rounded-md bg-purple-500 text-white hover:bg-purple-600`}
            >
              {t("global.generate_image")}
            </Button>
            <button
              className="flex-shrink-0 text-sm text-purple-500 underline"
              onClick={() =>
                setExampleStore((prev) => ({
                  ...prev,
                  isModalOpen: true,
                  examples: examples,
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
