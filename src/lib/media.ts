export function siteImage(src?: string | null): string | undefined {
  const value = src?.trim();
  if (!value) return undefined;
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(value)) return value;
  return value.startsWith("/") ? value : `/${value.replace(/^\.?\//, "")}`;
}

export function absoluteUrl(src: string, site: string): string {
  return new URL(src, site).href;
}
