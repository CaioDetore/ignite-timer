import { useContext } from "react";
import { HandPalm, Play } from "phosphor-react";
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./styles";

import { Countdown } from "./components/Countdown";
import { NewCycleForm } from "./components/NewCycleeForm";
import { zodResolver } from "@hookform/resolvers/zod";

import * as zod from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { CyclesContext } from "../../hooks/CyclesContext";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "Informe a tarefa"),
  minutesAmount: zod
    .number()
    .min(0.5, "O ciclo precisa ser no mínimo 5 minutos.")
    .max(60, "O ciclo não pode ser maior que 60 minutos."),
});

type NewCyclieFormData = zod.infer<typeof newCycleFormValidationSchema>;

export function Home() {
  const { activeCycle, interruptCycle, createNewCycle } =
    useContext(CyclesContext);

  const newCycleForm = useForm<NewCyclieFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  const { handleSubmit, watch, reset } = newCycleForm;

  function handleCreateNewCycle(data: NewCyclieFormData) {
    createNewCycle(data);
    reset();
  }

  const task = watch("task");
  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>

        <Countdown />

        {activeCycle ? (
          <StopCountdownButton type="submit" onClick={interruptCycle}>
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
