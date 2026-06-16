import type { BootstrapPayload } from "@topgrade/shared";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

export const fetchBootstrap = async (
  signal?: AbortSignal
): Promise<BootstrapPayload> => {
  const response = await fetch(`${API_BASE_URL}/bootstrap`, {
    signal
  });

  if (!response.ok) {
    throw new Error(`Failed to load CRM bootstrap data (${response.status})`);
  }

  return response.json() as Promise<BootstrapPayload>;
};

