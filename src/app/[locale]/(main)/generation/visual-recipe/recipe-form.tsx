"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { handleDrawPrompt, handleRealPrompt } from "./prompt";
import { useGenerateImage } from "@/hooks/use-generate-image";
import { toast } from "sonner";
import { useAtom } from "jotai";
import { exampleStoreAtom } from "@/stores/slices/example_store";
import { examples } from "./examples";
import { useTranslations } from "next-intl";
import { models } from "@/constants/models";
export default function RecipeForm() {
  const t = useTranslations();
  const [dishName, setDishName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [cookingSteps, setCookingSteps] = useState("");
  const [style, setStyle] = useState("handdrawn");
  const [model, setModel] = useState("gpt-image-1");
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const { isGenerating, generateImg } = useGenerateImage();

  const defaultValues = {
    dishName: t("visual-recipe.input.placeholder"),
    ingredients: t("visual-recipe.input.ingredients_placeholder"),
    cookingSteps: t("visual-recipe.input.cooking_steps_placeholder"),
  };

  const handleGenerateImage = async () => {
    const prompt =
      style === "handdrawn"
        ? handleDrawPrompt(
            dishName || defaultValues.dishName,
            ingredients || defaultValues.ingredients,
            cookingSteps || defaultValues.cookingSteps
          )
        : handleRealPrompt(
            dishName || defaultValues.dishName,
            ingredients || defaultValues.ingredients,
            cookingSteps || defaultValues.cookingSteps
          );

    await generateImg({
      rawPrompt: `${dishName || defaultValues.dishName}, ${ingredients || defaultValues.ingredients}, ${cookingSteps || defaultValues.cookingSteps}`,
      prompt,
      type: "visual_recipe",
      size: "1024x1536",
      model: model,
    });
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <div className="w-full flex-shrink-0 sm:w-24">
            <span className="text-sm font-medium">
              {t("visual-recipe.input.dish_name")}
            </span>
          </div>
          <Input
            id="dishName"
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
            placeholder={t("visual-recipe.input.placeholder")}
            className="w-full sm:max-w-lg"
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
          <div className="w-full flex-shrink-0 sm:w-24">
            <span className="text-sm font-medium">
              {t("visual-recipe.input.ingredients")}
            </span>
          </div>
          <Textarea
            id="ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder={t("visual-recipe.input.ingredients_placeholder")}
            className="min-h-[100px] w-full sm:max-w-lg"
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
          <div className="w-full flex-shrink-0 sm:w-24">
            <span className="text-sm font-medium">
              {t("visual-recipe.input.cooking_steps")}
            </span>
          </div>
          <div className="flex w-full flex-col gap-4 sm:flex-row">
            <Textarea
              id="cookingSteps"
              value={cookingSteps}
              onChange={(e) => setCookingSteps(e.target.value)}
              placeholder={t("visual-recipe.input.cooking_steps_placeholder")}
              className="min-h-[200px] w-full sm:max-w-lg"
            />

            <div className="flex w-full flex-col justify-end gap-4 sm:w-auto">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                  <span className="text-sm font-medium lg:flex-shrink-0">
                    {t("visual-recipe.input.style")}
                  </span>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="handdrawn">
                        {t("visual-recipe.select.handdrawn")}
                      </SelectItem>
                      <SelectItem value="digital">
                        {t("visual-recipe.select.digital")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                  <span className="text-sm font-medium lg:flex-shrink-0">
                    {t("common.model")}
                  </span>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  onClick={handleGenerateImage}
                  className="w-full rounded-md bg-purple-500 px-4 py-2 text-white hover:bg-purple-600 sm:w-auto"
                >
                  {t("global.generate_image")}
                </Button>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
