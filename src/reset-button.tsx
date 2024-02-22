import { Button } from "antd";

type ResetProps = {
    onClick: () => void;
};

export function ResetButton(props: ResetProps) {
    return (
        <Button
            type="primary"
            onClick={() => {
                props.onClick();
            }}
        >
            Reset
        </Button>
    );
}
