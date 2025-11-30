import { type FC } from "react";
interface PasswordFieldProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    error?: string;
    helperText?: string;
    disabled?: boolean;
    required?: boolean;
    fullWidth?: boolean;
    margin?: "none" | "dense" | "normal";
    variant?: "standard" | "filled" | "outlined";
    id?: string;
    name?: string;
    autoComplete?: string;
}
export declare const PasswordField: FC<PasswordFieldProps>;
export {};
