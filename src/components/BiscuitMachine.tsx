import { useEffect, useState } from "react";
import { isEmpty } from "ramda";
import { TryCatch, Either } from 'lambda-ts';

import { Box, Button } from "@mui/material";
import { Stack } from "@mui/system";

import { BiscuitStates, BmListTypes, MachineStates } from "../enums";
import { useMotor } from "../hooks/use-motor";
import { IBiscuit } from "../interfaces";
import { BiscuitList } from "./BiscuitList";
import { isOff, isOn, isPause } from "../utils";
import { Legend } from "./Legend";

interface BiscuitMachineProps{
  brand: string,
  canStart: boolean,
}

export const BiscuitMachine = ({canStart, brand}: BiscuitMachineProps) => {
  const [machineState, switchMachine] = useState(MachineStates.off);
  const [temperature, setTemperature] = useState(0);
  const {pulse, motorState, setMotorState} = useMotor();

  const [biscuitsForConvey, addBiscuitsForConvey] = useState([] as IBiscuit[]);
  // when cookies are ready they should be stored in the basket
  const [basket, addToBasket] = useState([] as IBiscuit[]);
  const [raw, addRaw] = useState({} as IBiscuit);
  const [stamped, addStamped] = useState({} as IBiscuit);
  const [inOven, putInOven] = useState({} as IBiscuit);

  const extrude = (id: string) => ({id, stamp: '', state: BiscuitStates.raw});
  const stamp = (biscuite: IBiscuit) => ({...biscuite, stamp: brand, state: BiscuitStates.stamped});
  const bake = (biscuite: IBiscuit) => ({...biscuite, state: BiscuitStates.bake});
  const done = (biscuite: IBiscuit) => ({...biscuite, state: BiscuitStates.baked});

  const start = () => {
    switchMachine(MachineStates.on);
    setMotorState(true);
  }

  const stop = () => {
    switchMachine(MachineStates.off);
  }

  const pause = () => {
    switchMachine(MachineStates.pause);
    setMotorState(false);
  }

  useEffect(() => {
    if(isOn(machineState)) {
      setTemperature(240);
    }
  }, [machineState]);

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

  // when machine is on convey belt should be start the process of creation of the cookises
  const handlePulseWhenMachineIsTurnedOn = () => {
    // machine create raw cookie with the extruder
    addRaw(extrude(new Date().toLocaleString()));
    // if there is a raw cookie it must be stamped
    !isEmpty(raw) && addStamped(stamp(raw));
    // if there is a stamped raw cookie it must be put in the oven
    !isEmpty(stamped) && putInOven(bake(stamped));
    // if there is a baked cookie it should be store in the basket
    !isEmpty(inOven) && addToBasket((prev) => [done(inOven), ...prev]);
  }

  // when machine is turned off convey belt must be emptied 
  // and all cookies on the belt must be baked
  const handlePulseWhenMachineIsTurnedOff = () => {
    // if there is cookie in the oven it must be moved in the basked 
    if(!isEmpty(inOven)) {
      addToBasket((prev) => [done(inOven), ...prev]);
      putInOven({} as IBiscuit);
    }

    // if there is stmped cookie it must be put in oven and 
    // then we don't need any new stemped cookie
    if (!isEmpty(stamped)) {
      putInOven(bake(stamped));
      addStamped({} as IBiscuit);
    }

    // if there is raw cookie it must be stamped and 
    // then we don't need any new raw cookie
    if (!isEmpty(raw)) {
      addStamped(stamp(raw));
      addRaw({} as IBiscuit);
    }
  }

  useEffect(() => {
    if(!motorState) return; 
    
    if(isOn(machineState)) {
      handlePulseWhenMachineIsTurnedOn();
    }

    if(isOff(machineState)) {
      handlePulseWhenMachineIsTurnedOff();
    }

  }, [pulse]);

  useEffect(() => {
    updateConveyorBelt();
  }, [raw, stamped, inOven]);

   //This hook is responsible to turn off the oven and motor
  useEffect(() => {
    if(!isOff(machineState)) return;
    if(!isEmpty(biscuitsForConvey)) return;

    setTemperature(0);
    // motor should stop only when conveyor belt is empty
    setMotorState(false);
  }, [biscuitsForConvey, machineState]);

  return (<>
    <Box display="flex" alignItems='center' flexDirection="column">
      <Legend motorState={motorState} temperature={temperature} machineState={machineState} />
      <Stack direction="row" spacing={2} padding={2}>
        <Button variant="contained" disabled={!canStart || isOn(machineState)} onClick={start}>On</Button>
        <Button variant="contained" disabled={isOff(machineState) || isPause(machineState)} onClick={pause}>Pause</Button>
        <Button variant="contained" disabled={isOff(machineState) || isPause(machineState)} onClick={stop}>Off</Button>
      </Stack>
      {!biscuitsForConvey && <p>It looks like the belt is empty...</p>}
      <Stack direction='row' spacing={3} width="100%">
        {biscuitsForConvey && <BiscuitList title="Conveyor belt" biscuits={biscuitsForConvey} listType={BmListTypes.belt}/>}
        {basket && <BiscuitList title="Basket" biscuits={basket} listType={BmListTypes.basket}/>}
      </Stack>
    </Box>
  </>);
}