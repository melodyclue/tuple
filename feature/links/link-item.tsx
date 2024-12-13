'use client';

import type { SelectLink } from '@/db/schema';
import { LinkIconMap } from '.';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { useSortable } from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';
import { CSS } from '@dnd-kit/utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export function SortableItem({ link }: { link: SelectLink }) {
  const { username } = useParams();
  const { isDragging, setActivatorNodeRef, attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: link.id,
  });
  const icon = LinkIconMap[link.type] ?? faLink;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'group relative flex cursor-pointer items-center gap-2 transition-opacity duration-100',
        isDragging ? 'z-10 opacity-60' : '',
      )}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <i
        ref={setActivatorNodeRef}
        className="i-mdi-drag"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        {...attributes}
        {...listeners}
      />
      <Link
        scroll={false}
        href={`/${username}/link/${link.id}/edit`}
        className="flex flex-1 items-center gap-4 rounded-md bg-orange-100 px-4 py-2"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white p-1">
          <FontAwesomeIcon icon={icon} className="h-5 w-5 text-zinc-700" />
        </div>
        {link.title}
      </Link>
      <Link
        scroll={false}
        href={`/${username}/link/${link.id}/delete`}
        className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border bg-white opacity-0 shadow transition-opacity duration-200 group-hover:opacity-100"
      >
        <i className="i-mdi-trash-outline" />
      </Link>
    </div>
  );
}
