import { createClient } from "@supabase/supabase-js";

const url: string = process.env.NEXT_PUBLIC_SUPABASE_DB_URL!
const apikey: string = process.env.NEXT_PUBLIC_SUPABASE_DB_PUBLIC_KEY!

export const supabase = createClient(
    url,
    apikey
);