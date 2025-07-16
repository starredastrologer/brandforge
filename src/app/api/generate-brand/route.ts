import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { generateBrandContent } from "@/lib/gpt";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, brand_profile_id, profession, values, audience, tone, goals, extra } = body;

    // Get the user's JWT from the Authorization header
    const authHeader = req.headers.get('authorization');
    const jwt = authHeader?.replace('Bearer ', '');
    // Initialize Supabase client with the user's JWT
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${jwt}` } }
    });

    // 1. Generate brand content using OpenAI (placeholder)
    const aiResult = await generateBrandContent({ profession, values, audience, tone, goals, extra });

    // 2. Save to Supabase brand_outputs as the user
    const { data, error } = await supabase.from("brand_outputs").insert({
      user_id,
      brand_profile_id,
      ...aiResult,
      created_at: new Date().toISOString(),
    }).select().single();
    if (error) throw error;

    // 3. Return the generated content
    return NextResponse.json({ success: true, output: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Unknown error" }, { status: 500 });
  }
} 