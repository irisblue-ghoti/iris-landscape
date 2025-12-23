"use client";

import React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAtom } from "jotai";
import { exampleStoreAtom } from "@/stores/slices/example_store";
import { examples } from "./examples";
import { useGenerateImage } from "@/hooks/use-generate-image";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { monsterLetterPrompt } from "./prompt";
import { models } from "@/constants/models";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function MonsterLetterForm() {
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const [lettersOrWords, setLettersOrWords] = useState("");
  const [colorTone, setColorTone] = useState("");
  const [emotionalExpression, setEmotionalExpression] = useState("");
  const { isGenerating, generateImg } = useGenerateImage();
  const [model, setModel] = useState("gpt-image-1");
  const t = useTranslations();
  const defaultValues = {
    lettersOrWords: t("monster_letter.defaultValue.lettersOrWords"),
    colorTone: t("monster_letter.defaultValue.colorTone"),
    emotionalExpression: t("monster_letter.defaultValue.emotionalExpression"),
  };
  const handleGenerate = async () => {
    await generateImg({
      rawPrompt: `${lettersOrWords || defaultValues.lettersOrWords},${colorTone || defaultValues.colorTone},${emotionalExpression || defaultValues.emotionalExpression}`,
      prompt: monsterLetterPrompt(
        lettersOrWords || defaultValues.lettersOrWords,
        colorTone || defaultValues.colorTone,
        emotionalExpression || defaultValues.emotionalExpression
      ),
      type: "monster_letter",
      model,
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="space-y-6">
        <div className="flex items-center">
          <Label
            htmlFor="model-select"
            className="w-20 flex-shrink-0 text-nowrap"
          >
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
          <Label
            htmlFor="lettersOrWords"
            className="w-20 flex-shrink-0 text-nowrap"
          >
            {t("monster_letter.label.lettersOrWords")}
          </Label>
          <Input
            id="lettersOrWords"
            value={lettersOrWords}
            onChange={(e) => setLettersOrWords(e.target.value)}
            placeholder={t("monster_letter.placeholder.lettersOrWords")}
          />
        </div>

        <div className="flex items-center">
          <Label
            htmlFor="emotionalExpression"
            className="w-20 flex-shrink-0 text-nowrap"
          >
            {t("monster_letter.label.emotionalExpression")}
          </Label>
          <Input
            id="emotionalExpression"
            value={emotionalExpression}
            onChange={(e) => setEmotionalExpression(e.target.value)}
            placeholder={t("monster_letter.placeholder.emotionalExpression")}
          />
        </div>

        <div className="flex items-center">
          <Label htmlFor="colorTone" className="w-20 flex-shrink-0 text-nowrap">
            {t("monster_letter.label.colorTone")}
          </Label>
          <Input
            id="colorTone"
            value={colorTone}
            onChange={(e) => setColorTone(e.target.value)}
            placeholder={t("monster_letter.placeholder.colorTone")}
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
