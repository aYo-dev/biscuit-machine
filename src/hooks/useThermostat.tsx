import { equals } from "ramda";
import { useState } from "react";
import { useInterval } from "usehooks-ts";

type IUseMotorReturnValue = [
  number,
  React.Dispatch<React.SetStateAction<number>>,
]

const isZero = equals(0);

export function useThermostat (): IUseMotorReturnValue {
    const [temperature, setTemperature] = useState(0);
    const [target, setTarget] = useState(0);

    const increase = () => {
      setTemperature(temperature + 20);
    }

    const decrease = () => {
      setTemperature(temperature - 20);
    }


  useInterval(
    () => {
       if (target > temperature) {
        increase();
       }


       if(target < temperature) {
        decrease();
       }
    },

    isZero(target) && isZero(temperature) ? null : 500,
  );

  return [
    temperature,
    setTarget,
  ];
};