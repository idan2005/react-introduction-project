import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input"
import { UserUtils } from "../../Services/UserService";
import PasswordInput from "./PasswordInput";

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
  onRegisterSuccess?: (username: string) => void;
}

function RegisterForm({ onSwitchToLogin, onRegisterSuccess }: RegisterFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({ 
    username: "", 
    password: "", 
    confirmPassword: "", 
    general: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({ username: "", password: "", confirmPassword: "", general: "" });

    const newErrors = { username: "", password: "", confirmPassword: "", general: "" };
    
    if (!username.trim()) {
      newErrors.username = "Username is required";
    }
    
    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (newErrors.username || newErrors.password || newErrors.confirmPassword) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    const result = await UserUtils.registerUser(username, password);

    if (result.success) {
      setUsername("");
      setPassword("");
      setConfirmPassword("");

      localStorage.setItem('jwt_token', result.data || '');
      alert("Registration successful! Welcome!");

      onRegisterSuccess?.(username);
    } 
    else {
      setErrors({ ...newErrors, general: result.message });
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input 
            placeholder="Enter Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isSubmitting}
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
        </div>
        
        <div>
          <PasswordInput 
            placeholder="Enter Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        <div>
          <PasswordInput 
            placeholder="Confirm Password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isSubmitting}
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registering..." : "Register"}
        </Button>
        
        <p className="text-center">
          Already have an account?{" "}
          <button 
            type="button"
            onClick={onSwitchToLogin}
            className="text-blue-500 hover:underline"
            disabled={isSubmitting}
          >
            Log in
          </button>
        </p>
      </form>
    </div>
  );
}

export default RegisterForm;
    