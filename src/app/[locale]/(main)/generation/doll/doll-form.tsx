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
import { changeAgePrompt } from "./prompt";
import ImageDrop from "@/components/basic/change-style/text/image-drop";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { imageEditModels, models } from "@/constants/models";

export default function DollForm() {
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [accessories, setAccessories] = useState("");
  const [model, setModel] = useState("gpt-image-1");
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageForm, setImageForm] = useState("");
  const { isGenerating, generateWithImage } = useImageGeneration();
  const t = useTranslations();

  const handleGenerate = async () => {
    if (!title) {
      toast.error(t("doll.warning.title"));
      return;
    }
    if (!subtitle) {
      toast.error(t("doll.warning.subtitle"));
      return;
    }
    if (!accessories) {
      toast.error(t("doll.warning.accessories"));
      return;
    }

    if (!imageForm) {
      toast.error(t("doll.warning.image"));
      return;
    }

    await generateWithImage({
      rawPrompt: `${title} ${subtitle} ${accessories}`,
      prompt: changeAgePrompt(title, subtitle, accessories),
      imageData: imageForm,
      shouldUseImageInput: true,
      type: "doll",
      model: model,
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

        <div className="mt-4 flex w-full flex-1 flex-col justify-between space-y-4 md:ml-4 md:mt-0 md:w-1/2">
          <div className="flex w-full flex-col space-y-2">
            <Label className="mr-1 whitespace-nowrap text-sm font-medium sm:mb-0">
              {t("doll.label.title")}
            </Label>
            <Input
              placeholder={t("doll.placeholder.title")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex w-full flex-col space-y-2">
            <Label className="mr-1 whitespace-nowrap text-sm font-medium sm:mb-0">
              {t("doll.label.subtitle")}
            </Label>
            <Input
              placeholder={t("doll.placeholder.subtitle")}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex flex-1">
            <div className="flex w-full flex-1 flex-col space-y-2">
              <Label className="mb-2 mr-1 whitespace-nowrap text-sm font-medium sm:mb-0">
                {t("doll.label.accessories")}
              </Label>
              <Textarea
                placeholder={t("doll.placeholder.accessories")}
                value={accessories}
                onChange={(e) => setAccessories(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex w-full flex-col space-y-2">
            <Label className="mr-1 whitespace-nowrap text-sm font-medium sm:mb-0">
              {t("common.model")}
            </Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-full">
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
