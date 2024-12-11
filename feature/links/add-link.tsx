'use client';

import Link from 'next/link';

export const AddLinkButton = () => {
  return (
    <Link
      scroll={false}
      href={'/protected/dashboard/link/add'}
      className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1"
    >
      <i className="i-mdi-plus" />
      Add Link
    </Link>
  );
};
