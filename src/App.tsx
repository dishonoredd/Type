import { useEffect, useRef, useState } from "react";
import { ProgressBar } from "./progress-bar";
import { ResetButton } from "./reset-button";
import btnStyle from "./btn.module.css";
import css from "./app-style.module.css";
import { Input, Space, TimePicker, Typography } from "antd";
import { generate } from "random-words";
import dayjs from "dayjs";

type Time = { seconds: number; minutes: number };

[{ errorsCount: 10, accuracy: "30%" }, {}, {}, {}];

function myGenerateText(count: number): string {
    const generatedText = generate(count);

    if (typeof generatedText === "string") {
        return generatedText;
    }
    return generatedText.join(" ");
}

type InputState = "enabled" | "disabled";

function App() {
    const [text, setText] = useState("");
    const [pointer, setPointer] = useState(0);
    const [time, setTime] = useState<Time>({ seconds: 0, minutes: 0 });
    const timerId = useRef<number | undefined>(undefined);
    const [errorsCount, setErrorsCount] = useState(0);
    const [sourceText, setSourceText] = useState<string>(myGenerateText(12));
    const [inputState, setInputState] = useState<InputState>("enabled");

    function startTimer() {
        timerId.current = setInterval(() => {
            setTime((prevState: Time) => {
                let newSeconds = prevState.seconds - 1;
                let newMinutes = prevState.minutes;

                if (newSeconds === -1) {
                    newSeconds = 59;
                    newMinutes--;
                }

                if (newSeconds === 0 && newMinutes === 0) {
                    clearInterval(timerId.current);
                    setInputState("disabled");
                }
                return { minutes: newMinutes, seconds: newSeconds };
            });
        }, 1000);
    }

    function reset() {
        setText("");
        setPointer(0);
        clearInterval(timerId.current);
        timerId.current = undefined;
        setTime({ minutes: 0, seconds: 0 });
        setErrorsCount(0);
        setSourceText(myGenerateText(12));
        setInputState("enabled");
    }

    let accuracy = 100 - (errorsCount / pointer) * 100;
    if (accuracy < 0) accuracy = 0;

    const isTimerStarted = timerId.current !== undefined;

    const min = time.minutes.toString().padStart(2, "0");
    const sec = time.seconds.toString().padStart(2, "0");

    return (
        <div className={css.root}>
            <div style={{ display: "flex", columnGap: "14px" }}>
                <button className={btnStyle.button}>RU</button>
                <button className={btnStyle.button}>EN</button>
            </div>
            <p>
                Time:{" "}
                {isTimerStarted ? (
                    `${min}:${sec}`
                ) : (
                    <TimePicker
                        defaultValue={dayjs(`${min}:${sec}`, "mm:ss")}
                        format={"mm:ss"}
                        onChange={(x) => {
                            if (!x) return;

                            const min = x.get("minutes");
                            const sec = x.get("seconds");

                            setTime({ minutes: min, seconds: sec });
                        }}
                    />
                )}
            </p>
            <p>Количество ошибок: {errorsCount}</p>
            {pointer > 0 && <p>Точность: {accuracy.toFixed(2)}%</p>}

            <ProgressBar progress={Math.round((pointer / sourceText.length) * 100)} />
            <ResetButton onClick={reset} />
            <p>
                {[...sourceText].map((char, i) => (
                    <span
                        style={{
                            backgroundColor: i === pointer ? "rgb(61, 118, 241)" : undefined,
                        }}
                    >
                        {char}
                    </span>
                ))}
            </p>
            <Input
                disabled={inputState === "disabled" || (time.seconds === 0 && time.minutes === 0)}
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
