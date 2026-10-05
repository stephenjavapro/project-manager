"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import styles from "./Modal.module.scss";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  ariaLabel?: string;
};

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  ariaLabel = "Modal",
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      dialog.showModal();
      setIsReady(true);
    } else if (!isOpen) {
      setIsReady(false);
      if (dialog.open) {
        dialog.close();
      }
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.modal}
      aria-modal="true"
      aria-label={title ? undefined : ariaLabel}
      aria-labelledby={title ? titleId : undefined}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          dialogRef.current?.close();
        }
      }}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          {title && (
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
          )}
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Close modal"
            onClick={() => dialogRef.current?.close()}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className={styles.body}>{isReady && children}</div>
      </div>
    </dialog>
  );
}