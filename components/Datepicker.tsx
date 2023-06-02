"use client";
import Modal from "react-modal";
import { useEffect, useState } from "react";
import {
  getDaysInMonth,
  getMonth,
  getYear,
  isBefore,
  isEqual,
  startOfDay,
  format,
  setDay,
} from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import getDay from "date-fns/getDay";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";

enum CalendarDayType {
  PREVIOUS = "PREVIOUS",
  CURRENT = "CURRENT",
  NEXT = "NEXT",
}

Modal.setAppElement("#modal");

export default function Datepicker({ isRange = false }: { isRange: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [month, setMonth] = useState(getMonth(new Date()));
  const [year, setYear] = useState(getYear(new Date()));
  const [daysInCalendar, setDaysInCalendar] = useState<
    {
      date: Date;
      type: CalendarDayType;
    }[][]
  >([]);
  const [selectFirstDate, setSelectFirstdate] = useState<Date | null>(null);
  const [selectSecondDate, setSelectSecondDate] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const onOpenHandler = () => {
    setIsOpen(true);
  };

  const onCloseHandler = () => {
    setIsOpen(false);
  };

  function getDaysInCalendar() {
    let daysInCalendar: { date: Date; type: CalendarDayType }[][] = [];
    const numberOfRows = 6;

    const firstDayOfWeek = getDay(startOfDay(new Date(year, month)));

    const numberOfDaysInPreviousMonth = getDaysInMonth(
      new Date(year, month - 1)
    );
    const daysInPreviousMonth: number[] = Array.from(
      Array(numberOfDaysInPreviousMonth),
      (_, index) => index
    );
    const previousMonthDaysDisplayed: number[] = daysInPreviousMonth.slice(
      numberOfDaysInPreviousMonth - firstDayOfWeek
    );

    const numberOfDaysInThisMounth: number[] = Array.from(
      Array(getDaysInMonth(new Date(year, month))),
      (_, index) => index
    );

    const numberOfDaysInNextMonth = Array.from(Array(15), (_, index) => index);

    for (let week = 0; week < numberOfRows; week++) {
      daysInCalendar.push([]);
      for (let day = 0; day < 7; day++) {
        if (day < firstDayOfWeek && week === 0) {
          daysInCalendar[week].push({
            type: CalendarDayType.PREVIOUS,
            date: new Date(year, month - 1, previousMonthDaysDisplayed[0] + 1),
          });
          previousMonthDaysDisplayed.shift();
        } else if (day >= firstDayOfWeek || week !== 0) {
          if (numberOfDaysInThisMounth.length) {
            daysInCalendar[week].push({
              type: CalendarDayType.CURRENT,
              date: new Date(year, month, numberOfDaysInThisMounth[0] + 1),
            });
            numberOfDaysInThisMounth.shift();
          } else {
            daysInCalendar[week].push({
              type: CalendarDayType.NEXT,
              date: new Date(year, month + 1, numberOfDaysInNextMonth[0] + 1),
            });
            numberOfDaysInNextMonth.shift();
          }
        }
      }
    }
    setDaysInCalendar(daysInCalendar);
  }

  useEffect(() => {
    getDaysInCalendar();
  }, [month, year]);

  const selectDayInCalendar = (day: Date) => {
    if (!selectFirstDate) {
      return setSelectFirstdate(day);
    }
    if (selectFirstDate && !selectSecondDate) {
      return setSelectSecondDate(day);
    }
    if (selectFirstDate && selectSecondDate) {
      if (day > selectFirstDate) {
        setSelectSecondDate(day);
      }
      if (day < selectSecondDate) {
        setSelectFirstdate(day);
      }
    }
  };

  function getMonthLabel(month: number) {
    return format(new Date(year, month), "LLL	", {
      locale: ptBR,
    });
  }

  const dayLabels = Array.from(Array(7), (_, index) => index).map((_, idx) => {
    const date = setDay(new Date(), idx);
    return format(date, "EEEEE", { locale: ptBR });
  });

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
        {selectFirstDate && new Date(selectFirstDate).toISOString()}
      </h1>
      {isRange && (
        <h1>
          Meu segundo dia selecionado:{" "}
          {selectSecondDate && new Date(selectSecondDate).toISOString()}
        </h1>
      )}
      <Modal
        isOpen={isOpen}
        onRequestClose={onCloseHandler}
        className="mx-auto mt-80 w-80  bg-gray-50 drop-shadow-2xl rounded-md px-4"
      >
        <div className="h-full px-2 py-8">
          <div className="flex flex-col ">
            <h2 className="text-lg font-semibold text-gray-700">{year}</h2>
            <div className="flex items-center justify-between mt-2 mb-4">
              <button
                onClick={() => setMonth((prev) => prev - 1)}
                className="flex items-center justify-center h-8 w-8 hover:drop-shadow-2xl hover:bg-gray-200 rounded-md transition-shadow"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <h3 className="capitalize text-gray-800 font-semibold">
                {getMonthLabel(month)}
              </h3>
              <button
                onClick={() => setMonth((prev) => prev + 1)}
                className="flex items-center justify-center h-8 w-8 hover:drop-shadow-2xl hover:bg-gray-200 rounded-md transition-shadow"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-between h-full">
            <div className="flex items-center justify-between w-full mt-2 mb-1">
              {dayLabels.map((day, index) => (
                <div
                  key={index}
                  className="w-full text-center text-gray-700 text-sm"
                >
                  {day}
                </div>
              ))}
            </div>
            {daysInCalendar.map((weekDays, index) => (
              <div
                key={index}
                className="w-full flex items-center justify-between"
              >
                {weekDays.map((day, index) => (
                  <button
                    disabled={day.type !== CalendarDayType.CURRENT}
                    key={index}
                    className={`text-center w-full py-1 text-gray-800 disabled:text-zinc-400 disabled:bg-slate-50 transition-all delay-100
                  ${
                    selectFirstDate && isEqual(selectFirstDate, day.date)
                      ? "bg-gray-800 rounded-l-lg text-gray-50"
                      : ""
                  }
                  ${
                    selectSecondDate && isEqual(selectSecondDate, day.date)
                      ? "bg-gray-800 rounded-r-lg text-gray-50"
                      : ""
                  }
                  ${
                    selectFirstDate &&
                    !selectSecondDate &&
                    isBefore(selectFirstDate, day.date) &&
                    hoveredDate &&
                    isBefore(day.date, hoveredDate)
                      ? "bg-gray-400"
                      : ""
                  }
                  ${
                    selectFirstDate &&
                    isBefore(selectFirstDate, day.date) &&
                    selectSecondDate &&
                    isBefore(day.date, selectSecondDate)
                      ? "bg-gray-400"
                      : ""
                  }
               
                 `}
                    onMouseEnter={() => {
                      if (!selectSecondDate) {
                        setHoveredDate(day.date);
                      }
                    }}
                    onClick={() => selectDayInCalendar(day.date)}
                  >
                    {new Date(day.date).getDate()}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
