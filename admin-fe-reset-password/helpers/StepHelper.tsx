import {
  nextStep,
  previousStep,
  setActive,
} from "@/app/redux/features/stepperSlice";
import { useDispatch } from "react-redux";

export const useStepHelper = () => {
  const dispatch = useDispatch();

  const back = () => {
    dispatch(setActive(0));
    dispatch(previousStep());
  };

  const go = () => {
    dispatch(setActive(0));
    dispatch(nextStep());
  };

  return { back, go };
};
