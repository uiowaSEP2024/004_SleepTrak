import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Typography from '@mui/joy/Typography';
import { getAge } from '../util/utils';
import { useNavigate } from 'react-router-dom';

export default function BabyDropdown(props) {
  const babyNames = props.babies;
  const navigate = useNavigate();

  const handleSelectChange = (_, child) => {
    const babyId = babyNames.filter((baby) => baby.name === child)[0].babyId;
    navigate(`/babies/${babyId}`);
  };

  return (
    <Select
      defaultValue={babyNames[0].name}
      onChange={handleSelectChange}
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
      {babyNames.map((data, index) => (
        <Option
          key={data.name}
          value={data.name}
          label={data.name}>
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
            {getAge(data.dob)}
          </Chip>
        </Option>
      ))}
    </Select>
  );
}
