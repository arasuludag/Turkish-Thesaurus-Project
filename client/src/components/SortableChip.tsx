import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Chip } from "@mui/material";

export default function SortableItem(props: { text: string; color?: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.text });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
  };

  return (
    <Chip
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      label={props.text}
      sx={{ backgroundColor: props.color }}
    />
  );
}
