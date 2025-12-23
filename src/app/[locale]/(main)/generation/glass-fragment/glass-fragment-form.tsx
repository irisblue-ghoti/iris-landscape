"use client";

import GenerationForm from "@/components/shared/generation-form";
import { examples } from "./examples";

import { useTranslations } from "next-intl";
import { glassFragmentImagePrompt, glassFragmentTextPrompt } from "./prompt";

export default function GlassFragmentForm() {
  const t = useTranslations();
  return (
    <GenerationForm
      textPromptFn={glassFragmentTextPrompt}
      imagePromptFn={glassFragmentImagePrompt}
      textPlaceholder={t("glass_fragment.placeholder.subject")}
      examples={examples}
      type="glass_fragment"
      defaultValues={{
        text: t("glass_fragment.defaultValue.subject"),
      }}
      imgDescription={t("")}
      editImage={false}
    />
  );
}
