import { Box, Button, Chip } from "@mui/material";
import { Stack } from "@mui/system";
import { cond, equals, isEmpty } from "ramda";
import { useEffect, useState } from "react";

import { BiscuitStates, MachineStates } from "../enums";
import { useMotor } from "../hooks/use-motor";
import { IBiscuit } from "../interfaces";
import { BiscuitList } from "./BiscuitList";
import ThermostatIcon from '@mui/icons-material/DeviceThermostat';
import { TryCatch, Either } from 'lambda-ts';


const isOn = equals(MachineStates.on);
const isOff = equals(MachineStates.off);
const isPause = equals(MachineStates.off);

interface BiscuitMachineProps{
  brand: string,
}

export const BiscuitMachine = (props: BiscuitMachineProps) => {
  const [machineState, switchMachine] = useState(MachineStates.off);
  const [temperature, setTemperature] = useState(0);
  const [setMotorState, pulse] = useMotor();

  const [biscuitsForConvey, addBiscuitsForConvey] = useState([] as IBiscuit[]);
  const [basket, addToBasket] = useState([] as IBiscuit[]);
  const [raw, addRaw] = useState({} as IBiscuit);
  const [stamped, addStamped] = useState({} as IBiscuit);
  const [inOven, putInOven] = useState({} as IBiscuit);

  const extrude = (id: number) => ({id, stamp: '', state: BiscuitStates.raw});
  const stamp = (biscuite: IBiscuit) => ({...biscuite, stamp: props.brand, state: BiscuitStates.stamped});
  const bake = (biscuite: IBiscuit) => ({...biscuite, state: BiscuitStates.bake});
  const done = (biscuite: IBiscuit) => ({...biscuite, state: BiscuitStates.baked});

  const start = () => {
    switchMachine(MachineStates.on);
    setMotorState(true);
  }

  const stop = () => {
    switchMachine(MachineStates.off);
    setMotorState(false);
  }

  const pause = () => {
    switchMachine(MachineStates.pause)
    setMotorState(false);
  }

  useEffect(() => {
    if(isOn(machineState)) {
      setTemperature(240);
    }

    if(isOff(machineState)) {
      setTemperature(0);
    }
  }, [machineState]);

  const getTermostatColor = cond([
    [equals(0),  () => 'primary'],
    [equals(240),  () => 'error'],
  ]);

  const getBiscuitSafer = (el: IBiscuit): IBiscuit[] => Either(!isEmpty(el))
    // this will happens only if biscuite is not empty
    .map(_ => [el])
    // finaly we take the biscuite wraped on biscuite or empty array 
    .fold(_ => [], v => v) as IBiscuit[];

  const updateConveyorBelt = (): void => {
    const updatedList = TryCatch(() => getBiscuitSafer(raw))
      .map(el => [...el, ...getBiscuitSafer(stamped)])
      .map(el => [...el, ...getBiscuitSafer(inOven)])
      .get();

    // update convey belt
    addBiscuitsForConvey(updatedList);
  }

  useEffect(() => {
    if(!isOn(machineState)) return;
    // The order is important 
    // first if there is any stamped cookies it should be put in the oven 
    // to free a space for the new stamped one
    // then we should check if there is any raw cookie and if so it should be stamped
    // and only then when we are sure that there is a free space in the convaey belt 
    // we can create new raw cookie with the extruder

    // if there is in the oven we should put them out because it will burn  
    !isEmpty(inOven) && addToBasket((prev) => [...prev, done(inOven)]);
    // if there is stamped cookie we should put in the oven
    !isEmpty(stamped) && putInOven(bake(stamped)) 
    // if there is raw cookie we should stamp it
    !isEmpty(raw) && addStamped(stamp(raw));
    // The id is the pulse on this way we could track the process
    addRaw(extrude(pulse));

    updateConveyorBelt();
  }, [pulse]);

  return (<>
    <Box display="flex" alignItems='center' flexDirection="column">
      <Stack direction="row" spacing={2} padding={2}>
        <Button variant="contained" onClick={start}>On</Button>
        <Button variant="contained" disabled={isOff(machineState)} onClick={pause}>Pause</Button>
        <Button variant="contained" onClick={stop}>Off</Button>
        <Chip icon={<ThermostatIcon />} label={temperature} color={getTermostatColor(temperature) as any}/>
      </Stack>
      {!biscuitsForConvey && <p>It looks like the belt is empty...</p>}
      <Stack direction='row' spacing={3}>
        {biscuitsForConvey && <BiscuitList title="Conveyor belt" biscuits={biscuitsForConvey}/>}
        {basket && <BiscuitList title="Basket" biscuits={basket}/>}
      </Stack>
    </Box>
  </>);
}