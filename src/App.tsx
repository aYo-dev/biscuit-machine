import { useMemo, useState } from 'react';
import './App.css';
import { BiscuitMachine } from './components/BiscuitMachine';
import { Alert, Box, Container, Fade, TextField, Typography } from '@mui/material';
import { isEmpty } from 'ramda';

function App() {
  const [brand, setBrand] = useState('');
  const showAlert = useMemo(() => isEmpty(brand), [brand]);

  return (
    <div className="App">
      <Container maxWidth="md">
        <Typography variant="h2" component="h1">Cookie factory</Typography>
        <TextField label="Brand" variant="outlined" onChange={(el) => setBrand(el.target.value)}/>
        <Fade in={showAlert} timeout={1000}>
          <Box padding={3}>
            <Alert severity="info">Please enter a brand name to continue!</Alert>
          </Box>
        </Fade>
        <BiscuitMachine brand={brand} />
      </Container>
    </div>
  );
}

export default App;
