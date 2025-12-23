"use client";

import GenerationForm from "@/components/shared/generation-form";
import { examples } from "./examples";
import { crystalBallImagePrompt, crystalBallTextPrompt } from "./prompt";
import { useTranslations } from "next-intl";

export default function CrystalBallForm() {
  const t = useTranslations();
  return (
    <GenerationForm
      textPromptFn={crystalBallTextPrompt}
      imagePromptFn={crystalBallImagePrompt}
      textPlaceholder={t("crystal-ball.placeholder")}
      examples={examples}
      type="crystal_ball"
      defaultValues={{
        text: t("crystal-ball.defaultValue"),
      }}
      imgDescription={t("crystal-ball.label.description")}
      editImage={false}
    />
  );
}
