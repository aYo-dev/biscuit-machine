import { useMemo, useState } from 'react';
import './App.css';
import { BiscuiteMachine } from './components/BiscuiteMachine';
import { Alert, Container, Fade, TextField, Typography } from '@mui/material';
import { isEmpty } from 'ramda';

function App() {
  const [brand, setBrand] = useState('');
  const showAlert = useMemo(() => isEmpty(brand), [brand]);

  return (
    <div className="App">
      <Container maxWidth="md">
        <Typography variant="h2" component="h1">Cookie factory</Typography>
        <TextField label="Brand" variant="outlined" onChange={(el) => setBrand(el.target.value)}/>
        {/* {isEmpty(brand) && 
          <Fade in={showAlert} timeout={1000}>
            <Alert severity="info">Please enter a brand name to continue!</Alert>
          </Fade>} */}
        <BiscuiteMachine brand={brand} />
      </Container>
    </div>
  );
}

export default App;
