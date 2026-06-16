import { createClient } from "@supabase/supabase-js";

import { config } from "../config";

let supabaseClient: ReturnType<typeof createClient> | null = null;

export const isSupabaseConfigured = () =>
  Boolean(config.supabaseUrl && config.supabaseServiceRoleKey);

export const getSupabaseClient = () => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(
      config.supabaseUrl as string,
      config.supabaseServiceRoleKey as string,
      {
        auth: {
          persistSession: false
        }
      }
    );
  }

  return supabaseClient;
};

