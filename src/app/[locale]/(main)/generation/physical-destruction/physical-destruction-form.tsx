"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAtom } from "jotai";
import { exampleStoreAtom } from "@/stores/slices/example_store";
import { examples } from "./examples";
import { useGenerateImage } from "@/hooks/use-generate-image";
import { toast } from "sonner";
import { physicalDestructionPrompt } from "./prompt";
import { useTranslations } from "next-intl";
import { models } from "@/constants/models";
export default function PhysicalDestructionForm() {
  const t = useTranslations();
  const [character, setCharacter] = useState("");
  const [theme, setTheme] = useState("");
  const [model, setModel] = useState("gpt-image-1");
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const { isGenerating, generateImg } = useGenerateImage();

  const defaultValues = {
    character: t("physical_destruction.placeholder.character"),
    theme: t("physical_destruction.placeholder.theme"),
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTheme(e.target.value);
  };

  const handleGenerate = async () => {
    // if (!character) {
    //   toast.error(t("physical_destruction.warning.character"));
    //   return;
    // }
    // if (!theme) {
    //   toast.error(t("physical_destruction.warning.theme"));
    //   return;
    // }

    const newCharacter =
      character || defaultValues.character.replace("e.g. ", "");
    const newTheme = theme || defaultValues.theme.replace("e.g. ", "");

    await generateImg({
      rawPrompt: `${newCharacter},${newTheme}`,
      prompt: physicalDestructionPrompt(newCharacter, newTheme),
      size: "1024x1536",
      type: "physical_destruction",
      model: model,
      isOptimize: true,
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Label htmlFor="character" className="w-20 flex-shrink-0">
            {t("physical_destruction.label.character")}
          </Label>
          <Input
            id="character"
            value={character}
            onChange={(e) => setCharacter(e.target.value)}
            placeholder={t("physical_destruction.placeholder.character")}
          />
        </div>

        <div className="flex items-start gap-4">
          <Label htmlFor="theme" className="w-20 flex-shrink-0 pt-2">
            {t("physical_destruction.label.theme")}
          </Label>
          <Textarea
            id="theme"
            value={theme}
            onChange={handleThemeChange}
            placeholder={t("physical_destruction.placeholder.theme")}
            className="min-h-[100px]"
          />
        </div>

        <div className="flex items-center gap-4">
          <Label htmlFor="model-select" className="w-20 flex-shrink-0">
            {t("common.model")}
          </Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger id="model-select">
              <SelectValue placeholder={t("common.model")} />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
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
