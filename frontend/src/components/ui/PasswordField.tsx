import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import { type FC, useState } from "react";

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

export const PasswordField: FC<PasswordFieldProps> = ({
  value,
  onChange,
  label = "Senha",
  error,
  helperText,
  disabled = false,
  required = false,
  fullWidth = true,
  margin = "normal",
  variant = "outlined",
  id,
  name,
  autoComplete = "current-password",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <TextField
      {...props}
      id={id}
      name={name}
      label={label}
      type={showPassword ? "text" : "password"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={helperText || error}
      disabled={disabled}
      required={required}
      fullWidth={fullWidth}
      margin={margin}
      variant={variant}
      autoComplete={autoComplete}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleTogglePasswordVisibility}
              edge="end"
              disabled={disabled}
              size="small"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
