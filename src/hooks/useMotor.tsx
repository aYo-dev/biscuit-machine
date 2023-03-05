import { useState } from "react";
import { useInterval } from "usehooks-ts";

interface IUseMotorReturnValue {
  setMotorState: (v: boolean) => void,
  motorState: boolean,
  pulse: number,
}

export function useMotor (): IUseMotorReturnValue {
  const [motorState, setMotorState] = useState(false);
  const [pulse, setPulse] = useState(0);

  useInterval(
    () => {
      motorState && setPulse(Date.now());
    },

    motorState ? 1000 : null,
  );

  return {
    pulse,
    motorState,
    setMotorState : (v: boolean) => setMotorState(v),
  };
};