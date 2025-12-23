"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
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
import { HexColorPicker } from "react-colorful";
import { emotionCakePrompt } from "./prompt";
import { models } from "@/constants/models";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function EmotionCakeForm() {
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const { isGenerating, generateImg } = useGenerateImage();
  const t = useTranslations();
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [activeColorField, setActiveColorField] = useState<
    "backgroundColor" | null
  >(null);
  const [pastryType, setPastryType] = useState("");
  const [emotion, setEmotion] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const backgroundColorRef = useRef<HTMLDivElement>(null);
  const backgroundColorPickerRef = useRef<HTMLDivElement>(null);
  const [model, setModel] = useState("gpt-image-1");
  const toggleColorPalette = (field: "backgroundColor") => {
    setActiveColorField(field);
    setShowColorPalette(!showColorPalette || activeColorField !== field);
  };

  const handleColorChange = (color: string) => {
    setBackgroundColor(color);
  };

  // Handle click outside to close color picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // For character color picker
      if (
        activeColorField === "backgroundColor" &&
        backgroundColorPickerRef.current &&
        backgroundColorRef.current
      ) {
        if (
          !backgroundColorPickerRef.current.contains(event.target as Node) &&
          !backgroundColorRef.current.contains(event.target as Node)
        ) {
          setShowColorPalette(false);
        }
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeColorField]);

  const handleGenerate = async () => {
    const defaultValues = {
      pastryType: t("emotion_cake.defaultValue.pastryType"),
      emotion: t("emotion_cake.defaultValue.emotion"),
      backgroundColor: t("emotion_cake.defaultValue.backgroundColor"),
    };

    await generateImg({
      rawPrompt: `${pastryType || defaultValues.pastryType},${emotion || defaultValues.emotion},${backgroundColor || defaultValues.backgroundColor}`,
      prompt: emotionCakePrompt(
        pastryType || defaultValues.pastryType,
        emotion || defaultValues.emotion,
        backgroundColor || defaultValues.backgroundColor
      ),
      type: "emotion_cake",
      model,
    });
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="space-y-6">
        {/* Model Selection */}
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

        {/* Pastry Type */}
        <div className="mt-4 flex items-center gap-4">
          <Label htmlFor="pastryType" className="w-20 flex-shrink-0">
            {t("emotion_cake.label.pastryType")}
          </Label>
          <div className="flex w-full items-center space-x-3">
            <Input
              id="pastryType"
              value={pastryType}
              onChange={(e) => setPastryType(e.target.value)}
              className="w-full"
              placeholder={t("emotion_cake.placeholder.pastryType")}
            />
          </div>
        </div>

        {/* Emotion and Background Color */}
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Emotion */}
          <div className="relative">
            <div className="flex items-center gap-4">
              <Label htmlFor="emotion" className="w-20 flex-shrink-0">
                {t("emotion_cake.label.emotion")}
              </Label>
              <div className="flex w-full items-center space-x-3">
                <Input
                  id="emotion"
                  value={emotion}
                  onChange={(e) => setEmotion(e.target.value)}
                  className="w-full"
                  placeholder={t("emotion_cake.placeholder.emotion")}
                />
              </div>
            </div>
          </div>

          {/* Background Color */}
          <div className="relative">
            <div className="flex items-center gap-4">
              <Label htmlFor="backgroundColor" className="w-20 flex-shrink-0">
                {t("emotion_cake.label.backgroundColor")}
              </Label>
              <div className="flex w-full items-center space-x-3">
                <Input
                  id="backgroundColor"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-full"
                  placeholder={t(
                    "flower_sculpture.placeholder.backgroundColor"
                  )}
                />
                <div
                  ref={backgroundColorRef}
                  className="h-10 w-10 flex-shrink-0 cursor-pointer rounded-full border border-gray-300"
                  style={{ backgroundColor }}
                  onClick={() => toggleColorPalette("backgroundColor")}
                ></div>
              </div>
            </div>

            {/* Background Color Picker */}
            {showColorPalette && activeColorField === "backgroundColor" && (
              <div
                ref={backgroundColorPickerRef}
                className="absolute right-0 z-10 mt-2"
              >
                <div className="rounded-md border border-gray-200 bg-white p-3 shadow-lg">
                  <div className="mb-2 text-sm font-medium">
                    {t("flower_sculpture.label.backgroundColor")}
                  </div>
                  <HexColorPicker
                    color={backgroundColor}
                    onChange={handleColorChange}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-6 flex justify-end gap-6">
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
            className="bg-purple-500 px-6 text-white hover:bg-purple-600"
            onClick={handleGenerate}
          >
            {t("global.generate_image")}
          </Button>
        </div>
      </div>
    </div>
  );
}
