'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { useState, useId, useEffect, useActionState, useOptimistic, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { CSS } from '@dnd-kit/utilities';
import { faEnvelope, faLink, type IconDefinition } from '@fortawesome/free-solid-svg-icons';
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faTiktok,
  faXTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import type { SelectLink } from '@/db/schema';
import type { LinkType } from '@/db/enum';
import { useSelectLinkModal } from './link-modal';
import { updateLinkPosition } from '@/actions/profile.action';

export const LinkDnD = ({ links }: { links: SelectLink[] }) => {
  const id = useId();
  const { SelectLinkModal, setShowSelectLinkModal } = useSelectLinkModal();
  const [, startTransition] = useTransition();
  const [result, updatePosition] = useActionState(updateLinkPosition, {
    result: {},
    links,
  });

  const [displayItems, updateOptimistic] = useOptimistic(
    result.links,
    (state, optimisticValue: SelectLink[]) => optimisticValue,
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      startTransition(() => {
        const oldIndex = displayItems.findIndex((item) => item.id === active.id);
        const newIndex = displayItems.findIndex((item) => item.id === over?.id);
        const newItems = arrayMove(displayItems, oldIndex, newIndex);

        updateOptimistic(newItems);
        console.log('newItems', newItems);

        const formData = new FormData();
        newItems.forEach((item, index) => {
          formData.append(`ids[${index}]`, item.id);
        });
        updatePosition(formData);
      });
    }
  }
  // console.log(displayItems);
  return (
    <div>
      <SelectLinkModal />
      <DndContext
        id={id}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        // modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={displayItems}>
          <div className="flex flex-col flex-wrap gap-3">
            {displayItems.map((item) => (
              <SortableItem key={item.id} {...item} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowSelectLinkModal(true)}
          className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-slate-800 transition-all hover:bg-slate-50"
        >
          <i className="i-mdi-plus" />
          Add Link
        </button>
      </div>
    </div>
  );
};

function SortableItem({ id, type, url, title }: SelectLink) {
  const { isDragging, setActivatorNodeRef, attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
  });

  const icon = LinkIconMap[type];
  return (
    <>
      <div
        ref={setNodeRef}
        className={cn(
          'relative flex items-center gap-4 transition-opacity duration-100',
          isDragging ? 'z-10 opacity-60' : 'z-0',
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
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="flex flex-1 items-center gap-4 rounded-md bg-orange-100 px-4 py-2 text-slate-900"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white p-1">
            <FontAwesomeIcon icon={icon} className="h-5 w-5 text-slate-700" />
          </div>
          {title}
        </a>
      </div>
    </>
  );
}

type LinkIconMapProps = {
  [key in LinkType]: IconDefinition;
};

const LinkIconMap: LinkIconMapProps = {
  website: faLink,
  email: faEnvelope,
  x: faXTwitter,
  instagram: faInstagram,
  facebook: faFacebook,
  youtube: faYoutube,
  linkedin: faLinkedin,
  tiktok: faTiktok,
};
