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
import { neonGraffitiPrompt } from "./prompt";
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
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [activeColorField, setActiveColorField] = useState<
    "color1" | "color2" | null
  >(null);
  const [subject, setSubject] = useState("");
  const [color1, setColor1] = useState("#FF5733");
  const [color2, setColor2] = useState("#FFFFFF");

  const bagColorRef = useRef<HTMLDivElement>(null);
  const bagColorPickerRef = useRef<HTMLDivElement>(null);
  const logoColorRef = useRef<HTMLDivElement>(null);
  const logoColorPickerRef = useRef<HTMLDivElement>(null);
  const [model, setModel] = useState("gpt-image-1");

  const toggleColorPalette = (field: "color1" | "color2") => {
    setActiveColorField(field);
    setShowColorPalette(!showColorPalette || activeColorField !== field);
  };

  const handleColorChange = (color: string) => {
    if (activeColorField === "color1") {
      setColor1(color);
    } else if (activeColorField === "color2") {
      setColor2(color);
    }
  };

  // Handle click outside to close color picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // For character color picker
      if (
        activeColorField === "color1" &&
        bagColorPickerRef.current &&
        bagColorRef.current
      ) {
        if (
          !bagColorPickerRef.current.contains(event.target as Node) &&
          !bagColorRef.current.contains(event.target as Node)
        ) {
          setShowColorPalette(false);
        }
      }

      // For background color picker
      if (
        activeColorField === "color2" &&
        logoColorPickerRef.current &&
        logoColorRef.current
      ) {
        if (
          !logoColorPickerRef.current.contains(event.target as Node) &&
          !logoColorRef.current.contains(event.target as Node)
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
      subject: t("neon_graffiti.defaultValue.subject"),
      color1: t("neon_graffiti.defaultValue.color1"),
      color2: t("neon_graffiti.defaultValue.color2"),
    };

    await generateImg({
      rawPrompt: `${subject || defaultValues.subject},${color1 || defaultValues.color1},${color2 || defaultValues.color2}`,
      prompt: neonGraffitiPrompt(
        subject || defaultValues.subject,
        color1 || defaultValues.color1,
        color2 || defaultValues.color2
      ),
      type: "neon_graffiti",
      model,
    });
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex items-center">
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
          {/* Character Color */}
          <div className="relative">
            <div className="flex items-center gap-3">
              <Label
                htmlFor="subject"
                className="w-20 flex-shrink-0 text-sm font-medium"
              >
                {t("neon_graffiti.label.subject")}
              </Label>
              <div className="flex w-full items-center space-x-2">
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full"
                  placeholder={t("neon_graffiti.placeholder.subject")}
                />
              </div>
            </div>
          </div>
          {showColorPalette && activeColorField === "color1" && (
            <div ref={bagColorPickerRef} className="absolute right-0 z-10 mt-2">
              <div className="rounded-md border border-gray-200 bg-white p-3 shadow-lg">
                <div className="mb-2 text-sm font-medium">
                  {t("neon_graffiti.label.color1")}
                </div>
                <HexColorPicker color={color1} onChange={handleColorChange} />
              </div>
            </div>
          )}
        </div>

        {/* Colors (Color1 and Color2 in same row) */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Color1 */}
          <div className="relative">
            <div className="flex items-center gap-3">
              <Label
                htmlFor="color1"
                className="w-20 flex-shrink-0 text-sm font-medium"
              >
                {t("neon_graffiti.label.color1")}
              </Label>
              <div className="flex w-full items-center space-x-2">
                <Input
                  id="color1"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="w-full"
                  placeholder={t("neon_graffiti.placeholder.color1")}
                />
                <div
                  ref={bagColorRef}
                  className="h-10 w-10 flex-shrink-0 cursor-pointer rounded-full border border-gray-300"
                  style={{ backgroundColor: color1 }}
                  onClick={() => toggleColorPalette("color1")}
                ></div>
              </div>
            </div>
          </div>

          {/* Background Box Color */}
          <div className="relative">
            <div className="flex items-center gap-3">
              <Label
                htmlFor="color2"
                className="w-20 flex-shrink-0 text-sm font-medium"
              >
                {t("neon_graffiti.label.color2")}
              </Label>
              <div className="flex w-full items-center space-x-2">
                <Input
                  id="color2"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="w-full"
                  placeholder={t("neon_graffiti.placeholder.color2")}
                />
                <div
                  ref={logoColorRef}
                  className="h-10 w-10 flex-shrink-0 cursor-pointer rounded-full border border-gray-300"
                  style={{ backgroundColor: color2 }}
                  onClick={() => toggleColorPalette("color2")}
                ></div>
              </div>
            </div>

            {/* Background Color Picker */}
            {showColorPalette && activeColorField === "color2" && (
              <div
                ref={logoColorPickerRef}
                className="absolute right-0 z-10 mt-2"
              >
                <div className="rounded-md border border-gray-200 bg-white p-3 shadow-lg">
                  <div className="mb-2 text-sm font-medium">
                    {t("neon_graffiti.label.color2")}
                  </div>
                  <HexColorPicker color={color2} onChange={handleColorChange} />
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
