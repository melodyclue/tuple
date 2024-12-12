import { authGuard } from '@/utils/auth-guard';
import { UpdateProfile } from './update-profile';
import { redirect } from 'next/navigation';
import { getProfile } from '@/utils/getProfile';

export default async function SettingsPage() {
  const user = await authGuard();

  const profile = await getProfile(user.id);
  if (!profile) redirect('/onboard');

  return <UpdateProfile username={profile.username} name={profile.name} />;
}
