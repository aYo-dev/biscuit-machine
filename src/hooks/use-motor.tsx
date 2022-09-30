import { Dispatch, SetStateAction, useState } from "react";
import { useInterval } from "usehooks-ts";

type test = Dispatch<SetStateAction<boolean>>;

export function useMotor (): [test, number] {
  const [motorState, toogle] = useState(false);
  const [pulse, setPulse] = useState(0);

  useInterval(
    () => {
      setPulse(Date.now());
    },

    motorState ? 1000 : null,
  );

  return [toogle, pulse];
};