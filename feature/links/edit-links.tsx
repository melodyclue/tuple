'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useId, useActionState, useOptimistic, useTransition, useEffect, useState } from 'react';
import type { SelectLink } from '@/db/schema';
import { updateLinkPosition } from '@/actions/profile.action';
import { SortableItem } from './link-item';
import { useFormStatus } from 'react-dom';

export const LinkDnD = ({ links }: { links: SelectLink[] }) => {
  const id = useId();
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

        const formData = new FormData();
        newItems.forEach((item, index) => {
          formData.append(`ids[${index}]`, item.id);
        });
        updatePosition(formData);
      });
    }
  }

  return (
    <DndContext id={id} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={displayItems}>
        <div className="flex flex-col flex-wrap gap-3">
          {displayItems.map((item) => (
            <SortableItem key={item.id} link={item} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
