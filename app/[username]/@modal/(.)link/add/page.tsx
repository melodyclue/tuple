import { authGuard } from '@/utils/auth-guard';
import { AddLinkModal } from './addLinkModal';

export default async function Page() {
  await authGuard();

  return <AddLinkModal />;
}
