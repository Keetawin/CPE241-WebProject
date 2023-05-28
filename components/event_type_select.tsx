import { MenuItem, OutlinedInput, Select } from "@mui/material";

export default function EventTypeSelect({onChange, value, required, eventType, sx }: Props) {
  // console.log(categories)

  return (
    <Select
      required={required}
      sx={sx}
      value={value}
      onChange={onChange}
      input={<OutlinedInput label="Tag" />}
    >
      <MenuItem
        key={0}
        value={0}
      >
        Any Type
      </MenuItem>
      {eventType && eventType.map((type)=>{
            return (
            <MenuItem
              key={type.event_type_id}
              value={type.event_type_id}
            >
              {type.event_type}
            </MenuItem>
            )
        }
      )}
    </Select>
  );
}

