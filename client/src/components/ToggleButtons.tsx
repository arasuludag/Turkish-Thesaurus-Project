import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function ToggleButtons(props: {
  options: { name: string; id?: string }[];
  onChange(option: string | null): void;
}) {
  const [option, setOption] = React.useState<string | null>(null);

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newOption: string | null
  ) => {
    setOption(newOption);
    props.onChange(newOption);
  };

  const displayOptions = () => {
    return props.options.map((option, index) => {
      return (
        <ToggleButton
          value={option.id || option.name}
          key={option.name + index}
        >
          {option.name}
        </ToggleButton>
      );
    });
  };

  return (
    <ToggleButtonGroup value={option} exclusive onChange={handleChange}>
      {displayOptions()}
    </ToggleButtonGroup>
  );
}
