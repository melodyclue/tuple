import type { SelectLink, SelectProfile } from '@/db/schema';
import { ProfileImageUploader } from '@/feature/upload-image';
import { InlineEdit } from '@/feature/edit-name';
import { updateProfileName } from '@/actions/profile.action';
import { InlineBioEditor } from '@/feature/edit-bio';
import { updateProfileBio } from '@/actions/profile.action';
import { LinkDnD } from '@/feature/links/edit-links';
import { AddLinkButton } from '@/feature/links/add-link';

export const EditProfile = async ({
  data,
  userId,
}: {
  data: SelectProfile & { links: SelectLink[] };
  userId: string;
}) => {
  const handleSaveName = async (newName: string) => {
    'use server';
    await updateProfileName(userId, newName);
  };

  const handleSaveBio = async (newBio: string) => {
    'use server';
    await updateProfileBio(userId, newBio);
  };

  return (
    <div className="motion-safe:animate-fadeInSlow p-8">
      <div className="mx-auto w-full max-w-screen-md">
        <div className="space-y-4">
          <ProfileImageUploader imageUrl={data.imageUrl} slug={data.username} />
          <InlineEdit value={data.name} onSave={handleSaveName} />
          <InlineBioEditor initialValue={data.bio ?? ''} onSave={handleSaveBio} />
        </div>
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
};
