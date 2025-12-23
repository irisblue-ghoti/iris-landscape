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
import { grabMachinePrompt } from "./prompt";
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
  const [brandName, setBrandName] = useState("");
  const [machineColor, setMachineColor] = useState("#FFFFFF");
  const [internalItems, setInternalItems] = useState("");
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
      brandName: t("grab_machine.defaultValue.brandName"),
      machineColor: t("grab_machine.defaultValue.machineColor"),
      internalItems: t("grab_machine.defaultValue.internalItems"),
    };
    await generateImg({
      rawPrompt: `${brandName || defaultValues.brandName},${machineColor || defaultValues.machineColor},${internalItems || defaultValues.internalItems}`,
      prompt: grabMachinePrompt(
        brandName || defaultValues.brandName,
        machineColor || defaultValues.machineColor,
        internalItems || defaultValues.internalItems
      ),
      isOptimize: true,
      customOptimizePrompt: grabMachinePrompt(
        brandName || defaultValues.brandName,
        machineColor || defaultValues.machineColor,
        internalItems || defaultValues.internalItems
      ),
      type: "grab_machine",
      model,
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="space-y-6">
        <div className="flex items-center">
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
        <div className="flex items-center">
          <Label htmlFor="country" className="w-24 flex-shrink-0">
            {t("grab_machine.label.brandName")}
          </Label>
          <Input
            id="brandName"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder={t("grab_machine.placeholder.brandName")}
          />
        </div>

        <div className="flex items-center">
          <Label htmlFor="internalItems" className="w-24 flex-shrink-0">
            {t("grab_machine.label.internalItems")}
          </Label>
          <Input
            id="internalItems"
            value={internalItems}
            onChange={(e) => setInternalItems(e.target.value)}
            placeholder={t("grab_machine.placeholder.internalItems")}
          />
        </div>

        <div className="flex items-center">
          <Label htmlFor="machineColor" className="w-24 flex-shrink-0">
            {t("grab_machine.label.machineColor")}
          </Label>
          <div className="flex flex-1 items-center space-x-2">
            <Input
              id="machineColor"
              value={machineColor}
              onChange={(e) => setMachineColor(e.target.value)}
              placeholder={t("grab_machine.placeholder.machineColor")}
            />
            <div
              ref={colorBoxRef}
              className="h-10 w-10 cursor-pointer rounded-full border border-gray-300"
              style={{ backgroundColor: machineColor }}
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
                  {t("grab_machine.label.machineColor")}
                </div>
                <HexColorPicker
                  color={machineColor}
                  onChange={(color) => setMachineColor(color)}
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
