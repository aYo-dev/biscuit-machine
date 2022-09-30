import { BiscuitStates } from "../enums";

export interface IBiscuit {
  id: number,
  stamp: string,
  state: BiscuitStates,
}