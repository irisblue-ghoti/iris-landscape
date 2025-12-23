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
import { passportStampPrompt } from "./prompt";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { models } from "@/constants/models";

export default function PassportStampForm() {
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [landmarks, setLandmarks] = useState("");
  const [date, setDate] = useState("");
  const [model, setModel] = useState("gpt-image-1");
  const { isGenerating, generateImg } = useGenerateImage();
  const t = useTranslations();
  const handleGenerate = async () => {
    // if (!country) {
    //   toast.error(t("passport-stamp.warning.country"));
    //   return;
    // }

    // if (!city) {
    //   toast.error(t("passport-stamp.warning.city"));
    //   return;
    // }

    // if (!landmarks) {
    //   toast.error(t("passport-stamp.warning.landmarks"));
    //   return;
    // }

    // if (!date) {
    //   toast.error(t("passport-stamp.warning.date"));
    //   return;
    // }
    const defaultValues = {
      city: t("passport-stamp.placeholder.city").replace("e.g.", ""),
      country: t("passport-stamp.placeholder.country").replace("e.g.", ""),
      landmarks: t("passport-stamp.placeholder.landmarks").replace("e.g.", ""),
      date: t("passport-stamp.placeholder.date").replace("e.g.", ""),
    };
    await generateImg({
      rawPrompt: `${city || defaultValues.city},${country || defaultValues.country},${landmarks || defaultValues.landmarks},${date || defaultValues.date}`,
      prompt: passportStampPrompt(
        city || defaultValues.city,
        country || defaultValues.country,
        landmarks || defaultValues.landmarks,
        date || defaultValues.date
      ),
      type: "passport_stamp",
      model: model,
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Label htmlFor="country" className="w-16 flex-shrink-0 text-wrap">
            {t("passport-stamp.label.country")}
          </Label>
          <Input
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder={t("passport-stamp.placeholder.country")}
            className="flex-1"
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Label htmlFor="city" className="w-16 flex-shrink-0 text-wrap">
            {t("passport-stamp.label.city")}
          </Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={t("passport-stamp.placeholder.city")}
            className="flex-1"
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Label htmlFor="landmarks" className="w-16 flex-shrink-0 text-wrap">
            {t("passport-stamp.label.landmarks")}
          </Label>
          <Input
            id="landmarks"
            value={landmarks}
            onChange={(e) => setLandmarks(e.target.value)}
            placeholder={t("passport-stamp.placeholder.landmarks")}
            className="flex-1"
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Label htmlFor="date" className="w-16 flex-shrink-0 text-wrap">
            {t("passport-stamp.label.date")}
          </Label>
          <Input
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder={t("passport-stamp.placeholder.date")}
            className="flex-1"
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Label
            htmlFor="model-select"
            className="w-16 flex-shrink-0 text-wrap"
          >
            {t("common.model")}
          </Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger id="model-select" className="flex-1">
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
