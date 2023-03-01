import { useMemo, useState } from 'react';
import './App.css';
import { BiscuitMachine } from './components/BiscuitMachine';
import { Header } from './components/Header';
import { Alert, Box, Container, Fade, TextField } from '@mui/material';
import { isEmpty } from 'ramda';

function App() {
  const [brand, setBrand] = useState('');
  const isBrandEmpty = useMemo(() => isEmpty(brand), [brand]);

  return (
    <div className="App">
      <Header title="The Cookie Factory"></Header>
      <Container maxWidth="md">
        <TextField label="Brand" variant="outlined" onChange={(el) => setBrand(el.target.value)}/>
        <Fade in={isBrandEmpty} timeout={1000}>
          <Box padding={3}>
            <Alert severity="info">Please enter a brand name to continue!</Alert>
          </Box>
        </Fade>
        <BiscuitMachine brand={brand} canStart={!isBrandEmpty}/>
      </Container>
    </div>
  );
}

export default App;
