export const generateSlug = (str) => {
  // Remove acentos e caracteres especiais
  const normalizedStr = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Substitui espaços e caracteres especiais por hífens
  const slug = normalizedStr
    .toLowerCase() // Converte para minúsculas
    .replace(/[^a-z0-9\s-]/g, "") // Remove caracteres não alfanuméricos
    .trim() // Remove espaços no início e no final
    .replace(/\s+/g, "-") // Substitui múltiplos espaços por hífens
    .replace(/-+/g, "-"); // Substitui múltiplos hífens por um único hífen

  return slug;
};
