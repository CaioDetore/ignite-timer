import { createContext } from "react";

export interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptDate?: Date;
  finishedDate?: Date;
}

interface CyclesContextType {
  activeCycle?: Cycle;
  amountSecondsPassed: number;
  activeCycleId: string | null;

  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
}

export const CyclesContext = createContext<CyclesContextType>(
  {} as CyclesContextType
);
