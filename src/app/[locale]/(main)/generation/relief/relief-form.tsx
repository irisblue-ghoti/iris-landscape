"use client";

import GenerationForm from "@/components/shared/generation-form";
import { examples } from "./examples";
import { reliefImagePrompt, reliefTextPrompt } from "./prompt";
import { useTranslations } from "next-intl";

export default function ReliefForm() {
  const t = useTranslations();
  return (
    <GenerationForm
      textPromptFn={reliefTextPrompt}
      imagePromptFn={reliefImagePrompt}
      textPlaceholder={t("relief.placeholder")}
      examples={examples}
      type="relief"
      defaultValues={{
        text: t("relief.defaultValue"),
      }}
      imgDescription={t("relief.label.description")}
    />
  );
}
