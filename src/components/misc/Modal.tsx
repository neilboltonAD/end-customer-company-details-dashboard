import React from 'react';
import { ConfirmationModal, Text } from 'components/DesignSystem';

interface ModalProps {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'OK',
  cancelText = 'Cancel',
}) => {
  return (
    <ConfirmationModal
      opened={open}
      onClose={onCancel}
      title={title}
      size="sm"
      confirmLabel={confirmText}
      cancelLabel={cancelText}
      confirmVariant="primary"
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <Text size="sm" c="dimmed">
        {message}
      </Text>
    </ConfirmationModal>
  );
}; 