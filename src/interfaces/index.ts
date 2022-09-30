import { BiscuitStates } from "../enums";

export interface IBiscuit {
  id: string,
  stamp: string,
  state: BiscuitStates,
}