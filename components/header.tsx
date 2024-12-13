import { signInWithOAuthAction, signOutAction } from '@/app/actions';
import { createClient } from '@/utils/supabase/server';
import { SubmitButton } from './submit-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { getProfile } from '@/utils/getProfile';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Link from 'next/link';
import { SelectProfile } from '@/db/schema';

export const Header = async () => {
  return (
    <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
      <div className="flex w-full max-w-5xl items-center justify-between p-3 px-5 text-sm">
        <div className="flex items-center gap-5 font-semibold">
          <Link href="/" className="text-xl">
            Tuple
          </Link>
        </div>
        <HeaderAuth />
      </div>
    </nav>
  );
};

const HeaderAuth = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return (
      <div className="flex gap-2">
        <form>
          <input type="hidden" name="username" value="test_username" />
          <input type="hidden" name="provider" value="google" />
          <SubmitButton formAction={signInWithOAuthAction} pendingText="Signing in...">
            Sign in with Google
          </SubmitButton>
        </form>
      </div>
    );
  const profile = await getProfile(user.id);

  if (!profile) {
    return (
      <Link
        href="/onboard"
        className="rounded-3xl border bg-white px-8 py-2 font-medium text-zinc-700 shadow-none transition-all disabled:cursor-not-allowed disabled:opacity-50"
      >
        Create Profile
      </Link>
    );
  }

  return <UserDropdown profile={profile} />;
};

const UserDropdown = async ({ profile }: { profile: SelectProfile }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer border">
          <AvatarImage src={profile.imageUrl ?? undefined} />
          <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-10 mr-2 w-48 rounded-xl bg-white p-2">
        <DropdownMenuItem asChild>
          <Link href={`/${profile.username}`} className="block cursor-pointer px-4 py-2">
            <div className="mb-0.5 text-[16px] font-semibold">{profile.name}</div>
            {/* <div className="text-[12px] text-zinc-500">{profile.headline}</div> */}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer py-2 text-[14px] transition-all hover:bg-slate-50">
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer text-[14px] transition-all hover:bg-slate-50">
          <form action={signOutAction}>
            <button type="submit" className="text-rose-600">
              Logout
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
