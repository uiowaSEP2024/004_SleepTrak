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
              title="Mingi Lee"
              body="Mingi Information"
            />
          </Item>
        </Grid>
      </Grid>
    </>
  );
}

export default ClientsPage;
