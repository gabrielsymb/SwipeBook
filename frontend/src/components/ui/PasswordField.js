import { jsx as _jsx } from "react/jsx-runtime";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
export const PasswordField = ({ value, onChange, label = "Senha", error, helperText, disabled = false, required = false, fullWidth = true, margin = "normal", variant = "outlined", id, name, autoComplete = "current-password", ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    return (_jsx(TextField, { ...props, id: id, name: name, label: label, type: showPassword ? "text" : "password", value: value, onChange: (e) => onChange(e.target.value), error: !!error, helperText: helperText || error, disabled: disabled, required: required, fullWidth: fullWidth, margin: margin, variant: variant, autoComplete: autoComplete, InputProps: {
            endAdornment: (_jsx(InputAdornment, { position: "end", children: _jsx(IconButton, { "aria-label": "toggle password visibility", onClick: handleTogglePasswordVisibility, edge: "end", disabled: disabled, size: "small", children: showPassword ? _jsx(EyeOff, { size: 20 }) : _jsx(Eye, { size: 20 }) }) })),
        } }));
};
