const MAP = { à:"a",â:"a",ä:"a",é:"e",è:"e",ê:"e",ë:"e",î:"i",ï:"i",ô:"o",ö:"o",ù:"u",û:"u",ü:"u",ç:"c",ñ:"n" };

export const slugify = (str = "") =>
  str.toLowerCase()
     .replace(/[àâäéèêëîïôöùûüçñ]/g, (c) => MAP[c] || c)
     .replace(/[^a-z0-9]+/g, "-")
     .replace(/^-|-$/g, "");

export const toProductUrl = (id, name) => `/produit/${id}-${slugify(name)}`;

export const idFromSlug  = (slug = "") => parseInt(slug, 10) || null;
