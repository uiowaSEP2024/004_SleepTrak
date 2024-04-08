import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Typography from '@mui/joy/Typography';
import { getAgeInMonthFromDob } from '../util/utils';
import { useNavigate } from 'react-router-dom';
import { Baby } from '@prisma/client';

interface BabyDropdownProps {
  babies: Baby[];
}

const BabyDropdown: React.FC<BabyDropdownProps> = (props) => {
  const babyNames: Baby[] = props.babies;
  const navigate = useNavigate();

  const handleSelectChange = (
    _:
      | React.MouseEvent<Element, MouseEvent>
      | React.KeyboardEvent<Element>
      | React.FocusEvent<Element, Element>
      | null,
    child: string | null
  ) => {
    const curBaby = babyNames.filter((baby) => baby.name === child)[0];
    const parentId = curBaby.parentId;
    const babyId = curBaby.babyId;
    navigate(`/clients/${parentId}/babies/${babyId}`);
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
            {getAgeInMonthFromDob(data.dob)}
          </Chip>
        </Option>
      ))}
    </Select>
  );
};

export default BabyDropdown;
