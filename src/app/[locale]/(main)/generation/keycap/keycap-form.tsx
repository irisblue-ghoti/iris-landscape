"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAtom } from "jotai";
import { exampleStoreAtom } from "@/stores/slices/example_store";
import { examples } from "./examples";
import { useGenerateImage } from "@/hooks/use-generate-image";
import { toast } from "sonner";
import { coldColorPrompt, warmColorPrompt } from "./prompt";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { models } from "@/constants/models";

type ColorTone = "warm" | "cold";

export default function KeycapForm() {
  const [mainKey, setMainKey] = useState("");
  const [surroundingKeys, setSurroundingKeys] = useState("");
  const [internalScene, setInternalScene] = useState("");
  const [sceneDescription, setSceneDescription] = useState("");
  const [colorTone, setColorTone] = useState<ColorTone>("warm");
  const [model, setModel] = useState("gpt-image-1");
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const { isGenerating, generateImg } = useGenerateImage();
  const t = useTranslations();

  const handleGenerate = async () => {
    // if (!mainKey) {
    //   toast.error(t("keycap.warning.mainKey"));
    //   return;
    // }
    // if (!surroundingKeys) {
    //   toast.error(t("keycap.warning.surroundingKeys"));
    //   return;
    // }
    // if (!internalScene) {
    //   toast.error(t("keycap.warning.internalScene"));
    //   return;
    // }
    // if (!sceneDescription) {
    //   toast.error(t("keycap.warning.sceneDescription"));
    //   return;
    // }
    const defaultValues = {
      mainKey: t(`keycap.defaultValue.${colorTone}.mainKey`),
      surroundingKeys: t(`keycap.defaultValue.${colorTone}.surroundingKeys`),
      internalScene: t(`keycap.defaultValue.${colorTone}.internalScene`),
      sceneDescription: t(`keycap.defaultValue.${colorTone}.sceneDescription`),
    };
    const prompt =
      colorTone === "warm"
        ? warmColorPrompt(
            mainKey || defaultValues.mainKey,
            surroundingKeys || defaultValues.surroundingKeys,
            internalScene || defaultValues.internalScene,
            sceneDescription || defaultValues.sceneDescription
          )
        : coldColorPrompt(
            mainKey || defaultValues.mainKey,
            surroundingKeys || defaultValues.surroundingKeys,
            internalScene || defaultValues.internalScene,
            sceneDescription || defaultValues.sceneDescription
          );

    await generateImg({
      rawPrompt: `${mainKey || defaultValues.mainKey}, ${surroundingKeys || defaultValues.surroundingKeys}, ${internalScene || defaultValues.internalScene}, ${sceneDescription || defaultValues.sceneDescription}`,
      prompt: prompt,
      isOptimize: true,
      type: "keycap",
      model: model,
    });
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="flex flex-col space-y-6">
        {/* Top section with three input fields */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col space-y-2">
            <label htmlFor="mainKey" className="text-sm font-medium">
              {t("keycap.label.mainKey")}
            </label>
            <Input
              id="mainKey"
              placeholder={t("keycap.placeholder.mainKey")}
              value={mainKey}
              onChange={(e) => setMainKey(e.target.value)}
              className="border-2"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="surroundingKeys" className="text-sm font-medium">
              {t("keycap.label.surroundingKeys")}
            </label>
            <Input
              id="surroundingKeys"
              placeholder={t("keycap.placeholder.surroundingKeys")}
              value={surroundingKeys}
              onChange={(e) => setSurroundingKeys(e.target.value)}
              className="border-2"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="internalScene" className="text-sm font-medium">
              {t("keycap.label.internalScene")}
            </label>
            <Input
              id="internalScene"
              placeholder={t(`keycap.placeholder.internalScene.${colorTone}`)}
              value={internalScene}
              onChange={(e) => setInternalScene(e.target.value)}
              className="border-2"
            />
          </div>
        </div>

        {/* Bottom section with text area and controls */}
        <div className="flex flex-col gap-4 md:flex-row">
          {/* Left side - large text area */}
          <div className="flex-1">
            <div className="flex flex-col space-y-2">
              <label htmlFor="sceneDescription" className="text-sm font-medium">
                {t("keycap.label.sceneDescription")}
              </label>
              <Textarea
                id="sceneDescription"
                placeholder={t(
                  `keycap.placeholder.sceneDescription.${colorTone}`
                )}
                value={sceneDescription}
                onChange={(e) => setSceneDescription(e.target.value)}
                className="h-40 border-2"
              />
            </div>
          </div>

          {/* Right side - color tone selection and generate button */}
          <div className="flex w-full flex-col justify-end space-y-12 md:w-64">
            <div className="relative flex flex-col space-y-2">
              <label htmlFor="colorTone" className="text-sm font-medium">
                {t("keycap.label.colorTone")}
              </label>
              <Select
                value={colorTone}
                onValueChange={(value) => setColorTone(value as ColorTone)}
              >
                <SelectTrigger id="colorTone" className="border-2">
                  <SelectValue placeholder={t("keycap.label.colorTone")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warm">
                    {t("keycap.colorTone.warm")}
                  </SelectItem>
                  <SelectItem value="cold">
                    {t("keycap.colorTone.cold")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative flex flex-col space-y-2">
              <label htmlFor="model-select" className="text-sm font-medium">
                {t("common.model")}
              </label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger id="model-select" className="border-2">
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

            <div className="flex items-center justify-center gap-2">
              <Button
                onClick={handleGenerate}
                className="w-full bg-purple-500 text-white hover:bg-purple-600"
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
    </div>
  );
}
