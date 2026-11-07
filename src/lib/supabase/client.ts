import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Checks whether the Supabase environment variables have been provided
 * with real values rather than default placeholder text.
 */
export function isSupabaseConfigured(): boolean {
  if (!supabaseUrl || !supabaseKey) return false;
  if (
    supabaseUrl.includes("your-project-id") ||
    supabaseKey.includes("your-supabase-publishable") ||
    supabaseKey.includes("placeholder")
  ) {
    return false;
  }
  return true;
}

// Fallback dummy credentials to allow safe client creation during SSG/build
const safeUrl = isSupabaseConfigured()
  ? supabaseUrl!
  : "https://placeholder-project.supabase.co";
const safeKey = isSupabaseConfigured()
  ? supabaseKey!
  : "placeholder-anon-key";

/**
 * Creates a browser Supabase client using @supabase/ssr.
 */
export function createClient() {
  return createBrowserClient<Database>(safeUrl, safeKey);
}

/**
 * Singleton instance for simple browser-side queries.
 */
export const supabase = createBrowserClient<Database>(safeUrl, safeKey);
