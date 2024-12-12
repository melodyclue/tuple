import { redirect } from 'next/navigation';
import { createClient } from './supabase/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export const authGuard = async () => {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.log('redirecting to sign-in');
    redirect('/sign-in');
  }

  return user;
};
