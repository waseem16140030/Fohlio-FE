"use client";

import { Modal, ModalProps } from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  Ref,
  JSX,
} from "react";

export interface MyModalRef<T = void> {
  open: (data?: T) => void;
  close: () => void;
}

export interface CFModalProps<T = void> extends Omit<ModalProps, "children"> {
  onConfirm?: () => Promise<boolean> | boolean;
  onCancel?: () => void;
  children?: React.ReactNode | ((data: T | undefined) => React.ReactNode);
}

function FOModalInner<T>(
  { onConfirm, onCancel, children, ...restProps }: CFModalProps<T>,
  ref: Ref<MyModalRef<T>>
) {
  const [isOpen, setOpen] = useState(false);
  const [payload, setPayload] = useState<T | undefined>();

  useImperativeHandle(ref, () => ({
    open: (data?: T) => {
      setPayload(data);
      setOpen(true);
    },
    close: () => setOpen(false),
  }));

  const handleOk = async () => {
    if (onConfirm) {
      try {
        const shouldClose = await onConfirm();
        if (shouldClose) {
          setOpen(false);
          setPayload(undefined);
        }
        setPayload(undefined);
      } catch (error) {
        throw error;
      }
    }
  };

  const handleCancel = () => {
    onCancel?.();
    setOpen(false);
    setPayload(undefined);
  };

  return (
    <Modal {...restProps} open={isOpen} onOk={handleOk} onCancel={handleCancel}>
      {typeof children === "function" ? children(payload) : children}
    </Modal>
  );
}

// ✅ Proper forwardRef casting with generic T
export const FOModal = forwardRef(FOModalInner) as <T = void>(
  props: CFModalProps<T> & { ref?: Ref<MyModalRef<T>> }
) => JSX.Element;
