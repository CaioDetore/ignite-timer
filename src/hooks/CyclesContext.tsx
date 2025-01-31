import { createContext, ReactNode, useReducer, useState } from "react";

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

export interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptDate?: Date;
  finishedDate?: Date;
}

interface CyclesContextType {
  cycles: Cycle[];
  activeCycle?: Cycle;
  amountSecondsPassed: number;
  activeCycleId: string | null;

  interruptCycle: () => void;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
  createNewCycle: (data: CreateCycleData) => void;
}

export const CyclesContext = createContext<CyclesContextType>(
  {} as CyclesContextType
);

interface CycleContextProviderProps {
  children: ReactNode;
}

interface CyclesState {
  cycles: Cycle[];
  activeCycleId: string | null;
}

export function CyclesContextProvider({ children }: CycleContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    (state: CyclesState, action: any) => {
      switch (action.type) {
        case "ADD_NEW_CYCLE":
          return {
            ...state,
            cycles: [...state.cycles, action.payload.newCycle],
            activeCycleId: action.payload.newCycle.id,
          };
        case "INTERRUPT_CURRENT_CYCLE":
          return {
            ...state,
            cycles: state.cycles.map((cycle) => {
              if (cycle.id === activeCycle?.id) {
                return { ...cycle, interruptDate: new Date() };
              } else {
                return cycle;
              }
            }),
            activeCycleId: null,
          };
        case "MARK_CURRENT_CYCLE_AS_FINISHED":
          return {
            ...state,
            cycles: state.cycles.map((cycle) => {
              if (cycle.id === activeCycle?.id) {
                return { ...cycle, finishedDate: new Date() };
              } else {
                return cycle;
              }
            }),
            activeCycleId: null,
          };
        default:
          return state;
      }
    },
    {
      cycles: [],
      activeCycleId: null,
    }
  );

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const { activeCycleId, cycles } = cyclesState;

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  function markCurrentCycleAsFinished() {
    dispatch({
      type: "MARK_CURRENT_CYCLE_AS_FINISHED",
      payload: { activeCycleId },
    });
  }

  function createNewCycle(data: CreateCycleData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      minutesAmount: data.minutesAmount,
      task: data.task,
      startDate: new Date(),
    };

    dispatch({
      type: "ADD_NEW_CYCLE",
      payload: { data: newCycle },
    });

    setAmountSecondsPassed(0);
  }

  function interruptCycle() {
    dispatch({
      type: "INTERRUPT_CURRENT_CYCLE",
      payload: { activeCycleId },
    });
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycleId,
        amountSecondsPassed,
        createNewCycle,
        interruptCycle,
        markCurrentCycleAsFinished,
        setSecondsPassed,
        activeCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
