import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  // Get the Supabase session from the cookie
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  // Fetch LinkedIn data for this user
  const { data, error } = await supabase
    .from('user_linkedin_data')
    .select('*')
    .eq('user_id', user.id)
    .single();
  if (error || !data) {
    return NextResponse.json({ error: 'No LinkedIn data found' }, { status: 404 });
  }
  return NextResponse.json({ linkedin: data });
} 