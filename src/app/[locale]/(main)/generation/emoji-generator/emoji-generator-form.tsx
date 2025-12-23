"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAtom } from "jotai";
import { exampleStoreAtom } from "@/stores/slices/example_store";
import { examples } from "./examples";
import { useGenerateImage } from "@/hooks/use-generate-image";
import { toast } from "sonner";
import { emojiGeneratorPrompt, type EmojiStyleType } from "./prompt";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Pencil } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";
import { useTranslations } from "next-intl";
import { models } from "@/constants/models";
import { Label } from "@/components/ui/label";

export default function EmojiGeneratorForm() {
  const t = useTranslations();
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const [emoji, setEmoji] = useState("");
  const [materialStyle, setMaterialStyle] =
    useState<EmojiStyleType>("paperCraft");
  const [edgeText, setEdgeText] = useState("");
  const [customText, setCustomText] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const { generateImg } = useGenerateImage();
  const [model, setModel] = useState("gpt-image-1");

  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    setEmoji(emoji + emojiData.emoji);
    setIsEmojiPickerOpen(false);
  };

  const handleGenerate = async () => {
    // if (!materialStyle) {
    //   toast.error(t("emoji-generator.warning.material"));
    //   return;
    // }

    // if (materialStyle === "custom" && !customText) {
    //   toast.error(t("emoji-generator.warning.custom_text"));
    //   return;
    // }

    const defaultValues = {
      vacuumPacked: t("emoji-generator.defaultValue.vacuumPacked"),
      custom: t("emoji-generator.defaultValue.custom"),
      text: t("emoji-generator.defaultValue.text"),
    };

    // 根据材质类型确定文字
    const text =
      materialStyle === "vacuumPacked"
        ? edgeText || defaultValues.vacuumPacked
        : materialStyle === "custom"
          ? customText || defaultValues.custom
          : "";

    await generateImg({
      rawPrompt: emoji || defaultValues.text,
      prompt: emojiGeneratorPrompt(
        emoji || defaultValues.text,
        text,
        materialStyle
      ),
      isOptimize: true,
      type: "emoji_generator",
      model: model,
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="w-full space-y-6">
        {/* Top section - Emoji input */}
        <div className="flex w-full gap-2">
          <div className="relative flex-1">
            <Input
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder={t("emoji-generator.placeholder.emoji")}
              className="h-12 w-full rounded-md border-2 pr-10"
            />
          </div>
          <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-md border-2"
              >
                <Pencil className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <EmojiPicker
                onEmojiClick={handleEmojiSelect}
                lazyLoadEmojis
                skinTonesDisabled
                searchDisabled
                autoFocusSearch={false}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Conditional fields based on material style */}
        {materialStyle === "vacuumPacked" && (
          <div className="flex w-full items-center gap-2">
            <label className="mb-1 block text-sm font-medium md:flex-shrink-0">
              {t("emoji-generator.label.edge_text")}
            </label>
            <Input
              value={edgeText}
              onChange={(e) => setEdgeText(e.target.value)}
              className="h-12 w-full rounded-md border-2"
              placeholder={t("emoji-generator.placeholder.vacuumPacked")}
            />
          </div>
        )}

        {materialStyle === "custom" && (
          <Textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="min-h-[100px] w-full rounded-md border-2"
            placeholder={t("emoji-generator.placeholder.custom_text")}
          />
        )}

        {/* Bottom section - Material style and generate button */}
        <div className="flex w-full flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <label className="whitespace-nowrap text-sm font-medium">
                {t("emoji-generator.label.material_style")}
              </label>
              <Select
                value={materialStyle}
                onValueChange={(val) => setMaterialStyle(val as EmojiStyleType)}
              >
                <SelectTrigger className="h-12 w-full max-w-[350px] rounded-md border-2">
                  <SelectValue
                    placeholder={t(
                      "emoji-generator.placeholder.material_style"
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">
                    {t("emoji-generator.style.custom")}
                  </SelectItem>
                  <SelectItem value="paperCraft">
                    {t("emoji-generator.style.paperCraft")}
                  </SelectItem>
                  <SelectItem value="fluffy3D">
                    {t("emoji-generator.style.fluffy3D")}
                  </SelectItem>
                  <SelectItem value="inflatableToy">
                    {t("emoji-generator.style.inflatableToy")}
                  </SelectItem>
                  <SelectItem value="heliumBalloon">
                    {t("emoji-generator.style.heliumBalloon")}
                  </SelectItem>
                  <SelectItem value="cork3D">
                    {t("emoji-generator.style.cork3D")}
                  </SelectItem>
                  <SelectItem value="microFiberPillow">
                    {t("emoji-generator.style.microFiberPillow")}
                  </SelectItem>
                  <SelectItem value="8bitPixel">
                    {t("emoji-generator.style.8bitPixel")}
                  </SelectItem>
                  <SelectItem value="tuftedCarpet">
                    {t("emoji-generator.style.tuftedCarpet")}
                  </SelectItem>
                  <SelectItem value="frostedGlass">
                    {t("emoji-generator.style.frostedGlass")}
                  </SelectItem>
                  <SelectItem value="iceCream">
                    {t("emoji-generator.style.iceCream")}
                  </SelectItem>
                  <SelectItem value="silk">
                    {t("emoji-generator.style.silk")}
                  </SelectItem>
                  <SelectItem value="metal">
                    {t("emoji-generator.style.metal")}
                  </SelectItem>
                  <SelectItem value="marble">
                    {t("emoji-generator.style.marble")}
                  </SelectItem>
                  <SelectItem value="woodcut">
                    {t("emoji-generator.style.woodcut")}
                  </SelectItem>
                  <SelectItem value="velvet">
                    {t("emoji-generator.style.velvet")}
                  </SelectItem>
                  <SelectItem value="leather">
                    {t("emoji-generator.style.leather")}
                  </SelectItem>
                  <SelectItem value="holographic3D">
                    {t("emoji-generator.style.holographic3D")}
                  </SelectItem>
                  <SelectItem value="wickerWeave">
                    {t("emoji-generator.style.wickerWeave")}
                  </SelectItem>
                  <SelectItem value="fabricTextile">
                    {t("emoji-generator.style.fabricTextile")}
                  </SelectItem>
                  <SelectItem value="buildingBlocks">
                    {t("emoji-generator.style.buildingBlocks")}
                  </SelectItem>
                  <SelectItem value="iceSculpture">
                    {t("emoji-generator.style.iceSculpture")}
                  </SelectItem>
                  <SelectItem value="paperCutWindow">
                    {t("emoji-generator.style.paperCutWindow")}
                  </SelectItem>
                  <SelectItem value="pineCone">
                    {t("emoji-generator.style.pineCone")}
                  </SelectItem>
                  <SelectItem value="vacuumPacked">
                    {t("emoji-generator.style.vacuumPacked")}
                  </SelectItem>

                  <SelectItem value="leopard">
                    {t("emoji-generator.style.leopard")}
                  </SelectItem>
                  <SelectItem value="3DMetalChrome">
                    {t("emoji-generator.style.3DMetalChrome")}
                  </SelectItem>
                  <SelectItem value="pastry">
                    {t("emoji-generator.style.pastry")}
                  </SelectItem>
                  <SelectItem value="rainbowGlass">
                    {t("emoji-generator.style.rainbowGlass")}
                  </SelectItem>
                  <SelectItem value="felt">
                    {t("emoji-generator.style.felt")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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
          <div className="flex items-center gap-4">
            <Button
              className="rounded-md bg-violet-500 text-white hover:bg-violet-600"
              onClick={handleGenerate}
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
