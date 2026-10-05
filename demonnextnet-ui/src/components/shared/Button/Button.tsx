import React, { forwardRef } from "react";
import styles from "./Button.module.scss";

type ButtonVariant     = "primary" | "secondary" | "tertiary";
type ButtonHtmlType    = "button" | "submit" | "reset";
type ButtonIconPlacement = "left" | "right";

interface ButtonProps {
  className?: string;
  label:          string;
  variant:        ButtonVariant;
  icon?:          React.ReactNode;
  iconPlacement?: ButtonIconPlacement;
  onClick?:       () => void;
  disabled?:      boolean;
  htmlType?:      ButtonHtmlType;
  ariaExpanded?:  boolean;
  ariaControls?:  string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    label,
    variant,
    icon,
    iconPlacement = "left",
    onClick,
    disabled   = false,
    htmlType   = "button",
    ariaExpanded,
    ariaControls,
  },
  ref
) {
  const iconNode = icon ? (
    <span className={styles.icon} aria-hidden="true">
      {icon}
    </span>
  ) : null;

  return (
    <button
      ref={ref}
      type={htmlType}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      className={`${styles.button} ${styles[variant]} ${className ?? ""}`.trim()}
    >
      {iconPlacement === "left"  && iconNode}
      <span>{label}</span>
      {iconPlacement === "right" && iconNode}
    </button>
  );
});

Button.displayName = "Button";
export default Button;