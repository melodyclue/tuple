import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { link } from '@/db/schema';
import { DeleteLinkModal } from '@/app/[username]/@modal/(.)link/[id]/delete/deleteLinkModal';
import { authGuard } from '@/utils/auth-guard';

const getLinkById = async (id: string, userId: string) => {
  const data = await db.query.link.findFirst({
    where: and(eq(link.id, id), eq(link.userId, userId)),
  });
  return data;
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await authGuard();
  const link = await getLinkById(id, user.id);

  return <DeleteLinkModal link={link} />;
}
