import ClientCard from '../components/ClientCard';
import Grid from '@mui/joy/Grid';
import Item from '@mui/joy/Grid';

function ClientsPage() {
  return (
    <>
      <h1>Clients</h1>
      <Grid
        container
        spacing={3}
        sx={{ flexGrow: 1 }}>
        <Grid xs="auto">
          <Item>
            <ClientCard
              avatarSrc="/static/images/avatar/1.jpg"
              title="Client 1"
              body="Baby 1 (1y 2m), Baby2 (0y 2m)"
            />
          </Item>
        </Grid>
      </Grid>
    </>
  );
}

export default ClientsPage;
