"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import React, { useState } from "react";
import { examples } from "./examples";
import { generateEnglishCard } from "@/services/gen-english-card";
import { appConfigAtom } from "@/stores/slices/config_store";
import { generationStoreAtom } from "@/stores/slices/generation_store";
import { store } from "@/stores";
import { useHistory } from "@/hooks/db/use-gen-history";
import { toast } from "sonner";
import { useAtom } from "jotai";
import RecipeForm from "./recipe-form";

const VisualRecipePage = () => {
  return (
    <div className="mx-auto w-full justify-center space-y-4 px-4 pt-4 sm:px-8 sm:pt-8">
      <RecipeForm />
    </div>
  );
};

export default VisualRecipePage;
