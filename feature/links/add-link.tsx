'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export const AddLinkButton = () => {
  const { username } = useParams();
  return (
    <Link
      scroll={false}
      href={`/${username}/link/add`}
      className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1"
    >
      <i className="i-mdi-plus" />
      Add Link
    </Link>
  );
};
