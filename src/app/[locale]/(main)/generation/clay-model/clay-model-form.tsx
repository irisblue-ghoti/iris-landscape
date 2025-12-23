"use client";

import GenerationForm from "@/components/shared/generation-form";
import { examples } from "./examples";
import { clayModelImagePrompt, clayModelTextPrompt } from "./prompt";
import { useTranslations } from "next-intl";

export default function ClayModelForm() {
  const t = useTranslations();
  return (
    <GenerationForm
      textPromptFn={clayModelTextPrompt}
      imagePromptFn={clayModelImagePrompt}
      textPlaceholder={t("clay-model.placeholder")}
      examples={examples}
      type="clay_model"
      defaultValues={{
        text: t("clay-model.defaultValue"),
      }}
      imgDescription={t("clay-model.label.description")}
    />
  );
}
