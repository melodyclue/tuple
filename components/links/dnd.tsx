"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { useState, useEffect, useId } from "react";
import { cn } from "@/lib/utils";
import { CSS } from "@dnd-kit/utilities";
import {
  faGripLines,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
type LinkType = "link" | "email" | "radio";

export const LinkDnD = ({
  links,
}: {
  links: {
    id: string;
    type: LinkType;
    url: string;
    icon: IconDefinition;
    label: string;
  }[];
}) => {
  const id = useId();
  const [items, setItems] = useState(links);

  useEffect(() => {
    setItems(links);
  }, [links]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        return newItems;
      });
    }
  }

  const handleUpdatePosition = () => {
    const formData = new FormData();
    formData.append("action", "update-position");
    // biome-ignore lint/complexity/noForEach: <explanation>
    items.forEach((item, index) => {
      formData.append(`ids[${index}]`, item.id);
    });
  };

  return (
    <div>
      <DndContext
        id={id}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        // modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={items}>
          <div className="flex flex-col flex-wrap gap-3">
            {items.map((item) => (
              <SortableItem key={item.id} {...item} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export function SortableItem({
  id,
  type,
  url,
  label,
  icon,
}: {
  id: string;
  type: LinkType;
  url: string;
  icon: IconDefinition;
  label: string;
}) {
  const {
    isDragging,
    setActivatorNodeRef,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
  });

  return (
    <>
      <div
        ref={setNodeRef}
        className={cn("relative flex items-center gap-4 transition-opacity duration-100",
          isDragging ? "z-10 opacity-60" : "z-0",
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
            cursor: isDragging ? "grabbing" : "grab",
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
          {label}
        </a>

      </div>
    </>
  );
}
