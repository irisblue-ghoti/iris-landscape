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
import { flowerSculpturePrompt } from "./prompt";
import { models } from "@/constants/models";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function NeonGraffitiForm() {
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const { isGenerating, generateImg } = useGenerateImage();
  const t = useTranslations();
  const [model, setModel] = useState("gpt-image-1");
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [activeColorField, setActiveColorField] = useState<
    "backgroundColor" | null
  >(null);
  const [subject, setSubject] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [flowerVarietiesUsed, setFlowerVarietiesUsed] = useState("");
  const backgroundColorRef = useRef<HTMLDivElement>(null);
  const backgroundColorPickerRef = useRef<HTMLDivElement>(null);

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
      subject: t("flower_sculpture.defaultValue.subject"),
      backgroundColor: t("flower_sculpture.defaultValue.backgroundColor"),
      flowerVarietiesUsed: t(
        "flower_sculpture.defaultValue.flowerVarietiesUsed"
      ),
    };

    await generateImg({
      rawPrompt: `${subject || defaultValues.subject},${backgroundColor || defaultValues.backgroundColor},${flowerVarietiesUsed || defaultValues.flowerVarietiesUsed}`,
      prompt: flowerSculpturePrompt(
        subject || defaultValues.subject,
        backgroundColor || defaultValues.backgroundColor,
        flowerVarietiesUsed || defaultValues.flowerVarietiesUsed
      ),
      type: "flower_sculpture",
      model,
    });
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Character Color */}
          <div className="relative">
            <div className="mb-4 flex items-center gap-4">
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
            <div className="mt-4 flex items-center gap-4">
              <Label htmlFor="subject" className="w-20 flex-shrink-0">
                {t("flower_sculpture.label.subject")}
              </Label>
              <div className="flex w-full items-center space-x-3">
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full"
                  placeholder={t("flower_sculpture.placeholder.subject")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Colors (Color1 and Color2 in same row) */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Color1 */}
          <div className="relative">
            <div className="flex items-center gap-4">
              <Label htmlFor="backgroundColor" className="w-20 flex-shrink-0">
                {t("flower_sculpture.label.backgroundColor")}
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
              </div>
            </div>
          </div>

          {/* Background Box Color */}
          <div className="relative">
            <div className="flex items-center gap-4">
              <Label
                htmlFor="flowerVarietiesUsed"
                className="w-20 flex-shrink-0"
              >
                {t("flower_sculpture.label.flowerVarietiesUsed")}
              </Label>
              <div className="flex w-full items-center space-x-3">
                <Input
                  id="flowerVarietiesUsed"
                  value={flowerVarietiesUsed}
                  onChange={(e) => setFlowerVarietiesUsed(e.target.value)}
                  className="w-full"
                  placeholder={t(
                    "flower_sculpture.placeholder.flowerVarietiesUsed"
                  )}
                />
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
        <div className="grid grid-cols-1 gap-6"></div>

        {/* Generate Button */}
        <div className="flex justify-end gap-6">
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
