"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APP_LANG_OPTION } from "@/constants";
import { cn } from "@/lib/utils";
import { LanguagesIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";

type ShareLanguageSwitcherProps = {
  className?: string;
};

export function ShareLanguageSwitcher({ className }: ShareLanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const params = useParams();
  const shareId = params.id as string;

  const handleChangeLocale = (newLocale: string) => {
    // Mark that user has manually selected a language
    sessionStorage.setItem("share_lang_preference", "manual");
    // Navigate to the new locale path
    router.replace(`/${newLocale}/share/${shareId}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild={true}>
        <Button
          aria-label="Switch language"
          variant="outline"
          size="sm"
          className={cn("gap-2", className)}
        >
          <LanguagesIcon className="size-4" />
          <span className="hidden sm:inline">
            {APP_LANG_OPTION.find(l => l.value === locale)?.label || locale}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent aria-describedby={undefined}>
        <DropdownMenuRadioGroup
          value={locale as string}
          onValueChange={handleChangeLocale}
        >
          {APP_LANG_OPTION.map((language) => (
            <DropdownMenuRadioItem key={language.id} value={language.value}>
              {language.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
