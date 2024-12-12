import { db } from '@/db';
import { link, profile } from '@/db/schema';
import { ProfileImageUploader } from '@/feature/upload-image';
import { createClient } from '@/utils/supabase/server';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { InlineEdit } from '@/feature/edit-name';
import { updateProfileName } from '@/actions/profile.action';
import { InlineBioEditor } from '@/feature/edit-bio';
import { updateProfileBio } from '@/actions/profile.action';
import { LinkDnD } from '@/feature/links/edit-links';
import { AddLinkButton } from '@/feature/links/add-link';
import { Suspense } from 'react';

const getProfile = async (userId: string) => {
  const data = await db.query.profile.findFirst({
    where: eq(profile.id, userId),
    with: {
      links: {
        where: eq(link.userId, userId),
        orderBy: (links, { asc }) => [asc(links.position)],
      },
    },
  });
  return data;
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  const data = await getProfile(user.id);

  if (!data) {
    return redirect('/protected/onboard');
  }

  const handleSaveName = async (newName: string) => {
    'use server';
    await updateProfileName(user.id, newName);
  };

  const handleSaveBio = async (newBio: string) => {
    'use server';
    await updateProfileBio(user.id, newBio);
  };

  console.log('data', data);
  return (
    <div className="motion-safe:animate-fadeInSlow p-8">
      <div className="mx-auto w-full max-w-screen-md">
        <div className="space-y-4">
          <ProfileImageUploader imageUrl={data.imageUrl} slug={data.username} />
          <InlineEdit value={data.name} onSave={handleSaveName} />
          <InlineBioEditor initialValue={data.bio ?? ''} onSave={handleSaveBio} />
        </div>
        {/* {JSON.stringify(data.links)} */}
        <div className="mt-8 w-full">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-end">
              <AddLinkButton />
            </div>
            <LinkDnD links={data.links} />
          </div>
        </div>
      </div>
    </div>
  );
}
