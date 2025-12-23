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
import { creativeDrawstringBagPrompt } from "./prompt";
import { models } from "@/constants/models";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function CreativeDrawstringBagForm() {
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const { isGenerating, generateImg } = useGenerateImage();
  const t = useTranslations();
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [activeColorField, setActiveColorField] = useState<
    "backgroundColor" | "ribbonColor" | "labelColor" | null
  >(null);
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [itemsInBag, setItemsInBag] = useState("");
  const [ribbonColor, setRibbonColor] = useState("#FF5733");
  const [labelColor, setLabelColor] = useState("#000000");
  const [labelText, setLabelText] = useState("");
  const [model, setModel] = useState("gpt-image-1");
  const backgroundColorRef = useRef<HTMLDivElement>(null);
  const backgroundColorPickerRef = useRef<HTMLDivElement>(null);
  const ribbonColorRef = useRef<HTMLDivElement>(null);
  const ribbonColorPickerRef = useRef<HTMLDivElement>(null);
  const labelColorRef = useRef<HTMLDivElement>(null);
  const labelColorPickerRef = useRef<HTMLDivElement>(null);

  const toggleColorPalette = (
    field: "backgroundColor" | "ribbonColor" | "labelColor"
  ) => {
    setActiveColorField(field);
    setShowColorPalette(!showColorPalette || activeColorField !== field);
  };

  const handleColorChange = (color: string) => {
    if (activeColorField === "backgroundColor") {
      setBackgroundColor(color);
    } else if (activeColorField === "ribbonColor") {
      setRibbonColor(color);
    } else if (activeColorField === "labelColor") {
      setLabelColor(color);
    }
  };

  // Handle click outside to close color picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // For background color picker
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

      // For ribbon color picker
      if (
        activeColorField === "ribbonColor" &&
        ribbonColorPickerRef.current &&
        ribbonColorRef.current
      ) {
        if (
          !ribbonColorPickerRef.current.contains(event.target as Node) &&
          !ribbonColorRef.current.contains(event.target as Node)
        ) {
          setShowColorPalette(false);
        }
      }

      // For label color picker
      if (
        activeColorField === "labelColor" &&
        labelColorPickerRef.current &&
        labelColorRef.current
      ) {
        if (
          !labelColorPickerRef.current.contains(event.target as Node) &&
          !labelColorRef.current.contains(event.target as Node)
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
      backgroundColor:
        t("creative_drawstring_bag.defaultValue.backgroundColor") || "white",
      itemsInBag:
        t("creative_drawstring_bag.defaultValue.itemsInBag") || "toys",
      ribbonColor:
        t("creative_drawstring_bag.defaultValue.ribbonColor") || "red",
      labelColor:
        t("creative_drawstring_bag.defaultValue.labelColor") || "white",
      labelText:
        t("creative_drawstring_bag.defaultValue.labelText") || "Sample Text",
    };

    await generateImg({
      rawPrompt: `${backgroundColor || defaultValues.backgroundColor},${itemsInBag || defaultValues.itemsInBag},${ribbonColor || defaultValues.ribbonColor},${labelColor || defaultValues.labelColor},${labelText || defaultValues.labelText}`,
      prompt: creativeDrawstringBagPrompt(
        backgroundColor || defaultValues.backgroundColor,
        itemsInBag || defaultValues.itemsInBag,
        ribbonColor || defaultValues.ribbonColor,
        labelColor || defaultValues.labelColor,
        labelText || defaultValues.labelText
      ),
      type: "creative_drawstring_bag",
      model,
    });
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="space-y-6">
        {/* Background Color */}
        <div className="flex items-center gap-2">
          <Label htmlFor="model-select" className="w-24 flex-shrink-0">
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Items in Bag */}
          <div className="relative">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="itemsInBag"
                className="w-24 flex-shrink-0 whitespace-nowrap text-sm font-medium"
              >
                {t("creative_drawstring_bag.label.itemsInBag")}
              </Label>
              <div className="flex w-full items-center space-x-2">
                <Input
                  id="itemsInBag"
                  value={itemsInBag}
                  onChange={(e) => setItemsInBag(e.target.value)}
                  className="w-full"
                  placeholder={t(
                    "creative_drawstring_bag.placeholder.itemsInBag"
                  )}
                />
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="backgroundColor"
                className="w-24 flex-shrink-0 whitespace-nowrap text-sm font-medium"
              >
                {t("creative_drawstring_bag.label.backgroundColor")}
              </Label>
              <div className="flex w-full items-center space-x-2">
                <Input
                  id="backgroundColor"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-full"
                  placeholder={t(
                    "creative_drawstring_bag.placeholder.backgroundColor"
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
          </div>
        </div>

        {/* Ribbon Color and Label Color */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Ribbon Color */}
          <div className="relative">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="ribbonColor"
                className="w-24 flex-shrink-0 whitespace-nowrap text-sm font-medium"
              >
                {t("creative_drawstring_bag.label.ribbonColor")}
              </Label>
              <div className="flex w-full items-center space-x-2">
                <Input
                  id="ribbonColor"
                  value={ribbonColor}
                  onChange={(e) => setRibbonColor(e.target.value)}
                  className="w-full"
                  placeholder={t(
                    "creative_drawstring_bag.placeholder.ribbonColor"
                  )}
                />
                <div
                  ref={ribbonColorRef}
                  className="h-10 w-10 flex-shrink-0 cursor-pointer rounded-full border border-gray-300"
                  style={{ backgroundColor: ribbonColor }}
                  onClick={() => toggleColorPalette("ribbonColor")}
                ></div>
              </div>
            </div>
          </div>

          {/* Label Color */}
          <div className="relative">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="labelColor"
                className="w-24 flex-shrink-0 whitespace-nowrap text-sm font-medium"
              >
                {t("creative_drawstring_bag.label.labelColor")}
              </Label>
              <div className="flex w-full items-center space-x-2">
                <Input
                  id="labelColor"
                  value={labelColor}
                  onChange={(e) => setLabelColor(e.target.value)}
                  className="w-full"
                  placeholder={t(
                    "creative_drawstring_bag.placeholder.labelColor"
                  )}
                />
                <div
                  ref={labelColorRef}
                  className="h-10 w-10 flex-shrink-0 cursor-pointer rounded-full border border-gray-300"
                  style={{ backgroundColor: labelColor }}
                  onClick={() => toggleColorPalette("labelColor")}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Label Text */}
        <div className="grid grid-cols-1 gap-6">
          <div className="relative">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="labelText"
                className="w-24 flex-shrink-0 whitespace-nowrap text-sm font-medium"
              >
                {t("creative_drawstring_bag.label.labelText")}
              </Label>
              <div className="flex w-full items-center space-x-2">
                <Input
                  id="labelText"
                  value={labelText}
                  onChange={(e) => setLabelText(e.target.value)}
                  className="w-full"
                  placeholder={t(
                    "creative_drawstring_bag.placeholder.labelText"
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Color Picker Popups */}
        {showColorPalette && activeColorField === "backgroundColor" && (
          <div
            ref={backgroundColorPickerRef}
            className="absolute right-0 z-10 mt-2"
          >
            <div className="rounded-md border border-gray-200 bg-white p-3 shadow-lg">
              <div className="mb-2 text-sm font-medium">
                {t("creative_drawstring_bag.label.backgroundColor")}
              </div>
              <HexColorPicker
                color={backgroundColor}
                onChange={handleColorChange}
              />
            </div>
          </div>
        )}

        {showColorPalette && activeColorField === "ribbonColor" && (
          <div
            ref={ribbonColorPickerRef}
            className="absolute right-0 z-10 mt-2"
          >
            <div className="rounded-md border border-gray-200 bg-white p-3 shadow-lg">
              <div className="mb-2 text-sm font-medium">
                {t("creative_drawstring_bag.label.ribbonColor")}
              </div>
              <HexColorPicker
                color={ribbonColor}
                onChange={handleColorChange}
              />
            </div>
          </div>
        )}

        {showColorPalette && activeColorField === "labelColor" && (
          <div ref={labelColorPickerRef} className="absolute right-0 z-10 mt-2">
            <div className="rounded-md border border-gray-200 bg-white p-3 shadow-lg">
              <div className="mb-2 text-sm font-medium">
                {t("creative_drawstring_bag.label.labelColor")}
              </div>
              <HexColorPicker color={labelColor} onChange={handleColorChange} />
            </div>
          </div>
        )}

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
