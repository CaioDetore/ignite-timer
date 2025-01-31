import { useContext } from "react";

import { useFormContext } from "react-hook-form";
import { CyclesContext } from "../../../../hooks/CyclesContext";
import { FormContainer, MinutesInput, TaskInput } from "./styles";

export function NewCycleForm() {
  const { activeCycle } = useContext(CyclesContext);
  const { register } = useFormContext();

  return (
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
  );
}
