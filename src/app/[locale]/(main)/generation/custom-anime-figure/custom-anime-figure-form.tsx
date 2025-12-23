"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { exampleStoreAtom } from "@/stores/slices/example_store";
import { examples } from "./examples";
import { useImageGeneration } from "@/hooks/use-image-generation";
import { toast } from "sonner";
import ImageDrop from "@/components/basic/change-style/text/image-drop";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { customAnimeFigurePrompt } from "./prompt";
import { imageEditModels, models } from "@/constants/models";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function CustomAnimeFigureForm() {
  const t = useTranslations();
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageForm, setImageForm] = useState("");
  const { isGenerating, generateWithImage } = useImageGeneration();
  const [model, setModel] = useState("gpt-image-1");
  const handleGenerate = async () => {
    if (!imageForm) {
      toast.error(t("ghibli-style.warning.image"));
      return;
    }

    await generateWithImage({
      rawPrompt: "",
      prompt: customAnimeFigurePrompt(),
      imageData: imageForm,
      shouldUseImageInput: true,
      type: "custom_anime_figure",
      size: "1024x1536",
      model,
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex w-full flex-col space-y-4 md:w-1/2">
          <Card className="flex h-64 flex-col items-center justify-center">
            <ImageDrop
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
              imageForm={imageForm}
              setImageForm={setImageForm}
            />
          </Card>
        </div>

        <div className="mt-4 flex w-full flex-1 flex-col justify-end space-y-12 md:ml-4 md:mt-0 md:w-1/2">
          <Label className="mb-2 mr-1 text-sm font-medium sm:mb-0">
            {t("custom_anime_figure.placeholder.text")}
          </Label>
          <div className="flex items-center gap-4">
            <Label htmlFor="model-select" className="w-14 flex-shrink-0">
              {t("common.model")}
            </Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger id="model-select" className="w-full">
                <SelectValue placeholder={t("common.model")} />
              </SelectTrigger>
              <SelectContent>
                {[...models].map((modelOption) => (
                  <SelectItem key={modelOption} value={modelOption}>
                    {modelOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
