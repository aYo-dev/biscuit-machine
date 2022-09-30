import { Box, Button, Chip } from "@mui/material";
import { Stack } from "@mui/system";
import { cond, equals, isEmpty } from "ramda";
import { useEffect, useState } from "react";

import { BisquiteStates, MachineStates } from "../enums";
import { useMotor } from "../hooks/use-motor";
import { IBisquite } from "../interfaces";
import { BisquitList } from "./BisquitList";
import ThermostatIcon from '@mui/icons-material/DeviceThermostat';
import { TryCatch, Either } from 'lambda-ts';


const isOn = equals(MachineStates.on);
const isOff = equals(MachineStates.off);
const isPause = equals(MachineStates.off);

interface BiscuitMachineProps{
  brand: string,
}

export const BiscuiteMachine = (props: BiscuitMachineProps) => {
  const [machineState, switchMachine] = useState(MachineStates.off);
  const [temperature, setTemperature] = useState(0);
  const [setMotorState, pulse] = useMotor();

  const [bisquitesForConvey, addBisquiteForConvey] = useState([] as IBisquite[]);
  const [basket, addToBasket] = useState([] as IBisquite[]);
  const [raw, addRaw] = useState({} as IBisquite);
  const [stamped, addStamped] = useState({} as IBisquite);
  const [inOven, putInOven] = useState({} as IBisquite);

  const extrude = (id: number) => ({id, stamp: '', state: BisquiteStates.raw});
  const stamp = (bisquite: IBisquite) => ({...bisquite, stamp: props.brand, state: BisquiteStates.stamped});
  const bake = (bisquite: IBisquite) => ({...bisquite, state: BisquiteStates.bake});
  const done = (bisquite: IBisquite) => ({...bisquite, state: BisquiteStates.baked});

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

  const getBisquiteSafer = (el: IBisquite): IBisquite[] => Either(!isEmpty(el))
    // this will happens only if bisquite is not empty
    .map(_ => [el])
    // finaly we take the bisquite wraped on bisquite or empty array 
    .fold(_ => [], v => v) as IBisquite[];

  const updateConveyorBelt = (): void => {
    const updatedList = TryCatch(() => getBisquiteSafer(raw))
      .map(el => [...el, ...getBisquiteSafer(stamped)])
      .map(el => [...el, ...getBisquiteSafer(inOven)])
      .get();

    // update convey belt
    addBisquiteForConvey(updatedList);
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
      {!bisquitesForConvey && <p>It looks like the belt is empty...</p>}
      <Stack direction='row' spacing={3}>
        {bisquitesForConvey && <BisquitList title="Conveyor belt" bisquites={bisquitesForConvey}/>}
        {basket && <BisquitList title="Basket" bisquites={basket}/>}
      </Stack>
    </Box>
  </>);
}