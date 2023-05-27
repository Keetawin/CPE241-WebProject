import { Box, Chip, MenuItem, OutlinedInput, Select } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import axios from "axios";

export default function CategorieSelect({onChange, value, required, categories, onDelete }: Props) {
  // console.log(categories)

  return (
    <Select
      required={required}
      sx={{width: "45ch"}}
      value={value}
      onChange={onChange}
      multiple
      input={<OutlinedInput label="Tag" />}
      renderValue={(selected) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {selected.map((value: number) => (
            <Chip 
            id={value}
            key={value} 
            label={categories.filter((obj: { categories_id: number; }) => obj.categories_id == value)[0].categories_name} 
            clickable
            deleteIcon={
              <ClearIcon
                onMouseDown={(event) => event.stopPropagation()}
              />
            }
            onDelete={()=>{onDelete(value)}}
            />

          )
          )}
        </Box>
      )
    }
    >
      {categories && categories.map((category)=>{
            return (
            <MenuItem
              key={category.categories_id}
              value={category.categories_id}
              // style={getStyles(name, personName, theme)}
            >
              {category.categories_name}
            </MenuItem>
            )
        }
      )}
    </Select>
  );
}

