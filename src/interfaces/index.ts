import { BisquiteStates } from "../enums";

export interface IBisquite {
  id: number,
  stamp: string,
  state: BisquiteStates,
}