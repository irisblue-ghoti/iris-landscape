"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAtom } from "jotai";
import { exampleStoreAtom } from "@/stores/slices/example_store";
import { examples } from "./examples";
import { useGenerateImage } from "@/hooks/use-generate-image";
import { toast } from "sonner";
import { handwritingNotePrompt } from "./prompt";
import { useLocale, useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { models } from "@/constants/models";

export default function HandwritingNoteForm() {
  const [noteType, setNoteType] = useState<
    "scenicGuide" | "travelNotes" | "novelNotes" | "handwritingNote"
  >("scenicGuide");
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const { isGenerating, generateImg } = useGenerateImage();
  const [text, setText] = useState("");
  const t = useTranslations();
  const [layout, setLayout] = useState("vertical");
  const [language, setLanguage] = useState<"zh" | "en" | "ja">("zh");
  const locale = useLocale();
  const [model, setModel] = useState("gpt-image-1");

  useEffect(() => {
    setText("");
  }, [noteType]);

  const handleGenerate = async () => {
    // if (!text) {
    //   toast.error(t("handwriting-note.warning.text"));
    //   return;
    // }
    const defaultValues = {
      scenicGuide: t("handwriting-note.defaultValue.scenicGuide"),
      travelNotes: t("handwriting-note.defaultValue.travelNotes"),
      novelNotes: t("handwriting-note.defaultValue.novelNotes"),
      handwritingNote: t("handwriting-note.defaultValue.handwritingNote"),
    };
    let prompt = "";
    if (noteType !== "handwritingNote") {
      const p = handwritingNotePrompt(text || defaultValues[noteType], layout);
      prompt = p[noteType][locale as keyof (typeof p)[typeof noteType]];
    } else {
      const p = handwritingNotePrompt(
        text || defaultValues.handwritingNote,
        layout
      );
      prompt = p[noteType][language];
    }

    await generateImg({
      rawPrompt: `${text || defaultValues[noteType]}`,
      prompt,
      isOptimize: true,
      customOptimizePrompt: prompt,
      size: "1024x1536",
      type: "handwriting_note",
      model: model,
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Label htmlFor="model-select" className="w-20 flex-shrink-0">
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
          <Label htmlFor="noteType" className="w-20 flex-shrink-0">
            {t("handwriting-note.label.type")}
          </Label>
          <Select
            value={noteType}
            onValueChange={(value) => setNoteType(value as any)}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={t("handwriting-note.select.scenicGuide")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scenicGuide">
                {t("handwriting-note.select.scenicGuide")}
              </SelectItem>
              <SelectItem value="travelNotes">
                {t("handwriting-note.select.travelNotes")}
              </SelectItem>
              <SelectItem value="novelNotes">
                {t("handwriting-note.select.novelNotes")}
              </SelectItem>
              <SelectItem value="handwritingNote">
                {t("handwriting-note.select.handwritingNote")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-start gap-4">
          {noteType === "scenicGuide" && (
            <>
              <Label
                htmlFor="internalWorld"
                className="w-20 flex-shrink-0 pt-2"
              >
                {t("handwriting-note.label.scenicName")}
              </Label>
              <Textarea
                id="internalWorld"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t(
                  "handwriting-note.placeholder.scenicNamePlaceholder"
                )}
                className="min-h-[100px]"
              />
            </>
          )}

          {noteType === "travelNotes" && (
            <>
              <Label
                htmlFor="internalWorld"
                className="w-20 flex-shrink-0 pt-2"
              >
                {t("handwriting-note.label.destination")}
              </Label>
              <Textarea
                id="internalWorld"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t(
                  "handwriting-note.placeholder.destinationPlaceholder"
                )}
                className="min-h-[100px]"
              />
            </>
          )}

          {noteType === "novelNotes" && (
            <>
              <Label
                htmlFor="internalWorld"
                className="w-20 flex-shrink-0 pt-2"
              >
                {t("handwriting-note.label.novelName")}
              </Label>
              <Textarea
                id="internalWorld"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t(
                  "handwriting-note.placeholder.novelNamePlaceholder"
                )}
                className="min-h-[100px]"
              />
            </>
          )}

          {noteType === "handwritingNote" && (
            <>
              <Label
                htmlFor="internalWorld"
                className="w-20 flex-shrink-0 pt-2"
              >
                {t("handwriting-note.label.noteTheme")}
              </Label>
              <Textarea
                id="internalWorld"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t(
                  "handwriting-note.placeholder.noteThemePlaceholder"
                )}
                className="min-h-[100px]"
              />
            </>
          )}
        </div>
        {noteType === "handwritingNote" && (
          <div className="flex w-full justify-between">
            <div className="flex items-center space-x-4">
              <Label
                htmlFor="internalWorld"
                className="w-20 flex-shrink-0 pt-2"
              >
                {t("handwriting-note.label.annotationLayout")}
              </Label>
              <ToggleGroup
                type="single"
                value={layout}
                onValueChange={(value) => value && setLayout(value)}
                className="rounded-md border"
              >
                <ToggleGroupItem
                  value="horizontal"
                  className="px-4 py-2 data-[state=off]:bg-white data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  {t("handwriting-note.select.horizontal")}
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="vertical"
                  className="px-4 py-2 data-[state=off]:bg-white data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  {t("handwriting-note.select.vertical")}
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="flex items-center space-x-4">
              <Label htmlFor="internalWorld" className="flex-shrink-0 pt-2">
                {t("handwriting-note.label.language")}
              </Label>
              <ToggleGroup
                type="single"
                value={language}
                onValueChange={(value) => value && setLanguage(value as any)}
                className="rounded-md border"
              >
                <ToggleGroupItem
                  value="zh"
                  className="px-4 py-2 data-[state=off]:bg-white data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  {t("handwriting-note.select.chinese")}
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="en"
                  className="px-4 py-2 data-[state=off]:bg-white data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  {t("handwriting-note.select.english")}
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="ja"
                  className="px-4 py-2 data-[state=off]:bg-white data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  {t("handwriting-note.select.japanese")}
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        )}

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
