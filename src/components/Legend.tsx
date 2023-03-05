import { useCallback, useMemo, useState } from "react";
import { Chip, Stack } from "@mui/material"

import ThermostatIcon from '@mui/icons-material/DeviceThermostat';
import MachineIcon from '@mui/icons-material/Microwave';
import MotorIcon from '@mui/icons-material/SettingsSuggest';
import { MachineStates } from "../enums";
import { getMachineColor, getMotorColor, getThermostatColor } from "../utils";
import { BmPopover } from "./BmPopover";

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
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [activeIdentifier, setIdentifier] = useState<symbol | null>(Symbol());

  const id1 = useMemo(() => Symbol('id1'), []);
  const id2 = useMemo(() => Symbol('id2'), []);
  const id3 = useMemo(() => Symbol('id3'), []);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, id: symbol) => {
    setAnchorEl(event.currentTarget);
    setIdentifier(id);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setIdentifier(null);
  };

  const isOpen = useCallback((id: symbol) =>
    Boolean(anchorEl) && activeIdentifier === id, [activeIdentifier, anchorEl]);

  return (
    <Stack direction="row" spacing={2} padding={2}>
      <Chip 
        onMouseEnter={($event) => handlePopoverOpen($event, id1)}
        onMouseLeave={handlePopoverClose} 
        icon={<ThermostatIcon />}
        label={temperature}
        color={getThermostatColor(temperature) as any}/>
      <BmPopover text="Temperature" handlePopoverClose={handlePopoverClose} open={isOpen(id1)} anchorEl={anchorEl}></BmPopover>

      <Chip
        onMouseEnter={($event) => handlePopoverOpen($event, id2)}
        onMouseLeave={handlePopoverClose}
        icon={<MachineIcon />}
        label={machineState}
        color={getMachineColor(machineState) as any}/>
      <BmPopover text="Machine state" handlePopoverClose={handlePopoverClose} open={isOpen(id2)} anchorEl={anchorEl}></BmPopover>

      <Chip
        onMouseEnter={($event) => handlePopoverOpen($event, id3)}
        onMouseLeave={handlePopoverClose}
        icon={<MotorIcon />}
        label={(motorState && 'on') || 'off'}
        color={getMotorColor(motorState) as any}/>
      <BmPopover text="Motor state" handlePopoverClose={handlePopoverClose} open={isOpen(id3)} anchorEl={anchorEl}></BmPopover>
    </Stack>
  )
}