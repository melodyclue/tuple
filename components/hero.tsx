import { GoogleSignIn } from '@/app/google-signin';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Button } from './ui/button';

export default async function Hero() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col items-center gap-3">
      <h1 className="text-3xl font-bold">Put your Profile</h1>
      <p className="mx-auto max-w-xl text-zinc-600">The fastest way to build your profile</p>
      {/* <div className="my-8 w-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent p-[1px]" /> */}
      <div className="mt-4 flex flex-col gap-2">
        {user ? (
          <Link href="/settings">
            <Button className="rounded-3xl border bg-white px-8 py-2 font-medium text-zinc-600 shadow-none">
              Settings
            </Button>
          </Link>
        ) : (
          <GoogleSignIn />
        )}
      </div>
    </div>
  );
}
