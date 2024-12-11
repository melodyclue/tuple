import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { link } from '@/db/schema';
import { DeleteLinkModal } from '@/app/protected/@modal/(.)dashboard/link/[id]/delete/deleteLinkModal';
import { ClientRedirect } from '@/app/protected/@modal/(.)dashboard/link/[id]/delete/client-redirect';

const getLinkById = async (id: string) => {
  const data = await db.query.link.findFirst({
    where: eq(link.id, id),
  });
  return data;
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const link = await getLinkById(id);

  if (!link) return <ClientRedirect />;

  return <DeleteLinkModal link={link} />;
}
