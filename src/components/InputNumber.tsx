import { ChangeEvent, RefObject, useRef, KeyboardEvent, useState, FormEvent } from "react";

interface GuessResult {
  isGuessed: boolean;
  rightNumber: number;
  rightPlace: number;
}

export const InputNumber = () => {
  const [log, setLog] = useState<string[]>([]);
  const [trial, setTrial] = useState<number>(0);
  const [numberAnswer, setNumberAnswer] = useState<string[] | null>(null);

  const firstDigitRef = useRef<HTMLInputElement>(null);
  const secondDigitRef = useRef<HTMLInputElement>(null);
  const thirdDigitRef = useRef<HTMLInputElement>(null);

  const generateNumber = (): string[] => {
    let number = Math.floor(Math.random() * 1000);
    const numberDigits: string[] = [];

    for (let i = 0; i < 3; i++) {
      const currentDigit = number % 10;
      numberDigits.unshift(currentDigit.toString());
      number = (number - currentDigit) / 10;
    }
    return numberDigits;
  };

  const checkNumber = (numberGuessed: string[], answer: string[]): GuessResult => {
    const result: GuessResult = {
      isGuessed: false,
      rightNumber: 0,
      rightPlace: 0,
    };

    for (let i = 0; i < 3; i++) {
      if (answer.includes(numberGuessed[i])) {
        result.rightNumber++;
      }
      if (answer[i] === numberGuessed[i]) {
        result.rightPlace++;
      }
    }

    return result;
  };

  const addLog = (text: string) => {
    setLog((prevLog) => {
      const newLog = [...prevLog, text];
      if (newLog.length > 7) {
        return newLog.slice(1);
      }
      return newLog;
    });
  };

  const handleStart = () => {
    setLog([]);
    setNumberAnswer(generateNumber());
    setTrial(7);
    if (firstDigitRef.current) firstDigitRef.current.value = "";
    if (secondDigitRef.current) secondDigitRef.current.value = "";
    if (thirdDigitRef.current) thirdDigitRef.current.value = "";
    addLog("Secret number generated!");
  };

  const handleGuess = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!numberAnswer) {
      setLog([]);
      setTrial(7);
      addLog("Press Start Button");
      return;
    }

    const numberGuessed = [
      firstDigitRef.current?.value || "",
      secondDigitRef.current?.value || "",
      thirdDigitRef.current?.value || "",
    ];

    const result = checkNumber(numberGuessed, numberAnswer);

    if (result.rightNumber === 3 && result.rightPlace === 3) {
      setLog([...log, `You're correct, the secret number is ${numberGuessed.join("")}! 🏆`]);
      setNumberAnswer(null);
    } else {
      setTrial((prevTrial) => prevTrial - 1);
      if (trial > 1) {
        setLog([
          ...log,
          `${numberGuessed.join("")} : ${result.rightNumber} right numbers and ${
            result.rightPlace
          } right places.`,
        ]);
      } else {
        setLog([...log, `Game Over, the secret number is ${numberAnswer.join("")}. 💩`]);
        setNumberAnswer(null);
      }
    }
  };

  const handleInput = (
    e: ChangeEvent<HTMLInputElement>,
    nextRef: RefObject<HTMLInputElement> | null
  ) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
    if (e.target.value !== "" && nextRef?.current) {
      nextRef.current.focus();
    }
  };

  const handleBackspace = (
    e: KeyboardEvent<HTMLInputElement>,
    prevRef: RefObject<HTMLInputElement> | null
  ) => {
    if (e.key === "Backspace" && e.currentTarget.value === "" && prevRef?.current) {
      prevRef.current.focus();
    }
  };

  return (
    <div>
      <div>
        <form onSubmit={handleGuess}>
          <div className="flex gap-1.5">
            <input
              ref={firstDigitRef}
              type="text"
              maxLength={1}
              inputMode="numeric"
              required
              className="input-number"
              onChange={(e) => handleInput(e, secondDigitRef)}
              onKeyDown={(e) => handleBackspace(e, null)}
            />
            <input
              ref={secondDigitRef}
              type="text"
              maxLength={1}
              inputMode="numeric"
              required
              className="input-number"
              onChange={(e) => handleInput(e, thirdDigitRef)}
              onKeyDown={(e) => handleBackspace(e, firstDigitRef)}
            />
            <input
              ref={thirdDigitRef}
              type="text"
              maxLength={1}
              inputMode="numeric"
              required
              className="input-number"
              onChange={(e) => handleInput(e, null)}
              onKeyDown={(e) => handleBackspace(e, secondDigitRef)}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 w-[300px] bg-green-500 text-white rounded hover:bg-green-600 my-4 hover:cursor-pointer"
          >
            Guess
          </button>
        </form>
        <button
          onClick={handleStart}
          className="px-4 py-2 w-[300px] bg-blue-500 text-white rounded hover:bg-blue-600 hover:cursor-pointer"
        >
          Start New Game
        </button>
        <div className="mt-4">
          {log.map((entry, index) => (
            <p key={index} className="text-sm">
              {entry}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
