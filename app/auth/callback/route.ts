import { db } from '@/db';
import { profile } from '@/db/schema';
import { createClient } from '@/utils/supabase/server';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

const getProfile = async (userId: string) => {
  const data = await db.query.profile.findFirst({
    where: eq(profile.id, userId),
    columns: {
      username: true,
    },
  });
  return data;
};

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get('redirect_to')?.toString();

  const supabase = await createClient();
  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return NextResponse.redirect(`${origin}/?error`);
  }

  if (user) {
    const profile = await getProfile(user.id);
    if (!profile) {
      // redirect to complete onboarding
      return NextResponse.redirect(`${origin}/onboard`);
    }

    // redirect to profile
    return NextResponse.redirect(`${origin}/${profile.username}`);
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/`);
}
