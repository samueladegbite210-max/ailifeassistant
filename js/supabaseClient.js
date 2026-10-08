// =====================================================
// SUPABASE CLIENT
// AI LIFE ASSISTANT
// =====================================================

const SUPABASE_URL =
    "https://phfgudpmxkghhasfeqpf.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_C4oH1a3POvttaqv1_TvWbA_euKYaPfs";

window.supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

console.log("✅ Supabase client initialized");
