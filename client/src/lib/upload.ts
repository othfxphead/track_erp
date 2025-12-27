/**
 * Helper para upload de arquivos para o servidor
 */

export async function uploadFile(file: File, folder: string = "uploads"): Promise<{ url: string; key: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Erro ao fazer upload do arquivo");
  }

  return await response.json();
}

export function validateImageFile(file: File, maxSizeMB: number = 2): { valid: boolean; error?: string } {
  // Validar tipo
  const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: "Formato inválido. Use PNG, JPG ou SVG." };
  }

  // Validar tamanho
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { valid: false, error: `Arquivo muito grande. Máximo ${maxSizeMB}MB.` };
  }

  return { valid: true };
}
