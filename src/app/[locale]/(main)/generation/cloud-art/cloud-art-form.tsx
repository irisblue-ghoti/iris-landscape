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
import { cloudArtPrompt } from "./prompt";
import { useTranslations } from "next-intl";
import { models } from "@/constants/models";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";

export default function CloudArtForm() {
  const t = useTranslations();
  const [shape, setShape] = useState("");
  const [location, setLocation] = useState("");
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const { isGenerating, generateImg } = useGenerateImage();
  const [model, setModel] = useState("gpt-image-1");
  const handleGenerate = async () => {
    // if (!shape) {
    //   toast.error(t("cloud-art-form.warning.shape"));
    //   return;
    // }
    // if (!location) {
    //   toast.error(t("cloud-art-form.warning.location"));
    //   return;
    // }

    const defaultValues = {
      shape: t("cloud-art-form.defaultValue.shape"),
      location: t("cloud-art-form.defaultValue.location"),
    };

    await generateImg({
      rawPrompt: `${shape || defaultValues.shape},${location || defaultValues.location}`,
      prompt: cloudArtPrompt(
        shape || defaultValues.shape,
        location || defaultValues.location
      ),
      size: "1024x1536",
      type: "cloud_art",
      model: model,
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Label htmlFor="model-select" className="w-20 flex-shrink-0">
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
        <div className="flex items-start gap-4">
          <Label htmlFor="shape" className="w-20 flex-shrink-0 pt-2">
            {t("cloud-art-form.label.shape")}
          </Label>
          <Input
            id="shape"
            value={shape}
            onChange={(e) => setShape(e.target.value)}
            placeholder={t("cloud-art-form.placeholder.shape")}
          />
        </div>

        <div className="flex items-start gap-4">
          <Label htmlFor="location" className="w-20 flex-shrink-0 pt-2">
            {t("cloud-art-form.label.location")}
          </Label>
          <Textarea
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={t("cloud-art-form.placeholder.location")}
            className="min-h-[100px]"
          />
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
