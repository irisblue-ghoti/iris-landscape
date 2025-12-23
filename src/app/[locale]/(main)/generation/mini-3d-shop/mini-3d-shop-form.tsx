"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAtom } from "jotai";
import { exampleStoreAtom } from "@/stores/slices/example_store";
import { examples } from "./examples";
import { useGenerateImage } from "@/hooks/use-generate-image";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { mini3DShopPrompt } from "./prompt";
import { models } from "@/constants/models";

export default function Mini3DShopForm() {
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const [storeType, setStoreType] = useState("shop");
  const [customStoreType, setCustomStoreType] = useState("");
  const [storeShape, setStoreShape] = useState("");
  const [textSign, setTextSign] = useState("");
  const { isGenerating, generateImg } = useGenerateImage();
  const t = useTranslations();
  const [model, setModel] = useState("gpt-image-1");
  const handleGenerate = async () => {
    if (!storeType) {
      toast.error(t("mini-3d-shop.warning.storeType"));
      return;
    }

    const actualStoreType =
      storeType === "custom" ? customStoreType : storeType;

    const defaultValues = {
      storeType: "商店",
      storeShape: "香奈儿包包",
      textSign: "Bags",
    };

    await generateImg({
      rawPrompt: `${actualStoreType || defaultValues.storeType},${storeShape},${textSign}`,
      prompt: mini3DShopPrompt(
        actualStoreType || defaultValues.storeType,
        storeShape || defaultValues.storeShape,
        textSign || defaultValues.textSign
      ),
      type: "city_isometric_view",
      model,
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
        <div className="flex items-center gap-4">
          <Label htmlFor="storeType" className="w-16 flex-shrink-0">
            {t("mini-3d-shop.label.storeType")}
          </Label>
          <Select value={storeType} onValueChange={setStoreType}>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={t("mini-3d-shop.placeholder.storeType")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="shop">
                {t("mini-3d-shop.label.shop")}
              </SelectItem>
              <SelectItem value="supermarket">
                {t("mini-3d-shop.label.supermarket")}
              </SelectItem>
              <SelectItem value="food">
                {t("mini-3d-shop.label.food")}
              </SelectItem>
              <SelectItem value="fruit">
                {t("mini-3d-shop.label.fruit")}
              </SelectItem>
              <SelectItem value="custom">
                {t("mini-3d-shop.label.custom")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {storeType === "custom" && (
          <div className="flex items-center gap-4">
            <Label htmlFor="customStoreType" className="w-16 flex-shrink-0">
              {t("mini-3d-shop.label.customStoreType")}
            </Label>
            <Input
              id="customStoreType"
              value={customStoreType}
              onChange={(e) => setCustomStoreType(e.target.value)}
              placeholder={t("mini-3d-shop.placeholder.customStoreType")}
            />
          </div>
        )}

        <div className="flex items-center gap-4">
          <Label htmlFor="storeShape" className="w-16 flex-shrink-0">
            {t("mini-3d-shop.label.storeShape")}
          </Label>
          <Input
            id="storeShape"
            value={storeShape}
            onChange={(e) => setStoreShape(e.target.value)}
            placeholder={t("mini-3d-shop.placeholder.storeShape")}
          />
        </div>

        <div className="flex items-center gap-4">
          <Label htmlFor="textSign" className="w-16 flex-shrink-0">
            {t("mini-3d-shop.label.textSign")}
          </Label>
          <Input
            id="textSign"
            value={textSign}
            onChange={(e) => setTextSign(e.target.value)}
            placeholder={t("mini-3d-shop.placeholder.textSign")}
          />
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
