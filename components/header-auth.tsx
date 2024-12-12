import { signInWithOAuthAction, signOutAction } from '@/app/actions';
import { hasEnvVars } from '@/utils/supabase/check-env-vars';
import { Badge } from './ui/badge';
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
import { redirect } from 'next/navigation';

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!hasEnvVars) {
    return (
      <>
        <div className="flex items-center gap-4">
          <div>
            <Badge variant="default" className="pointer-events-none font-normal">
              Please update .env.local file with anon key and url
            </Badge>
          </div>
        </div>
      </>
    );
  }

  return user ? (
    <UserDropdown userId={user.id} />
  ) : (
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
}

const UserDropdown = async ({ userId }: { userId: string }) => {
  const profile = await getProfile(userId);

  if (!profile) redirect('/onboard');

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
            {/* <div className="text-[12px] text-slate-500">{profile.headline}</div> */}
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
