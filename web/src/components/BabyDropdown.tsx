import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Typography from '@mui/joy/Typography';

export default function BabyDropdown() {
  const people = [
    { name: 'Baby1', age: '1M 2Y' },
    { name: 'Baby2', age: '0M 2Y' }
  ] as const;

  return (
    <Select
      defaultValue={people[0].name}
      slotProps={{
        listbox: {
          sx: {
            '--ListItemDecorator-size': '48px'
          }
        }
      }}
      sx={{
        minWidth: 240
      }}>
      {people.map((data, index) => (
        <Option
          key={data.name}
          value={data.name}
          label={data.name} // The appearance of the selected value will be a string
        >
          <ListItemDecorator>
            <Avatar src={`/static/images/avatar/${index + 1}.jpg`} />
          </ListItemDecorator>
          <Box
            component="span"
            sx={{ display: 'block' }}>
            <Typography
              component="span"
              level="title-sm">
              {data.name}
            </Typography>
          </Box>
          <Chip
            size="sm"
            variant="outlined"
            color={'primary'}
            sx={{
              ml: 'auto',
              borderRadius: '2px',
              minHeight: '20px',
              paddingInline: '4px',
              fontSize: 'xs'
            }}>
            {data.age}
          </Chip>
        </Option>
      ))}
    </Select>
  );
}
