"use client";

import GenerationForm from "@/components/shared/generation-form";
import { examples } from "./examples";
import { sculptureImagePrompt, sculptureTextPrompt } from "./prompt";
import { useTranslations } from "next-intl";

export default function SculptureForm() {
  const t = useTranslations();
  return (
    <GenerationForm
      textPromptFn={sculptureTextPrompt}
      imagePromptFn={sculptureImagePrompt}
      textPlaceholder={t("sculpture.placeholder")}
      examples={examples}
      type="sculpture"
      defaultValues={{
        text: t("sculpture.defaultValue"),
      }}
      imgDescription={t("sculpture.label.description")}
    />
  );
}
