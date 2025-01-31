import { Play } from "phosphor-react";
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesInput,
  Separator,
  StartCountdownButton,
  TaskInput,
} from "./styles";
import { useForm } from "react-hook-form";

export function Home() {
  const { register, handleSubmit, watch } = useForm();

  function handleCreateNewCycle(data: any) {}

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
            placeholder="de um nome para o seu projeto"
            {...register("task")}
          />

          <datalist id="task-sugestions">
            <option value="projeto 1"></option>
          </datalist>

          <label htmlFor="">durante</label>
          <MinutesInput
            min={5}
            max={60}
            step={5}
            type="number"
            id="minutesAmount"
            {...register("minutesAmount", { valueAsNumber: true })}
          />
          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  );
}
