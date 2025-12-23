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
import { shadowArtPrompt } from "./prompt";
import { useTranslations } from "next-intl";
import { models } from "@/constants/models";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
export default function ShadowArtForm() {
  const [text, setText] = useState("");
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const { isGenerating, generateImg } = useGenerateImage();
  const t = useTranslations();
  const [model, setModel] = useState("gpt-image-1");
  const handleGenerate = async () => {
    // if (!text) {
    //   toast.error(t("shadow-art.warning.text"));
    //   return;
    // }
    const defaultValues = {
      text: t("shadow-art.defaultValue.text"),
    };

    await generateImg({
      rawPrompt: text || defaultValues.text,
      prompt: shadowArtPrompt(text || defaultValues.text),
      isOptimize: false,
      type: "shadow_art",
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
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
        <div className="flex items-start gap-4">
          <Label htmlFor="text" className="w-16 flex-shrink-0 pt-2">
            {t("shadow-art.label.text")}
          </Label>
          <Textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("shadow-art.placeholder.text")}
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
