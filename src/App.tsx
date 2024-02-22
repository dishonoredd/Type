import { useRef, useState } from "react";
import { ProgressBar } from "./progress-bar";
import { ResetButton } from "./reset-button";

import css from "./app-style.module.css";
import { Input, Space, Typography } from "antd";

const sourceText = "Lorem ipsucitationem ea aliquam?";

const alphabet = "qwertyuiopasdfghjklzxcvbnm ,.!?:-";

type Time = { seconds: number; minutes: number };

const timeHandler = (prevState: Time) => {
  let newSeconds = prevState.seconds + 1;
  let newMinutes = prevState.minutes;
  if (newSeconds === 60) {
    newSeconds = 0;
    newMinutes++;
  }
  return { minutes: newMinutes, seconds: newSeconds };
};

// Todo
// ! Добавить переключалку на русский текст
// ! localStorage
// https://www.npmjs.com/package/random-words
// Подключить Yandex Translate API

function App() {
  const [text, setText] = useState("");
  const [pointer, setPointer] = useState(0);
  const [time, setTime] = useState<Time>({ seconds: 0, minutes: 0 });
  const timerId = useRef<number | undefined>(undefined);
  const [errorsCount, setErrorsCount] = useState(0);

  function startTimer() {
    timerId.current = setInterval(() => {
      setTime(timeHandler);
    }, 1000);
  }

  function reset() {
    setText("");
    setPointer(0);
    clearInterval(timerId.current);
    setTime({ minutes: 0, seconds: 0 });
    setErrorsCount(0);
  }

  let accuracy = 100 - (errorsCount / pointer) * 100;
  if (accuracy < 0) accuracy = 0;
  return (
    <div className={css.root}>
      <p>
        Time: {time.minutes.toString().padStart(2, "0")}:
        {time.seconds.toString().padStart(2, "0")}
      </p>
      <Typography.Text>Количество ошибок: {errorsCount}</Typography.Text>
      {pointer > 0 && <p>Точность: {accuracy.toFixed(2)}%</p>}
      <ProgressBar progress={Math.round((pointer / sourceText.length) * 100)} />
      <ResetButton onClick={reset} />
      <p>
        {[...sourceText].map((char, i) => (
          <span style={{ backgroundColor: i === pointer ? "red" : undefined }}>
            {char}
          </span>
        ))}
      </p>
      <Input
        style={{ width: 500 }}
        placeholder="Введите текст"
        type="text"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
        onKeyDown={(e) => {
          const key = e.key;

          if (key.length !== 1) {
            return;
          }

          if (timerId.current === undefined) {
            startTimer();
          }

          if (key === sourceText[pointer]) {
            setPointer(pointer + 1);
          } else {
            setErrorsCount((prev) => prev + 1);
          }
        }}
      />
    </div>
  );
}

export default App;
