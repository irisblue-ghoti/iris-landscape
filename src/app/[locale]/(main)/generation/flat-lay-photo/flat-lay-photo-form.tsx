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
import { threeDPeoplePrompt } from "./prompt";
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

export default function FlatLayPhotoForm() {
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageForm, setImageForm] = useState("");
  const { isGenerating, generateWithImage } = useImageGeneration();
  const t = useTranslations();
  const [model, setModel] = useState("gpt-image-1");

  const handleGenerate = async () => {
    if (!imageForm) {
      toast.error(t("threeD_people.warning.image"));
      return;
    }

    await generateWithImage({
      rawPrompt: "",
      prompt: threeDPeoplePrompt(),
      imageData: imageForm,
      shouldUseImageInput: true,
      type: "flat_lay_photo",
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

        <div className="mt-4 flex w-full flex-1 flex-col justify-end space-y-12 md:ml-4 md:mt-0 md:w-1/2">
          <div className="mb-4 flex w-full flex-col space-y-2">
            <Label className="mb-2 mr-1 text-sm font-medium sm:mb-0">
              {t("flat_lay_photo.label.description")}
            </Label>

            <div className="flex items-center">
              <Label htmlFor="model-select" className="w-16 flex-shrink-0">
                {t("common.model")}
              </Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger id="model-select" className="w-full">
                  <SelectValue placeholder={t("common.model")} />
                </SelectTrigger>
                <SelectContent>
                  {[...models, ...imageEditModels].map((modelOption) => (
                    <SelectItem key={modelOption} value={modelOption}>
                      {modelOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
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
            <Button
              onClick={handleGenerate}
              className="w-full rounded-md bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
            >
              {t("global.generate_image")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
