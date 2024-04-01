import Avatar from '@mui/joy/Avatar';
import Button from '@mui/joy/Button';
import ButtonGroup from '@mui/joy/ButtonGroup';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import CardActions from '@mui/joy/CardActions';
import Typography from '@mui/joy/Typography';
import { Link } from 'react-router-dom';
import ClientAdminOptions from './ClientAdminOptions';

interface ClientCardProps {
  avatarSrc: string;
  clientName: string;
  babyNames: string;
  babyId: string;
  clientId: string;
  adminOptions?: boolean;
}

const ClientCard: React.FC<ClientCardProps> = ({
  avatarSrc,
  clientName,
  babyNames,
  babyId,
  clientId,
  adminOptions = false
}) => {
  return (
    <Card
      sx={{
        width: 250,
        maxWidth: '100%',
        boxShadow: 'lg'
      }}>
      <CardContent sx={{ alignItems: 'center', textAlign: 'center' }}>
        <Avatar
          data-testid="avatar"
          src={avatarSrc}
          sx={{ '--Avatar-size': '4rem' }}
        />
        <Typography level="title-lg">{clientName}</Typography>
        <Typography
          level="body-sm"
          sx={{ maxWidth: '24ch' }}>
          {babyNames}
        </Typography>
      </CardContent>
      <CardOverflow sx={{ bgcolor: 'background.level1' }}>
        <CardActions buttonFlex="1">
          <ButtonGroup
            variant="outlined"
            sx={{ bgcolor: 'background.surface' }}>
            <Button>Message</Button>
            <Button
              component={Link}
              to={`/clients/${clientId}/babies/${babyId}`}>
              More
            </Button>
          </ButtonGroup>
        </CardActions>
        {adminOptions ? <ClientAdminOptions userId={clientId} /> : null}
      </CardOverflow>
    </Card>
  );
};

export default ClientCard;
