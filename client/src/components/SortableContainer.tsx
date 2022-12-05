import React, { useEffect, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import SortableChip from "./SortableChip";
import { Stack } from "@mui/material";

export default function SortableContainer(props: {
  items: string[];
  ids?: string[];
  onChange(items: string[]): void;
  color?: string;
}) {
  const [items, setItems] = useState(props.items);
  const [ids, setIDs] = useState(props.ids);

  useEffect(() => {
    props.onChange(ids || items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, ids, props.items]);

  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      spacing={1}
    >
      <DndContext onDragEnd={handleDragEnd}>
        <SortableContext items={items}>
          {items.map((text, index) => (
            <SortableChip key={text + index} text={text} color={props.color} />
          ))}
        </SortableContext>
      </DndContext>
    </Stack>
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (!over && active.id === over.id) return;

    const oldIndex = items.indexOf(active.id);
    const newIndex = items.indexOf(over.id);

    if (ids) setIDs(arrayMove(ids, oldIndex, newIndex));
    setItems(arrayMove(items, oldIndex, newIndex));
  }
}
