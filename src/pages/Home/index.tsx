import { useEffect, useState } from "react";
import { HandPalm, Play } from "phosphor-react";
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesInput,
  Separator,
  StartCountdownButton,
  StopCountdownButton,
  TaskInput,
} from "./styles";
import { useForm } from "react-hook-form";

import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { differenceInSeconds } from "date-fns";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "Informe a tarefa"),
  minutesAmount: zod
    .number()
    .min(0.5, "O ciclo precisa ser no mínimo 5 minutos.")
    .max(60, "O ciclo não pode ser maior que 60 minutos."),
});

type NewCyclieFormData = zod.infer<typeof newCycleFormValidationSchema>;

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptDate?: Date;
  finishedDate?: Date;
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycledId, setActiveCycledId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const { register, handleSubmit, watch, reset } = useForm<NewCyclieFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycledId);
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate
        );

        if (secondsDifference >= totalSeconds) {
          setCycles((state) =>
            state.map((cycle) => {
              if (cycle.id === activeCycle?.id) {
                return { ...cycle, finishedDate: new Date() };
              } else {
                return cycle;
              }
            })
          );

          setAmountSecondsPassed(totalSeconds);
          clearInterval(interval);
        } else {
          setAmountSecondsPassed(secondsDifference);
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [activeCycle, totalSeconds]);

  function handleCreateNewCycle(data: NewCyclieFormData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      minutesAmount: data.minutesAmount,
      task: data.task,
      startDate: new Date(),
    };

    setCycles((state) => [...state, newCycle]);
    setActiveCycledId(newCycle.id);
    setAmountSecondsPassed(0);

    reset();
  }

  function handleInterruptCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycle?.id) {
          return { ...cycle, interruptDate: new Date() };
        } else {
          return cycle;
        }
      })
    );

    setActiveCycledId(null);
  }

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

  const minutesAmount = Math.floor(currentSeconds / 60);
  const secondsAmount = currentSeconds % 60;

  const minutes = String(minutesAmount).padStart(2, "0");
  const seconds = String(secondsAmount).padStart(2, "0");

  useEffect(() => {
    document.title = `${minutes}:${seconds}`;
  }, [minutes, seconds]);

  const task = watch("task");
  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="">Vou trabalhar em</label>
          <TaskInput
            id="task"
            list="task-sugestions"
            disabled={!!activeCycle}
            placeholder="de um nome para o seu projeto"
            {...register("task")}
          />

          <datalist id="task-sugestions">
            <option value="projeto 1"></option>
          </datalist>

          <label htmlFor="">durante</label>
          <MinutesInput
            min={0.5}
            max={60}
            step={5}
            type="number"
            id="minutesAmount"
            disabled={!!activeCycle}
            {...register("minutesAmount", { valueAsNumber: true })}
          />
          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        {activeCycle ? (
          <StopCountdownButton type="submit" onClick={handleInterruptCycle}>
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
