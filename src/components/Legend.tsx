import { Chip, Stack } from "@mui/material"

import ThermostatIcon from '@mui/icons-material/DeviceThermostat';
import MachineIcon from '@mui/icons-material/Microwave';
import MotorIcon from '@mui/icons-material/SettingsSuggest';
import { MachineStates } from "../enums";
import { getMachineColor, getMotorColor, getThermostatColor } from "../utils";

interface ILegendProps {
  temperature: number,
  machineState: MachineStates,
  motorState: boolean,
}

export const Legend = ({
  motorState,
  temperature,
  machineState,
}: ILegendProps) => {
  return (
    <Stack direction="row" spacing={2} padding={2}>
      <Chip icon={<ThermostatIcon />} label={temperature} color={getThermostatColor(temperature) as any}/>
      <Chip icon={<MachineIcon />} label={machineState} color={getMachineColor(machineState) as any}/>
      <Chip icon={<MotorIcon />} label={(motorState && 'on') || 'off'} color={getMotorColor(motorState) as any}/>
    </Stack>
  )
}