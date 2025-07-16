import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
const LINKEDIN_PROFILE_URL = 'https://api.linkedin.com/v2/me';
const LINKEDIN_EMAIL_URL = 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))';
const LINKEDIN_POSTS_URL = 'https://api.linkedin.com/v2/ugcPosts?q=authors&sortBy=LAST_MODIFIED&count=10&authors=List(';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getUserIdFromAuthHeader(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  // You should verify and decode the JWT here to extract the user_id
  // For demo, assume the token is the user_id (replace with real JWT logic)
  return token || null;
}

async function fetchLinkedInToken(code: string, redirectUri: string) {
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', redirectUri);
  params.append('client_id', process.env.LINKEDIN_CLIENT_ID!);
  params.append('client_secret', process.env.LINKEDIN_CLIENT_SECRET!);

  const res = await fetch(LINKEDIN_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  if (!res.ok) throw new Error('Failed to fetch LinkedIn access token');
  return res.json();
}

async function fetchLinkedInProfile(token: string) {
  const res = await fetch(LINKEDIN_PROFILE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch LinkedIn profile');
  return res.json();
}

async function fetchLinkedInEmail(token: string) {
  const res = await fetch(LINKEDIN_EMAIL_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch LinkedIn email');
  return res.json();
}

async function fetchLinkedInPosts(token: string, personUrn: string) {
  const url = `${LINKEDIN_POSTS_URL}${encodeURIComponent(personUrn)})`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch LinkedIn posts');
  return res.json();
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI!;

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  // 0. Get user_id from Authorization header (Bearer token)
  const user_id = getUserIdFromAuthHeader(req);
  if (!user_id) {
    return NextResponse.json({ error: 'Missing or invalid user authentication' }, { status: 401 });
  }

  try {
    // 1. Exchange code for access token
    const tokenData = await fetchLinkedInToken(code, redirectUri);
    const accessToken = tokenData.access_token;

    // 2. Fetch profile
    const profile = await fetchLinkedInProfile(accessToken);
    const personUrn = profile.id ? `urn:li:person:${profile.id}` : '';

    // 3. Fetch email
    const emailData = await fetchLinkedInEmail(accessToken);
    const email = emailData.elements?.[0]?.['handle~']?.emailAddress || '';

    // 4. Fetch posts
    let posts = null;
    if (personUrn) {
      posts = await fetchLinkedInPosts(accessToken, personUrn);
    }

    // 5. Upsert into Supabase
    const { error: dbError } = await supabase.from('user_data').upsert({
      user_id,
      provider: 'linkedin',
      profile,
      email,
      posts,
    });
    if (dbError) throw new Error(dbError.message);

    // 6. Return all data
    return NextResponse.json({ success: true, profile, email, posts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 