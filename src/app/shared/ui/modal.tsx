"use client";

import { Modal, ModalProps } from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  Ref,
  JSX,
} from "react";

export interface OnConfirmProps<T=void> {
  data?: T | undefined;
  onClose?: () => void;
}

export interface MyModalRef<T = void> {
  open: (data?: T | undefined) => void;
  close: () => void;
}

export interface CFModalProps<T = void> extends Omit<ModalProps, "children"> {
  onConfirm?: (props: OnConfirmProps<T>) => void;
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

  const handleCancel = () => {
    onCancel?.();
    setOpen(false);
    setPayload(undefined);
  };

  const handleOk = async () => {
    if (onConfirm) {
      try {
        await onConfirm({
          data: payload,
          onClose: handleCancel,
        });
        setPayload(undefined);
      } catch (error) {
        throw error;
      }
    }
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
