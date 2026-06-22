// Génération de slugs URL — sans accents, minuscules, tirets.
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // retire les diacritiques combinants
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}

/** Slug unique vis-à-vis d'une liste de slugs existants (suffixe -2, -3, …). */
export function uniqueSlug(base: string, existing: string[]): string {
  const slug = slugify(base) || "element";
  if (!existing.includes(slug)) return slug;
  let n = 2;
  while (existing.includes(`${slug}-${n}`)) n++;
  return `${slug}-${n}`;
}
