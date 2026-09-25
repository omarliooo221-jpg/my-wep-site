const SUPABASE_URL = "https://kvqpxkmufbafpfphzqos.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_RqNGSYBJ1J3b4A_Gf-o07g_kEi-XMz8";

window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

console.log("SUPABASE JS LOADED");