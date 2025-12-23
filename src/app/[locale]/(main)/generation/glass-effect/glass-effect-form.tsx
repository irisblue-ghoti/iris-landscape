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
import { glassEffectPrompt } from "./prompt";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { HexColorPicker } from "react-colorful";
import { models } from "@/constants/models";
export default function CityIsometricViewForm() {
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const [subject, setSubject] = useState("");
  const [color, setColor] = useState("#FFFFFF");
  const [clearParts, setClearParts] = useState("");
  const { isGenerating, generateImg } = useGenerateImage();
  const t = useTranslations();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [model, setModel] = useState("gpt-image-1");
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const colorBoxRef = useRef<HTMLDivElement>(null);

  // 处理点击外部关闭颜色选择器
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickerRef.current &&
        colorBoxRef.current &&
        !colorPickerRef.current.contains(event.target as Node) &&
        !colorBoxRef.current.contains(event.target as Node)
      ) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };

  const handleGenerate = async () => {
    const defaultValues = {
      subject: t("glass_effect.defaultValue.subject"),
      color: t("glass_effect.defaultValue.color"),
      clearParts: t("glass_effect.defaultValue.clearParts"),
    };
    await generateImg({
      rawPrompt: `${subject || defaultValues.subject},${color || defaultValues.color},${clearParts || defaultValues.clearParts}`,
      prompt: glassEffectPrompt(
        subject || defaultValues.subject,
        color || defaultValues.color,
        clearParts || defaultValues.clearParts
      ),
      type: "glass_effect",
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
          <Label htmlFor="country" className="w-16 flex-shrink-0">
            {t("glass_effect.label.subject")}
          </Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={t("glass_effect.placeholder.subject")}
          />
        </div>

        <div className="flex items-center">
          <Label htmlFor="clearParts" className="w-16 flex-shrink-0">
            {t("glass_effect.label.clearParts")}
          </Label>
          <Input
            id="clearParts"
            value={clearParts}
            onChange={(e) => setClearParts(e.target.value)}
            placeholder={t("glass_effect.placeholder.clearParts")}
          />
        </div>

        <div className="relative flex items-center">
          <Label htmlFor="color" className="w-16 flex-shrink-0">
            {t("glass_effect.label.color")}
          </Label>
          <div className="flex flex-1 items-center space-x-2">
            <Input
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder={t("glass_effect.placeholder.color")}
            />
            <div
              ref={colorBoxRef}
              className="h-10 w-10 cursor-pointer rounded-full border border-gray-300"
              style={{ backgroundColor: color }}
              onClick={toggleColorPicker}
            ></div>
          </div>

          {showColorPicker && (
            <div
              ref={colorPickerRef}
              className="absolute right-0 top-full z-10 mt-2"
            >
              <div className="rounded-md border border-gray-200 bg-white p-3 shadow-lg">
                <div className="mb-2 text-sm font-medium">
                  {t("glass_effect.label.color")}
                </div>
                <HexColorPicker
                  color={color}
                  onChange={(color) => setColor(color)}
                />
              </div>
            </div>
          )}
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
