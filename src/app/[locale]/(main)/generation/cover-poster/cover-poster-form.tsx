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
import {
  colorSvgPrompt,
  magzineCoverPrompt,
  vintageCoverPrompt,
} from "./prompt";
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

export default function CoverPosterForm() {
  const [model, setModel] = useState("gpt-image-1");
  // 类型
  const [coverType, setCoverType] = useState<
    "colorSvg" | "magzineCover" | "vintageCover"
  >("colorSvg");

  // 海报标题
  const [title, setTitle] = useState("");
  // 海报副标题
  const [subtitle, setSubtitle] = useState("");
  // 海报内容
  const [content, setContent] = useState("");

  // 杂志标题
  const [magazineTitle, setMagazineTitle] = useState("");
  // 杂志内容
  const [magazineContent, setMagazineContent] = useState("");

  // 海报主题
  const [posterTheme, setPosterTheme] = useState("");
  // 中心主题
  const [centerTheme, setCenterTheme] = useState("");
  // 文字标注
  const [textAnnotation, setTextAnnotation] = useState("");
  // 海报左下角
  const [posterLeftBottom, setPosterLeftBottom] = useState("");
  // 海报右下角
  const [posterRightBottom, setPosterRightBottom] = useState("");
  const locale = useLocale() as "zh" | "en" | "ja";

  // 海报文字语言
  const [language, setLanguage] = useState<"zh" | "en" | "ja">(locale);

  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const { isGenerating, generateImg } = useGenerateImage();
  const t = useTranslations();

  useEffect(() => {
    // Clear all inputs when cover type changes
    setTitle("");
    setSubtitle("");
    setContent("");
    setMagazineTitle("");
    setMagazineContent("");
    setPosterTheme("");
    setCenterTheme("");
    setTextAnnotation("");
    setPosterLeftBottom("");
    setPosterRightBottom("");
  }, [coverType]);

  const handleGenerate = async () => {
    let prompt = "";
    const defaultValues = {
      colorSvg: {
        title: t("cover-poster.defaultValue.colorSvg.title"),
        subtitle: t("cover-poster.defaultValue.colorSvg.subtitle"),
        content: t("cover-poster.defaultValue.colorSvg.content"),
      },
      magzineCover: {
        title: t("cover-poster.defaultValue.magzineCover.title"),
        content: t("cover-poster.defaultValue.magzineCover.content"),
      },
      vintageCover: {
        title: t("cover-poster.defaultValue.vintageCover.title"),
        main: t("cover-poster.defaultValue.vintageCover.main"),
        center: t("cover-poster.defaultValue.vintageCover.center"),
        textAnnotation: t(
          "cover-poster.defaultValue.vintageCover.textAnnotation"
        ),
        leftBottom: t("cover-poster.defaultValue.vintageCover.leftBottom"),
        rightBottom: t("cover-poster.defaultValue.vintageCover.rightBottom"),
      },
    };
    if (coverType === "colorSvg") {
      // if (!title) {
      //   toast.error(t("cover-poster.warning.title"));
      //   return;
      // }
      // if (!subtitle) {
      //   toast.error(t("cover-poster.warning.subtitle"));
      //   return;
      // }
      // if (!content) {
      //   toast.error(t("cover-poster.warning.content"));
      //   return;
      // }
      const p = colorSvgPrompt(
        title || defaultValues.colorSvg.title,
        subtitle || defaultValues.colorSvg.subtitle,
        content || defaultValues.colorSvg.content
      );
      prompt = p.colorSvg;
    } else if (coverType === "magzineCover") {
      // if (!title) {
      //   toast.error(t("cover-poster.warning.magazine-title"));
      //   return;
      // }
      // if (!magazineContent) {
      //   toast.error(t("cover-poster.warning.magazine-content"));
      //   return;
      // }

      const p = magzineCoverPrompt(
        magazineContent || defaultValues.magzineCover.content,
        title || defaultValues.magzineCover.title
      );
      prompt = p.colorSvg;
    } else if (coverType === "vintageCover") {
      // if (!posterTheme) {
      //   toast.error(t("cover-poster.warning.vintage-main"));
      //   return;
      // }
      // if (!centerTheme) {
      //   toast.error(t("cover-poster.warning.vintage-center"));
      //   return;
      // }
      // if (!textAnnotation) {
      //   toast.error(t("cover-poster.warning.vintage-text-annotation"));
      //   return;
      // }
      // if (!posterLeftBottom) {
      //   toast.error(t("cover-poster.warning.vintage-left-bottom"));
      //   return;
      // }
      // if (!posterRightBottom) {
      //   toast.error(t("cover-poster.warning.vintage-right-bottom"));
      //   return;
      // }
      const p = vintageCoverPrompt(
        centerTheme || defaultValues.vintageCover.center,
        posterTheme || defaultValues.vintageCover.main,
        posterLeftBottom || defaultValues.vintageCover.leftBottom,
        posterRightBottom || defaultValues.vintageCover.rightBottom,
        language,
        textAnnotation || defaultValues.vintageCover.textAnnotation
      );
      prompt = p.colorSvg;
    }

    await generateImg({
      rawPrompt: `${title}`,
      prompt,
      isOptimize: false,
      customOptimizePrompt: prompt,
      size: "1536x1024",
      type: "cover_poster",
      model,
    });
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
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
        <div className="flex w-full items-center">
          <Label htmlFor="noteType" className="w-20">
            {t("cover-poster.label.type")}
          </Label>
          <div className="flex-1">
            <Select
              value={coverType}
              onValueChange={(value) => setCoverType(value as any)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("cover-poster.select.colorSvg")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="colorSvg">
                  {t("cover-poster.select.colorSvg")}
                </SelectItem>
                <SelectItem value="magzineCover">
                  {t("cover-poster.select.magzineCover")}
                </SelectItem>
                <SelectItem value="vintageCover">
                  {t("cover-poster.select.vintageCover")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4">
          {coverType === "colorSvg" && (
            <>
              <div className="flex w-full items-start">
                <Label htmlFor="title" className="w-20 flex-shrink-0">
                  {t("cover-poster.label.svg-cover-title")}
                </Label>
                <div className="flex-1">
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t("cover-poster.placeholder.svg-cover-title")}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex w-full items-start">
                <Label htmlFor="subtitle" className="w-20 flex-shrink-0">
                  {t("cover-poster.label.svg-cover-subtitle")}
                </Label>
                <div className="flex-1">
                  <Textarea
                    id="subtitle"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder={t(
                      "cover-poster.placeholder.svg-cover-subtitle"
                    )}
                    className="min-h-[100px] w-full"
                  />
                </div>
              </div>
              <div className="flex w-full items-start">
                <Label htmlFor="content" className="w-20 flex-shrink-0">
                  {t("cover-poster.label.svg-cover-content")}
                </Label>
                <div className="flex-1">
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={t(
                      "cover-poster.placeholder.svg-cover-content"
                    )}
                    className="min-h-[100px] w-full"
                  />
                </div>
              </div>
            </>
          )}

          {coverType === "magzineCover" && (
            <>
              <div className="flex w-full items-start">
                <Label htmlFor="title" className="w-20 flex-shrink-0">
                  {t("cover-poster.label.magazine-cover-title")}
                </Label>
                <div className="flex-1">
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t(
                      "cover-poster.placeholder.magazine-cover-title"
                    )}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex w-full items-start">
                <Label htmlFor="subtitle" className="w-20 flex-shrink-0">
                  {t("cover-poster.label.magazine-cover-content")}
                </Label>
                <div className="flex-1">
                  <Textarea
                    id="magazineContent"
                    value={magazineContent}
                    onChange={(e) => setMagazineContent(e.target.value)}
                    placeholder={t(
                      "cover-poster.placeholder.magazine-cover-content"
                    )}
                    className="min-h-[100px] w-full"
                  />
                </div>
              </div>
            </>
          )}

          {coverType === "vintageCover" && (
            <>
              <div className="flex w-full flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex w-full items-center">
                    <Label htmlFor="title" className="w-20 flex-shrink-0">
                      {t("cover-poster.label.vintage-cover-main")}
                    </Label>
                    <div className="flex-1">
                      <Input
                        id="posterTheme"
                        value={posterTheme}
                        onChange={(e) => setPosterTheme(e.target.value)}
                        placeholder={t(
                          "cover-poster.placeholder.vintage-cover-main"
                        )}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="flex w-full items-center">
                    <Label
                      htmlFor="posterLeftBottom"
                      className="w-20 flex-shrink-0"
                    >
                      {t("cover-poster.label.vintage-cover-left-bottom")}
                    </Label>
                    <div className="flex-1">
                      <Input
                        id="posterLeftBottom"
                        value={posterLeftBottom}
                        onChange={(e) => setPosterLeftBottom(e.target.value)}
                        placeholder={t(
                          "cover-poster.placeholder.vintage-cover-left-bottom"
                        )}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex w-full">
                    <Label htmlFor="subtitle" className="w-20 flex-shrink-0">
                      {t("cover-poster.label.vintage-cover-center")}
                    </Label>
                    <div className="flex-1">
                      <Textarea
                        id="centerTheme"
                        value={centerTheme}
                        onChange={(e) => setCenterTheme(e.target.value)}
                        placeholder={t(
                          "cover-poster.placeholder.vintage-cover-center"
                        )}
                        className="h-full min-h-[154px] w-full"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-6">
                    <div className="flex w-full">
                      <Label
                        htmlFor="posterRightBottom"
                        className="w-20 flex-shrink-0"
                      >
                        {t("cover-poster.label.vintage-cover-right-bottom")}
                      </Label>
                      <div className="flex-1">
                        <Textarea
                          id="posterRightBottom"
                          value={posterRightBottom}
                          onChange={(e) => setPosterRightBottom(e.target.value)}
                          placeholder={t(
                            "cover-poster.placeholder.vintage-cover-right-bottom"
                          )}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between">
                      <Label
                        htmlFor="language"
                        className="w-20 flex-shrink-0 whitespace-nowrap"
                      >
                        {t("cover-poster.label.vintage-cover-language")}
                      </Label>
                      <ToggleGroup
                        type="single"
                        value={language}
                        onValueChange={(value) =>
                          value && setLanguage(value as any)
                        }
                        className="rounded-md border border-gray-200"
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
                </div>

                <div className="flex w-1/2">
                  <Label
                    htmlFor="textAnnotation"
                    className="w-20 flex-shrink-0"
                  >
                    {t("cover-poster.label.vintage-cover-text-annotation")}
                  </Label>
                  <div className="flex-1">
                    <Textarea
                      id="textAnnotation"
                      value={textAnnotation}
                      onChange={(e) => setTextAnnotation(e.target.value)}
                      placeholder={t(
                        "cover-poster.placeholder.vintage-cover-text-annotation"
                      )}
                      className="h-full min-h-[154px] w-full"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
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
