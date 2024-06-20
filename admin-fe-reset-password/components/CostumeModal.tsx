import { Modal } from "@mantine/core";
import { RootState } from "@/app/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fnModalOnClosed } from "@/app/redux/features/modalSlice";
import { reset } from "@/app/redux/features/stepperSlice";

type Props = {
  opened?: boolean;
  close?: any;
  child?: any;
};

export default function CotumeModal(props: Props) {
  const modalOpened = useSelector(
    (state: RootState) => state.modalRedux.modalOpened
  );
  const modalCloseOnClickOutside = useSelector(
    (state: RootState) => state.modalRedux.modalCloseOnClickOutside
  );
  const modalSize = useSelector((state: RootState) => state.modalRedux.size);
  const modalTitle = useSelector((state: RootState) => state.modalRedux.title);
  const child = useSelector((state: RootState) => state.modalRedux.child);
  const dispatch = useDispatch();

  return (
    <Modal
      opened={modalOpened || false}
      onClose={() => {
        dispatch(reset());
        dispatch(fnModalOnClosed());
      }}
      closeOnClickOutside={false}
      title={modalTitle}
      size={modalSize}
    >
      {child}
    </Modal>
  );
}
