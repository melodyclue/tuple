import { authGuard } from '@/utils/auth-guard';
import { CreateProfile } from './create-profile';
import { getProfile } from '@/utils/getProfile';
import { redirect } from 'next/navigation';

export default async function OnboardPage() {
  const user = await authGuard();

  const profile = await getProfile(user.id);
  if (profile) redirect(`/${profile.username}`);

  return <CreateProfile />;
}
