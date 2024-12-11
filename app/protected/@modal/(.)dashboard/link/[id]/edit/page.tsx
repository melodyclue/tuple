import { eq } from 'drizzle-orm';
import { EditLinkModal } from './editLinkModal';
import { db } from '@/db';
import { link } from '@/db/schema';
import { notFound } from 'next/navigation';

const getLinkById = async (id: string) => {
  const data = await db.query.link.findFirst({
    where: eq(link.id, id),
  });
  return data;
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const link = await getLinkById(id);

  if (!link) notFound();

  return <EditLinkModal link={link} />;
}
