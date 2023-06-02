"use client";
import Modal from "react-modal";
import { useEffect, useState } from "react";
import {
  getDaysInMonth,
  isBefore,
  isEqual,
  format,
  setDay,
  subMonths,
  addMonths,
  startOfMonth,
  getMonth,
  Locale,
} from "date-fns";
import getDay from "date-fns/getDay";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";

Modal.setAppElement("#modal");

interface Props {
  locale: Locale;
  isOpen: boolean;
  firstDateSelected: Date | null;
  secondDateSelected: Date | null;
  onClose(): void;
  onFirstDateChange(date: Date): void;
  onSecondDateChange(date: Date): void;
}

export default function Datepicker({
  isOpen,
  onClose,
  locale,
  onFirstDateChange,
  onSecondDateChange,
  firstDateSelected,
  secondDateSelected,
}: Props) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [daysInCalendar, setDaysInCalendar] = useState<Date[][]>([]);

  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  function getDaysInCalendar() {
    let daysInCalendar: Date[][] = [];
    const numberOfRows = 6;

    const firstDayOfWeek = getDay(startOfMonth(currentDate)); // quinta feira

    const previousMonth = subMonths(currentDate, 1);
    const nextMonth = addMonths(currentDate, 1);
    const numberOfDaysInPreviousMonth = getDaysInMonth(previousMonth); // 31

    const daysInPreviousMonth: Date[] = Array.from(
      Array(numberOfDaysInPreviousMonth),
      (_, index) => new Date(previousMonth.setDate(index + 1))
    );
    const previousMonthDaysDisplayed: Date[] = daysInPreviousMonth.slice(
      numberOfDaysInPreviousMonth - firstDayOfWeek
    );

    const numberOfDaysInThisMounth: number[] = Array.from(
      Array(getDaysInMonth(currentDate)),
      (_, index) => index
    );
    const numberOfDaysInNextMonth = Array.from(
      Array(15),
      (_, index) => new Date(nextMonth.setDate(index + 1))
    );

    for (let week = 0; week < numberOfRows; week++) {
      daysInCalendar.push([]);
      for (let day = 0; day < 7; day++) {
        if (day < firstDayOfWeek && week === 0) {
          daysInCalendar[week].push(previousMonthDaysDisplayed[0]);
          previousMonthDaysDisplayed.shift();
        } else if (day >= firstDayOfWeek || week !== 0) {
          if (numberOfDaysInThisMounth.length) {
            daysInCalendar[week].push(
              new Date(currentDate.setDate(numberOfDaysInThisMounth[0] + 1))
            );
            numberOfDaysInThisMounth.shift();
          } else {
            daysInCalendar[week].push(numberOfDaysInNextMonth[0]);
            numberOfDaysInNextMonth.shift();
          }
        }
      }
    }
    setDaysInCalendar(daysInCalendar);
  }

  const selectDayInCalendar = (day: Date) => {
    if (!firstDateSelected) {
      return onFirstDateChange(day);
    }
    if (firstDateSelected && !secondDateSelected) {
      return onSecondDateChange(day);
    }
    if (firstDateSelected && secondDateSelected) {
      if (day > firstDateSelected) {
        onSecondDateChange(day);
      }
      if (day < secondDateSelected) {
        onFirstDateChange(day);
      }
    }
  };

  const dayLabels = Array.from(Array(7), (_, index) => index).map((_, idx) => {
    const date = setDay(new Date(), idx);
    return format(date, "EEEEE", { locale: locale });
  });

  useEffect(() => {
    getDaysInCalendar();
  }, [currentDate]);

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="mx-auto mt-80 w-80  bg-gray-50 drop-shadow-2xl rounded-md px-4"
      >
        <div className="h-full px-2 py-8">
          <div className="flex flex-col ">
            <h2 className="text-lg font-semibold text-gray-700">
              {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center justify-between mt-2 mb-4">
              <button
                onClick={() => setCurrentDate((prev) => subMonths(prev, 1))}
                className="flex items-center justify-center h-8 w-8 hover:drop-shadow-2xl hover:bg-gray-200 rounded-md transition-shadow"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <h3 className="capitalize text-gray-800 font-semibold">
                {format(currentDate, "LLL	", {
                  locale: locale,
                })}
              </h3>
              <button
                onClick={() => setCurrentDate((prev) => addMonths(prev, 1))}
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
                {weekDays.map((date, index) => (
                  <button
                    disabled={getMonth(date) !== getMonth(currentDate)}
                    key={index}
                    className={`text-center w-full py-1 text-gray-800 disabled:text-zinc-400 disabled:bg-slate-50 transition-all delay-100
                  ${
                    firstDateSelected && isEqual(firstDateSelected, date)
                      ? "bg-gray-800 rounded-l-lg text-gray-100"
                      : ""
                  }
                  ${
                    secondDateSelected && isEqual(secondDateSelected, date)
                      ? "bg-gray-800 rounded-r-lg text-gray-100"
                      : ""
                  }
                  ${
                    firstDateSelected &&
                    !secondDateSelected &&
                    isBefore(firstDateSelected, date) &&
                    hoveredDate &&
                    isBefore(date, hoveredDate)
                      ? "bg-gray-400"
                      : ""
                  }
                  ${
                    firstDateSelected &&
                    isBefore(firstDateSelected, date) &&
                    secondDateSelected &&
                    isBefore(date, secondDateSelected)
                      ? "bg-gray-400"
                      : ""
                  }
               
                 `}
                    onMouseEnter={() => {
                      if (!secondDateSelected) {
                        setHoveredDate(date);
                      }
                    }}
                    onClick={() => selectDayInCalendar(date)}
                  >
                    {new Date(date).getDate()}
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
