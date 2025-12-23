"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { exampleStoreAtom } from "@/stores/slices/example_store";
import { examples } from "./examples";
import { useImageGeneration } from "@/hooks/use-image-generation";
import { toast } from "sonner";
import ImageDrop from "@/components/basic/change-style/text/image-drop";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { tShirtPinPrompt } from "./prompt";
import { HexColorPicker } from "react-colorful";
import { Input } from "@/components/ui/input";
import { models } from "@/constants/models";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TShirtPinForm() {
  const t = useTranslations();
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageForm, setImageForm] = useState("");
  const { isGenerating, generateWithImage } = useImageGeneration();
  const [clothingColor, setClothingColor] = useState("#FFFFFF");
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
    if (!imageForm) {
      toast.error(t("ghibli-style.warning.image"));
      return;
    }

    await generateWithImage({
      rawPrompt: "",
      prompt: tShirtPinPrompt(clothingColor),
      imageData: imageForm,
      shouldUseImageInput: true,
      type: "t_shirt_pin",
      model,
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex w-full flex-col space-y-4 md:w-1/2">
          <Card className="flex h-64 flex-col items-center justify-center">
            <ImageDrop
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
              imageForm={imageForm}
              setImageForm={setImageForm}
            />
          </Card>
        </div>

        <div className="mt-4 flex w-full flex-1 flex-col justify-between space-y-12 md:ml-4 md:mt-0 md:w-1/2">
          <div className="space-y-6">
            <span className="text-sm">
              {t("t_shirt_pin.label.description")}
            </span>
            <div className="mt-4 flex items-center gap-4">
              <Label htmlFor="model-select" className="w-20 flex-shrink-0">
                {t("common.model")}
              </Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger id="model-select" className="w-full">
                  <SelectValue placeholder={t("common.model")} />
                </SelectTrigger>
                <SelectContent>
                  {[...models].map((modelOption) => (
                    <SelectItem key={modelOption} value={modelOption}>
                      {modelOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <Label htmlFor="clothingColor" className="w-20 flex-shrink-0">
                {t("t_shirt_pin.label.clothingColor")}
              </Label>
              <div className="flex flex-1 items-center space-x-3">
                <Input
                  id="clothingColor"
                  type="text"
                  value={clothingColor}
                  onChange={(e) => setClothingColor(e.target.value)}
                  className="flex-1"
                  placeholder={t("t_shirt_pin.placeholder.clothingColor")}
                />
                <div
                  ref={colorBoxRef}
                  className="h-10 w-10 cursor-pointer rounded-full border border-solid border-gray-300"
                  style={{ backgroundColor: clothingColor }}
                  onClick={toggleColorPicker}
                ></div>
              </div>
              {showColorPicker && (
                <div
                  ref={colorPickerRef}
                  className="absolute right-0 z-10 mt-2"
                >
                  <div className="rounded-md border border-solid border-gray-200 bg-white p-3 shadow-lg">
                    <div className="mb-2 text-sm font-medium">
                      {t("t_shirt_pin.label.clothingColor")}
                    </div>
                    <HexColorPicker
                      color={clothingColor}
                      onChange={(color) => setClothingColor(color)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
            <Button
              onClick={handleGenerate}
              className="w-full rounded-md bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
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
