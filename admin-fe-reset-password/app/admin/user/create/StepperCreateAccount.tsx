import type { RootState } from "@/app/redux/store";
import { Stepper, Button, Group, rem, Alert } from "@mantine/core";
import { FindUserAggregator } from "./FindUserAggregator";
import { IconInfoCircle } from "@tabler/icons-react";
import { reset, setActive } from "@/app/redux/features/stepperSlice";
import { useDispatch, useSelector } from "react-redux";
import FormCreateUser from "./FormCreateUser";
import { useDisclosure } from "@mantine/hooks";
import { fnModalOnClosed } from "@/app/redux/features/modalSlice";

export const StepperCreateAccount = () => {
  const dispatch = useDispatch();
  const current1 = useSelector((state: RootState) => state.stepper.current);

  return (
    <>
      <Stepper active={current1} onStepClick={setActive}>
        <Stepper.Step
          label="First step"
          description="Pencarian auth user aggregator"
        >
          <FindUserAggregator />
        </Stepper.Step>
        <Stepper.Step label="Second step" description="Buat akun admin">
          <FormCreateUser />
        </Stepper.Step>
        <Stepper.Completed>
          <Alert
            variant="light"
            color="green"
            title="Alert title"
            icon={<IconInfoCircle />}
          >
            Admin berhasil ditambahkan{" "}
            <Button
              onClick={() => {
                dispatch(fnModalOnClosed());
                dispatch(reset());
              }}
            >
              Selesai
            </Button>
          </Alert>
        </Stepper.Completed>
      </Stepper>
    </>
  );
};
