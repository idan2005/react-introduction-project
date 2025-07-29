import { useState } from "react";
import { Input } from "../ui/input";

interface PasswordInputProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
}

function PasswordInput({ 
  placeholder = "Enter Password", 
  value, 
  onChange, 
  disabled = false,
  className = ""
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input 
        placeholder={placeholder}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`pr-12 ${className}`}
      />
      
      <button
        type="button"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm"
        onClick={() => setShowPassword(!showPassword)}
        disabled={disabled}
      >
        {showPassword ? "🚫" : "👁️"}
      </button>
    </div>
  );
}

export default PasswordInput;
