import { Progress } from "antd";
import css from "./progress-bar.module.css";

type Props = {
    progress: number;
};

function validateProgress(progress: number) {
    if (progress > 100) {
        return 100;
    }
    if (progress < 0) {
        return 0;
    }
    return progress;
}

export function ProgressBar(props: Props) {
    const progress = validateProgress(props.progress);
    return (
        <div style={{ width: 200 }}>
            <Progress percent={progress} size="small" />
            {/* <p>{} %</p>
            <div style={{ "--progress": progress + "%" }} className={css.progressBar}></div> */}
        </div>
    );
}
