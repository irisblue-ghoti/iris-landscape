import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { GLOBAL } from "./constants";
import { routing } from "./i18n/routing";
import { normalizeLanguageCode } from "./utils/language";

const handleI18nRouting = createMiddleware(routing);

// Handle URL lang parameter redirection
function handleLangParam(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const langParam = searchParams.get("lang");

  if (!langParam) {
    return null;
  }

  const normalizedLang = normalizeLanguageCode(langParam);
  if (!GLOBAL.LOCALE.SUPPORTED.includes(normalizedLang)) {
    return null;
  }

  const newUrl = new URL(request.url);
  searchParams.delete("lang");

  let newPathname = pathname;
  if (pathname === "/") {
    newPathname = `/${normalizedLang}`;
  } else if (!pathname.startsWith(`/${normalizedLang}`)) {
    const localeRegex = new RegExp(`^/(${GLOBAL.LOCALE.SUPPORTED.join("|")})`);
    if (localeRegex.test(pathname)) {
      newPathname = pathname.replace(localeRegex, `/${normalizedLang}`);
    } else {
      newPathname = `/${normalizedLang}${pathname}`;
    }
  }

  newUrl.pathname = newPathname;
  newUrl.search = searchParams.toString();
  return NextResponse.redirect(newUrl);
}

// Handle share page without locale prefix
function handleSharePath(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if path starts with /share/ but not with a locale prefix
  if (pathname.startsWith("/share/")) {
    const newUrl = new URL(request.url);
    newUrl.pathname = `/${GLOBAL.LOCALE.DEFAULT}${pathname}`;
    return NextResponse.redirect(newUrl);
  }

  return null;
}

export default function middleware(request: NextRequest) {
  // First handle share path without locale
  const shareRedirect = handleSharePath(request);
  if (shareRedirect) return shareRedirect;

  // Then handle lang parameter if present
  const langRedirect = handleLangParam(request);
  if (langRedirect) return langRedirect;

  // Then handle regular i18n routing
  const shouldHandle =
    request.nextUrl.pathname === "/" ||
    new RegExp(`^/(${GLOBAL.LOCALE.SUPPORTED.join("|")})(/.*)?$`).test(
      request.nextUrl.pathname
    );

  if (!shouldHandle) return;

  return handleI18nRouting(request);
}
