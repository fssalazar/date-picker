"use client";

import { useState } from "react";
import { ptBR, enUS } from "date-fns/locale";
import Datepicker from "./Datepicker";

export default function Button() {
  const [isOpen, setIsOpen] = useState(false);
  const [firstDateSelected, setFirstDateSelected] = useState<Date | null>(null);
  const [secondDateSelected, setSecondDateSelected] = useState<Date | null>(
    null
  );

  const isRange = true;

  function onOpenHandler() {
    setIsOpen(true);
  }

  return (
    <div>
      <button
        className="bg-violet-600 px-4 py-2 rounded-md text-yellow-50"
        onClick={onOpenHandler}
      >
        Date Picker
      </button>
      <h1>
        Meu primeiro dia selecionado:{" "}
        {firstDateSelected && new Date(firstDateSelected).toISOString()}
      </h1>
      {isRange && (
        <h1>
          Meu segundo dia selecionado:{" "}
          {secondDateSelected && new Date(secondDateSelected).toISOString()}
        </h1>
      )}
      <Datepicker
        isOpen={isOpen}
        locale={enUS}
        onClose={() => setIsOpen(false)}
        onFirstDateChange={setFirstDateSelected}
        onSecondDateChange={setSecondDateSelected}
        firstDateSelected={firstDateSelected}
        secondDateSelected={secondDateSelected}
      />
    </div>
  );
}
