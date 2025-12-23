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
import { cityIsometricViewPrompt } from "./prompt";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { models } from "@/constants/models";

export default function CityIsometricViewForm() {
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState("sunny");
  const [weatherEffect, setWeatherEffect] = useState("sun");
  const [model, setModel] = useState("gpt-image-1");
  const { isGenerating, generateImg } = useGenerateImage();
  const t = useTranslations();
  const handleGenerate = async () => {
    // if (!city) {
    //   toast.error(t("city-isometric-view.warning.city"));
    //   return;
    // }
    const defaultValues = {
      city: t("city-isometric-view.placeholder.city").replace("e.g.", ""),
    };
    await generateImg({
      rawPrompt: `${city || defaultValues.city},${weather},${weatherEffect}`,
      prompt: cityIsometricViewPrompt(
        city || defaultValues.city,
        weather,
        weatherEffect
      ),
      type: "city_isometric_view",
      model: model,
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="space-y-6">
        <div className="flex items-center">
          <Label htmlFor="country" className="w-16 flex-shrink-0">
            {t("city-isometric-view.label.city")}
          </Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={t("city-isometric-view.placeholder.city")}
          />
        </div>

        <div className="flex items-center">
          <Label htmlFor="weather" className="w-16 flex-shrink-0">
            {t("city-isometric-view.label.weather")}
          </Label>
          <Select value={weather} onValueChange={setWeather}>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={t("city-isometric-view.placeholder.weather")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sunny">
                {t("city-isometric-view.weather.sunny")}
              </SelectItem>
              <SelectItem value="cloudy">
                {t("city-isometric-view.weather.cloudy")}
              </SelectItem>
              <SelectItem value="partly_cloudy">
                {t("city-isometric-view.weather.partly_cloudy")}
              </SelectItem>
              <SelectItem value="rainy">
                {t("city-isometric-view.weather.rainy")}
              </SelectItem>
              <SelectItem value="snowy">
                {t("city-isometric-view.weather.snowy")}
              </SelectItem>
              <SelectItem value="foggy">
                {t("city-isometric-view.weather.foggy")}
              </SelectItem>
              <SelectItem value="thunderstorm">
                {t("city-isometric-view.weather.thunderstorm")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center">
          <Label htmlFor="weatherEffect" className="w-16 flex-shrink-0">
            {t("city-isometric-view.label.weatherEffect")}
          </Label>
          <Select value={weatherEffect} onValueChange={setWeatherEffect}>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={t("city-isometric-view.placeholder.weatherEffect")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sun">
                {t("city-isometric-view.weatherEffect.sun")}
              </SelectItem>
              <SelectItem value="rain">
                {t("city-isometric-view.weatherEffect.rain")}
              </SelectItem>
              <SelectItem value="snow">
                {t("city-isometric-view.weatherEffect.snow")}
              </SelectItem>
              <SelectItem value="fog">
                {t("city-isometric-view.weatherEffect.fog")}
              </SelectItem>
              <SelectItem value="hail">
                {t("city-isometric-view.weatherEffect.hail")}
              </SelectItem>
              <SelectItem value="wind">
                {t("city-isometric-view.weatherEffect.wind")}
              </SelectItem>
              <SelectItem value="lightning">
                {t("city-isometric-view.weatherEffect.lightning")}
              </SelectItem>
              <SelectItem value="cloud">
                {t("city-isometric-view.weatherEffect.cloud")}
              </SelectItem>
            </SelectContent>
          </Select>
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
