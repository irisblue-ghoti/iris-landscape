"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAtom } from "jotai";
import { exampleStoreAtom } from "@/stores/slices/example_store";
import { examples } from "./examples";
import { useGenerateImage } from "@/hooks/use-generate-image";
import { useTranslations } from "next-intl";
import { animalLandmarkSelfiePrompt } from "./prompt";
import { models } from "@/constants/models";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function AnimalLandmarkSelfieForm() {
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const { isGenerating, generateImg } = useGenerateImage();
  const [animal, setAnimal] = useState("");
  const [landmark, setLandmark] = useState("");
  const [expression1, setExpression1] = useState("");
  const [expression2, setExpression2] = useState("");
  const [expression3, setExpression3] = useState("");
  const t = useTranslations();
  const [model, setModel] = useState("gpt-image-1");
  const handleGenerate = async () => {
    // 表单验证可以在此添加
    const defaultValues = {
      animal: t("animal_landmark_selfie.defaultValue.animal"),
      landmark: t("animal_landmark_selfie.defaultValue.landmark"),
      expression1: t("animal_landmark_selfie.defaultValue.expression1"),
      expression2: t("animal_landmark_selfie.defaultValue.expression2"),
      expression3: t("animal_landmark_selfie.defaultValue.expression3"),
    };
    await generateImg({
      rawPrompt: `
        ${animal || defaultValues.animal},
        ${landmark || defaultValues.landmark},
        ${expression1 || defaultValues.expression1},
        ${expression2 || defaultValues.expression2},
        ${expression3 || defaultValues.expression3}
        `,
      prompt: animalLandmarkSelfiePrompt(
        animal || defaultValues.animal,
        landmark || defaultValues.landmark,
        expression1 || defaultValues.expression1,
        expression2 || defaultValues.expression2,
        expression3 || defaultValues.expression3
      ),
      type: "animal_landmark_selfie",
      model,
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="w-full max-w-2xl space-y-6">
        {/* Main form */}

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Label htmlFor="model-select" className="w-14 flex-shrink-0">
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
          {/* First row - Animal Species and City Landmark */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex items-center gap-4">
              <Label htmlFor="animal" className="text-sm font-medium">
                {t("animal_landmark_selfie.label.animal")}
              </Label>
              <Input
                id="animal"
                placeholder={t("animal_landmark_selfie.placeholder.animal")}
                className="flex-1"
                value={animal}
                onChange={(e) => setAnimal(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <Label htmlFor="landmark" className="text-sm font-medium">
                {t("animal_landmark_selfie.label.landmark")}
              </Label>
              <Input
                id="landmark"
                placeholder={t("animal_landmark_selfie.placeholder.landmark")}
                className="flex-1"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
              />
            </div>
          </div>

          {/* Second row - Three expressions */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <Label htmlFor="expression1" className="text-sm font-medium">
                {t("animal_landmark_selfie.label.expression1")}
              </Label>
              <Input
                id="expression1"
                placeholder={t(
                  "animal_landmark_selfie.placeholder.expression1"
                )}
                className="flex-1"
                value={expression1}
                onChange={(e) => setExpression1(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="expression2" className="text-sm font-medium">
                {t("animal_landmark_selfie.label.expression2")}
              </Label>
              <Input
                id="expression2"
                placeholder={t(
                  "animal_landmark_selfie.placeholder.expression2"
                )}
                className="flex-1"
                value={expression2}
                onChange={(e) => setExpression2(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="expression3" className="text-sm font-medium">
                {t("animal_landmark_selfie.label.expression3")}
              </Label>
              <Input
                id="expression3"
                placeholder={t(
                  "animal_landmark_selfie.placeholder.expression3"
                )}
                className="flex-1"
                value={expression3}
                onChange={(e) => setExpression3(e.target.value)}
              />
            </div>
          </div>

          {/* Generate button */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              className="rounded-lg bg-purple-600 px-8 py-3 font-medium text-white transition-colors hover:bg-purple-700"
              size="lg"
              onClick={handleGenerate}
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
