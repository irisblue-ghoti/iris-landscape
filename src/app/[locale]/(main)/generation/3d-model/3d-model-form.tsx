"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAtom } from "jotai";
import { exampleStoreAtom } from "@/stores/slices/example_store";
import { examples } from "./examples";
import { useGenerateImage } from "@/hooks/use-generate-image";
import { toast } from "sonner";
import { threeDModelPrompt } from "./prompt";
import { useTranslations } from "next-intl";
import { models } from "@/constants/models";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ThreeDModelForm() {
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const { isGenerating, generateImg } = useGenerateImage();
  const [model, setModel] = useState("");
  const [imageModel, setImageModel] = useState("gpt-image-1");
  const [bottomText, setBottomText] = useState("");
  const [detailDescription, setDetailDescription] = useState("");
  const t = useTranslations();

  const handleGenerate = async () => {
    // if (!model) {
    //   toast.error(t("3d-model.warning.model"));
    //   return;
    // }
    // if (!bottomText) {
    //   toast.error(t("3d-model.warning.bottomText"));
    //   return;
    // }
    // if (!detailDescription) {
    //   toast.error(t("3d-model.warning.detailDescription"));
    //   return;
    // }
    const defaultValues = {
      model: t("3d-model.defaultValue.model"),
      bottomText: t("3d-model.defaultValue.bottomText"),
      detailDescription: t("3d-model.defaultValue.detailDescription"),
    };
    await generateImg({
      rawPrompt: `${model || defaultValues.model},${bottomText || defaultValues.bottomText},${detailDescription || defaultValues.detailDescription}`,
      prompt: threeDModelPrompt(
        model || defaultValues.model,
        bottomText || defaultValues.bottomText,
        detailDescription || defaultValues.detailDescription
      ),
      type: "3d_model",
      model: imageModel,
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Label htmlFor="model" className="w-16 flex-shrink-0 text-wrap">
            {t("3d-model.label.model")}
          </Label>
          <Input
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder={t("3d-model.placeholder.model")}
            className="flex-1"
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Label htmlFor="bottomText" className="w-16 flex-shrink-0 text-wrap">
            {t("3d-model.label.bottomText")}
          </Label>
          <Input
            id="bottomText"
            value={bottomText}
            onChange={(e) => setBottomText(e.target.value)}
            placeholder={t("3d-model.placeholder.bottomText")}
            className="flex-1"
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <Label
            htmlFor="detailDescription"
            className="w-16 flex-shrink-0 text-wrap"
          >
            {t("3d-model.label.detailDescription")}
          </Label>
          <Textarea
            id="detailDescription"
            value={detailDescription}
            onChange={(e) => setDetailDescription(e.target.value)}
            placeholder={t("3d-model.placeholder.detailDescription")}
            rows={3}
            className="flex-1"
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Label htmlFor="imageModel" className="w-16 flex-shrink-0 text-wrap">
            {t("common.model")}
          </Label>
          <Select value={imageModel} onValueChange={setImageModel}>
            <SelectTrigger id="imageModel" className="flex-1">
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

        <div className="flex items-center justify-end space-x-4">
          <button
            className="text-sm text-purple-500 underline"
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
          <Button
            className="bg-purple-500 hover:bg-purple-600"
            onClick={handleGenerate}
          >
            {t("global.generate_image")}
          </Button>
        </div>
      </div>
    </div>
  );
}
