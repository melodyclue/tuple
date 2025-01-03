import { redirect } from 'next/navigation';
import { createClient } from './supabase/server';

export const authGuard = async () => {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/');
  }

  return user;
};
