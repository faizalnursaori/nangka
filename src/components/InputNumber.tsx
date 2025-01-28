import { ChangeEvent, RefObject, useRef, KeyboardEvent } from "react";

export const InputNumber = () => {
  const firstDigitRef = useRef<HTMLInputElement>(null);
  const secondDigitRef = useRef<HTMLInputElement>(null);
  const thirdDigitRef = useRef<HTMLInputElement>(null);

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
      <div className="flex gap-1.5">
        <form>
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
        </form>
      </div>
    </div>
  );
};
