import { Button } from "antd";

type ResetProps = {
  onClick: () => void;
};

export function ResetButton(props: ResetProps) {
  return (
    <Button
      style={{ transform: "scale(1.3)" }}
      size="large"
      type="primary"
      onClick={() => {
        props.onClick();
      }}
    >
      Reset
    </Button>
  );
}
