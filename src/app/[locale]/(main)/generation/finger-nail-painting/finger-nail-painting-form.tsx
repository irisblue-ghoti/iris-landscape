"use client";

import GenerationForm from "@/components/shared/generation-form";
import { examples } from "./examples";
import {
  fingerNailPaintingImagePrompt,
  fingerNailPaintingTextPrompt,
} from "./prompt";
import { useTranslations } from "next-intl";
export default function FingerNailPaintingForm() {
  const t = useTranslations();
  return (
    <GenerationForm
      textPromptFn={fingerNailPaintingTextPrompt}
      imagePromptFn={fingerNailPaintingImagePrompt}
      textPlaceholder={t("finger_nail_painting.placeholder.text")}
      examples={examples}
      type="finger_nail_painting"
      defaultValues={{
        text: t("finger_nail_painting.defaultValue.text"),
      }}
      imgDescription={t("finger_nail_painting.label.description")}
    />
  );
}
