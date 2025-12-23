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
import { toast } from "sonner";
import { isometricScenePrompt } from "./prompt";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { models } from "@/constants/models";

export default function IsometricSceneForm() {
  const [scene, setScene] = useState("");
  const [model, setModel] = useState("gpt-image-1");
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const { isGenerating, generateImg } = useGenerateImage();
  const t = useTranslations();
  const handleGenerate = async () => {
    // if (!scene) {
    //   toast.error(t("isometric-scene.warning.scene"));
    //   return;
    // }
    const defaultValues = {
      scene: t("isometric-scene.defaultValue"),
    };

    await generateImg({
      rawPrompt: scene || defaultValues.scene,
      prompt: isometricScenePrompt(scene || defaultValues.scene),
      isOptimize: true,
      type: "isometric_scene",
      model: model,
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Input
            id="scene"
            value={scene}
            onChange={(e) => setScene(e.target.value)}
            placeholder={t("isometric-scene.placeholder.scene")}
          />
        </div>

        <div className="flex items-center gap-4">
          <Label htmlFor="model-select" className="whitespace-nowrap text-sm">
            {t("common.model")}
          </Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger id="model-select" className="flex-1">
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
