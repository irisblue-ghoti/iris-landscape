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
import { plasticTrashBagPrompt } from "./prompt";
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

export default function PlasticTrashBagForm() {
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const { isGenerating, generateImg } = useGenerateImage();
  const t = useTranslations();
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [activeColorField, setActiveColorField] = useState<
    "bagColor" | "logoColor" | null
  >(null);
  const [bagColor, setBagColor] = useState("#FF5733");
  const [logoColor, setLogoColor] = useState("#FFFFFF");
  const [centerLogo, setCenterLogo] = useState("");

  const bagColorRef = useRef<HTMLDivElement>(null);
  const bagColorPickerRef = useRef<HTMLDivElement>(null);
  const logoColorRef = useRef<HTMLDivElement>(null);
  const logoColorPickerRef = useRef<HTMLDivElement>(null);
  const [model, setModel] = useState("gpt-image-1");
  const toggleColorPalette = (field: "bagColor" | "logoColor") => {
    setActiveColorField(field);
    setShowColorPalette(!showColorPalette || activeColorField !== field);
  };

  const handleColorChange = (color: string) => {
    if (activeColorField === "bagColor") {
      setBagColor(color);
    } else if (activeColorField === "logoColor") {
      setLogoColor(color);
    }
  };

  // Handle click outside to close color picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // For character color picker
      if (
        activeColorField === "bagColor" &&
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
        activeColorField === "logoColor" &&
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
    // if (!bagColor) {
    //   toast.error(t("plastic-trash-bag.warning.bagColor"));
    //   return;
    // }
    // if (!logoColor) {
    //   toast.error(t("plastic-trash-bag.warning.logoColor"));
    //   return;
    // }
    // if (!centerLogo) {
    //   toast.error(t("plastic-trash-bag.warning.centerLogo"));
    //   return;
    // }

    const defaultValues = {
      bagColor: t("plastic-trash-bag.defaultValue.bagColor"),
      logoColor: t("plastic-trash-bag.defaultValue.logoColor"),
      centerLogo: t("plastic-trash-bag.defaultValue.centerLogo"),
    };

    await generateImg({
      rawPrompt: `${bagColor || defaultValues.bagColor},${logoColor || defaultValues.logoColor},${centerLogo || defaultValues.centerLogo}`,
      prompt: plasticTrashBagPrompt(
        bagColor || defaultValues.bagColor,
        logoColor || defaultValues.logoColor,
        centerLogo || defaultValues.centerLogo
      ),
      type: "plastic_trash_bag",
      model: model,
    });
  };

  return (
    <div className="mx-auto max-w-xl">
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
          <div className="relative space-y-2">
            <Label htmlFor="bagColor" className="text-sm font-medium">
              {t("plastic-trash-bag.label.bagColor")}
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="bagColor"
                value={bagColor}
                onChange={(e) => setBagColor(e.target.value)}
                className="flex-1"
                placeholder={t("plastic-trash-bag.placeholder.bagColor")}
              />
              <div
                ref={bagColorRef}
                className="h-10 w-10 cursor-pointer rounded-full border border-gray-300"
                style={{ backgroundColor: bagColor }}
                onClick={() => toggleColorPalette("bagColor")}
              ></div>
            </div>

            {/* Character Color Picker */}
            {showColorPalette && activeColorField === "bagColor" && (
              <div
                ref={bagColorPickerRef}
                className="absolute right-0 z-10 mt-2"
              >
                <div className="rounded-md border border-gray-200 bg-white p-3 shadow-lg">
                  <div className="mb-2 text-sm font-medium">
                    {t("plastic-trash-bag.label.bagColor")}
                  </div>
                  <HexColorPicker
                    color={bagColor}
                    onChange={handleColorChange}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Background Box Color */}
          <div className="relative space-y-2">
            <Label htmlFor="logoColor" className="text-sm font-medium">
              {t("plastic-trash-bag.label.logoColor")}
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="logoColor"
                value={logoColor}
                onChange={(e) => setLogoColor(e.target.value)}
                className="flex-1"
                placeholder={t("plastic-trash-bag.placeholder.logoColor")}
              />
              <div
                ref={logoColorRef}
                className="h-10 w-10 cursor-pointer rounded-full border border-gray-300"
                style={{ backgroundColor: logoColor }}
                onClick={() => toggleColorPalette("logoColor")}
              ></div>
            </div>

            {/* Background Color Picker */}
            {showColorPalette && activeColorField === "logoColor" && (
              <div
                ref={logoColorPickerRef}
                className="absolute right-0 z-10 mt-2"
              >
                <div className="rounded-md border border-gray-200 bg-white p-3 shadow-lg">
                  <div className="mb-2 text-sm font-medium">
                    {t("plastic-trash-bag.label.logoColor")}
                  </div>
                  <HexColorPicker
                    color={logoColor}
                    onChange={handleColorChange}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {/* Character Input */}
          <div className="space-y-2">
            <Label htmlFor="centerLogo" className="text-sm font-medium">
              {t("plastic-trash-bag.label.centerLogo")}
            </Label>
            <Input
              id="centerLogo"
              placeholder={t("plastic-trash-bag.placeholder.centerLogo")}
              className="w-full"
              value={centerLogo}
              onChange={(e) => setCenterLogo(e.target.value)}
            />
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
