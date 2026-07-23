"use client";

import { createBrowserClient } from "@supabase/ssr";

/** Tarayıcı tarafı Supabase istemcisi (auth formları için). */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
