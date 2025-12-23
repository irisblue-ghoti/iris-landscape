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
import { letterBoxPrompt } from "./prompt";
import { useTranslations } from "next-intl";
import { HexColorPicker } from "react-colorful";
import { models } from "@/constants/models";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
export default function LetterBoxForm() {
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const { isGenerating, generateImg } = useGenerateImage();
  const t = useTranslations();
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [activeColorField, setActiveColorField] = useState<
    "character" | "background" | null
  >(null);
  const [characterColor, setCharacterColor] = useState("#FF5733");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [characters, setCharacters] = useState("");
  const [material, setMaterial] = useState("");
  const [model, setModel] = useState("gpt-image-1");
  const characterColorRef = useRef<HTMLDivElement>(null);
  const backgroundColorRef = useRef<HTMLDivElement>(null);
  const characterPickerRef = useRef<HTMLDivElement>(null);
  const backgroundPickerRef = useRef<HTMLDivElement>(null);

  const toggleColorPalette = (field: "character" | "background") => {
    setActiveColorField(field);
    setShowColorPalette(!showColorPalette || activeColorField !== field);
  };

  const handleColorChange = (color: string) => {
    if (activeColorField === "character") {
      setCharacterColor(color);
    } else if (activeColorField === "background") {
      setBackgroundColor(color);
    }
  };

  // Handle click outside to close color picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // For character color picker
      if (
        activeColorField === "character" &&
        characterPickerRef.current &&
        characterColorRef.current
      ) {
        if (
          !characterPickerRef.current.contains(event.target as Node) &&
          !characterColorRef.current.contains(event.target as Node)
        ) {
          setShowColorPalette(false);
        }
      }

      // For background color picker
      if (
        activeColorField === "background" &&
        backgroundPickerRef.current &&
        backgroundColorRef.current
      ) {
        if (
          !backgroundPickerRef.current.contains(event.target as Node) &&
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
    // if (!characters) {
    //   toast.error(t("letter-box-form.warning.character"));
    //   return;
    // }
    // if (!material) {
    //   toast.error(t("letter-box-form.warning.material"));
    //   return;
    // }
    // if (!characterColor) {
    //   toast.error(t("letter-box-form.warning.characterColor"));
    //   return;
    // }
    // if (!backgroundColor) {
    //   toast.error(t("letter-box-form.warning.backgroundColor"));
    //   return;
    // }
    const defaultValues = {
      characters: t("letter-box-form.defaultValue.character"),
      material: t("letter-box-form.defaultValue.material"),
      characterColor: t("letter-box-form.defaultValue.characterColor"),
      backgroundColor: t("letter-box-form.defaultValue.backgroundColor"),
    };
    await generateImg({
      rawPrompt: `${characters || defaultValues.characters},${material || defaultValues.material},${characterColor || defaultValues.characterColor},${backgroundColor || defaultValues.backgroundColor}`,
      prompt: letterBoxPrompt(
        characters || defaultValues.characters,
        material || defaultValues.material,
        characterColor || defaultValues.characterColor,
        backgroundColor || defaultValues.backgroundColor
      ),
      type: "letter_box",
      model: model,
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Character Input */}
          <div className="space-y-2">
            <Label htmlFor="characters" className="text-sm font-medium">
              {t("letter-box-form.label.character")}
            </Label>
            <Input
              id="characters"
              placeholder={t("letter-box-form.placeholder.character")}
              className="w-full"
              value={characters}
              onChange={(e) => setCharacters(e.target.value)}
            />
          </div>

          {/* Material Input */}
          <div className="space-y-2">
            <Label htmlFor="material" className="text-sm font-medium">
              {t("letter-box-form.label.material")}
            </Label>
            <Input
              id="material"
              placeholder={t("letter-box-form.placeholder.material")}
              className="w-full"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Character Color */}
          <div className="relative space-y-2">
            <Label htmlFor="characterColor" className="text-sm font-medium">
              {t("letter-box-form.label.characterColor")}
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="characterColor"
                value={characterColor}
                onChange={(e) => setCharacterColor(e.target.value)}
                className="flex-1"
                placeholder={t("letter-box-form.placeholder.characterColor")}
              />
              <div
                ref={characterColorRef}
                className="h-10 w-10 cursor-pointer rounded-full border border-gray-300"
                style={{ backgroundColor: characterColor }}
                onClick={() => toggleColorPalette("character")}
              ></div>
            </div>

            {/* Character Color Picker */}
            {showColorPalette && activeColorField === "character" && (
              <div
                ref={characterPickerRef}
                className="absolute right-0 z-10 mt-2"
              >
                <div className="rounded-md border border-gray-200 bg-white p-3 shadow-lg">
                  <div className="mb-2 text-sm font-medium">
                    {t("letter-box-form.label.characterColor")}
                  </div>
                  <HexColorPicker
                    color={characterColor}
                    onChange={handleColorChange}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Background Box Color */}
          <div className="relative space-y-2">
            <Label htmlFor="backgroundColor" className="text-sm font-medium">
              {t("letter-box-form.label.backgroundColor")}
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="backgroundColor"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="flex-1"
                placeholder={t("letter-box-form.placeholder.backgroundColor")}
              />
              <div
                ref={backgroundColorRef}
                className="h-10 w-10 cursor-pointer rounded-full border border-gray-300"
                style={{ backgroundColor: backgroundColor }}
                onClick={() => toggleColorPalette("background")}
              ></div>
            </div>

            {/* Background Color Picker */}
            {showColorPalette && activeColorField === "background" && (
              <div
                ref={backgroundPickerRef}
                className="absolute right-0 z-10 mt-2"
              >
                <div className="rounded-md border border-gray-200 bg-white p-3 shadow-lg">
                  <div className="mb-2 text-sm font-medium">
                    {t("letter-box-form.label.backgroundColor")}
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
