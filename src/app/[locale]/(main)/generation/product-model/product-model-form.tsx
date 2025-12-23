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
import { useImageGeneration } from "@/hooks/use-image-generation";
import { toast } from "sonner";
import { productModelPrompt } from "./prompt";
import { appConfigAtom, store } from "@/stores";
import ImageDrop from "@/components/basic/change-style/text/image-drop";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { imageEditModels, models } from "@/constants/models";

export default function ProductModelForm() {
  const [gender, setGender] = useState("male");
  const [ethnicity, setEthnicity] = useState("white");
  const [model, setModel] = useState("gpt-image-1");
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageForm, setImageForm] = useState("");
  const { isGenerating, generateWithImage } = useImageGeneration();
  const t = useTranslations();
  const handleGenerate = async () => {
    if (!imageForm) {
      toast.error(t("product-model.warning.image"));
      return;
    }

    await generateWithImage({
      rawPrompt: `${ethnicity},${gender}`,
      prompt: productModelPrompt(ethnicity, gender),
      imageData: imageForm,
      shouldUseImageInput: true,
      type: "product_model",
      model: model,
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex w-full flex-col space-y-4">
          <Label htmlFor="character">
            {t("product-model.label.upload_image")}
          </Label>
          <Card className="flex h-64 flex-col items-center justify-center">
            <ImageDrop
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
              imageForm={imageForm}
              setImageForm={setImageForm}
            />
          </Card>
        </div>

        <div className="mt-4 flex flex-1 flex-col justify-end md:ml-4 md:mt-0">
          <div className="mb-4 flex w-full flex-col sm:flex-row sm:items-center">
            <Label className="mb-2 mr-1 whitespace-nowrap text-sm font-medium sm:mb-0 sm:min-w-16">
              {t("product-model.label.model_gender")}
            </Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="选择性别" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">
                  {t("product-model.label.male")}
                </SelectItem>
                <SelectItem value="female">
                  {t("product-model.label.female")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4 flex w-full flex-col sm:flex-row sm:items-center">
            <Label className="mb-2 mr-1 whitespace-nowrap text-sm font-medium sm:mb-0 sm:min-w-16">
              {t("product-model.label.model_ethnicity")}
            </Label>
            <Select value={ethnicity} onValueChange={setEthnicity}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="选择人种" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asian">
                  {t("product-model.label.asian")}
                </SelectItem>
                <SelectItem value="white">
                  {t("product-model.label.white")}
                </SelectItem>
                <SelectItem value="black">
                  {t("product-model.label.black")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4 flex w-full flex-col sm:flex-row sm:items-center">
            <Label className="mb-2 mr-1 whitespace-nowrap text-sm font-medium sm:mb-0 sm:min-w-16">
              {t("common.model")}
            </Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={t("common.model")} />
              </SelectTrigger>
              <SelectContent>
                {[...models, ...imageEditModels].map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
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
