import { cond, equals } from "ramda";
import { MachineStates } from "../enums";

export const isOn = equals(MachineStates.on);
export const isOff = equals(MachineStates.off);
export const isPause = equals(MachineStates.pause);

export const getThermostatColor = cond([
  [equals(0),  () => 'primary'],
  [equals(240),  () => 'error'],
]);

export const getMachineColor = cond([
  [isOn,  () => 'success'],
  [isOff,  () => 'primary'],
  [isPause,  () => 'warning'],
]);

export const getMotorColor = cond([
  [(v: boolean) => v,  () => 'success'],
  [(v: boolean) => !v,  () => 'primary'],
]);