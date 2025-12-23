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
import { useTranslations } from "next-intl";
import { creativeMinimalistAdPrompt } from "./prompt";
import { models } from "@/constants/models";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function CreativeMinimalistAdForm() {
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const [object, setObject] = useState("");
  const [text, setText] = useState("");
  const [logo, setLogo] = useState("");
  const { isGenerating, generateImg } = useGenerateImage();
  const t = useTranslations();
  const defaultValues = {
    object: t("creative_minimalist_ad.defaultValue.object"),
    text: t("creative_minimalist_ad.defaultValue.text"),
    logo: t("creative_minimalist_ad.defaultValue.logo"),
  };
  const [model, setModel] = useState("gpt-image-1");
  const handleGenerate = async () => {
    await generateImg({
      rawPrompt: `${object || defaultValues.object},${text || defaultValues.text},${logo || defaultValues.logo}`,
      prompt: creativeMinimalistAdPrompt(
        object || defaultValues.object,
        text || defaultValues.text,
        logo || defaultValues.logo
      ),
      type: "creative_minimalist_ad",
      model,
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="space-y-6">
        <div className="flex items-center">
          <Label htmlFor="model-select" className="w-16 flex-shrink-0">
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
        <div className="flex items-center">
          <Label htmlFor="object" className="w-16 flex-shrink-0">
            {t("creative_minimalist_ad.label.object")}
          </Label>
          <Input
            id="object"
            value={object}
            onChange={(e) => setObject(e.target.value)}
            placeholder={t("creative_minimalist_ad.placeholder.object")}
          />
        </div>

        <div className="flex items-center">
          <Label htmlFor="text" className="w-16 flex-shrink-0">
            {t("creative_minimalist_ad.label.text")}
          </Label>
          <Input
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("creative_minimalist_ad.placeholder.text")}
          />
        </div>

        <div className="flex items-center">
          <Label htmlFor="logo" className="w-16 flex-shrink-0">
            {t("creative_minimalist_ad.label.logo")}
          </Label>
          <Input
            id="logo"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            placeholder={t("creative_minimalist_ad.placeholder.logo")}
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
