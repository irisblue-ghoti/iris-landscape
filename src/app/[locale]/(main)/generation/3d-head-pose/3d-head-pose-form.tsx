"use client";

import GenerationForm from "@/components/shared/generation-form";
import { examples } from "./examples";
import { threeDHeadPoseImagePrompt, threeDHeadPoseTextPrompt } from "./prompt";
import { useTranslations } from "next-intl";

export default function ThreeDHeadPoseForm() {
  const t = useTranslations();
  return (
    <GenerationForm
      textPromptFn={threeDHeadPoseTextPrompt}
      imagePromptFn={threeDHeadPoseImagePrompt}
      textPlaceholder={t("3d-head-pose.placeholder")}
      examples={examples}
      type="3d_head_pose"
      defaultValues={{
        text: t("3d-head-pose.defaultValue"),
      }}
      imgDescription={t("3d-head-pose.label.description")}
      editImage={false}
    />
  );
}
