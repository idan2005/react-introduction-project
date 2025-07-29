import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input"
import { UserUtils } from "../../Services/UserService";
import PasswordInput from "./PasswordInput";
import { on } from "events";

interface LoginFormProps {
  onSwitchToRegister?: () => void;
  onLoginSuccess?: (username: string) => void;
}

function LoginForm({ onSwitchToRegister, onLoginSuccess }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "", general: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({ username: "", password: "", general: "" });

    const newErrors = { username: "", password: "", general: "" };
    
    if (!username.trim()) {
      newErrors.username = "Username is required";
    }
    
    if (!password.trim()) {
      newErrors.password = "Password is required";
    }
    
    if (newErrors.username || newErrors.password) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    const result = await UserUtils.loginUser(username, password);
    if (result.success) {
      setUsername("");
      setPassword("");

      localStorage.setItem('jwt_token', result.data || '');
      alert(`Login successful! Welcome back, ${username}!`);

      onLoginSuccess?.(username);
    } 
    else {
      setErrors({ ...newErrors, general: result.message });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Log In</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input 
            placeholder="Enter Username" 
            className={`w-full h-12 ${errors.username ? 'border-red-500' : ''}`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isSubmitting}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>
        
        <div>
          <PasswordInput 
            placeholder="Enter Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            className={`w-full h-12 ${errors.password ? 'border-red-500' : ''}`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}
        
        <Button 
          type="submit" 
          className="w-full h-12 mt-6"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Submit"}
        </Button>
        
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <button 
            type="button"
            onClick={onSwitchToRegister}
            className="text-blue-500 hover:underline focus:outline-none cursor-pointer"
            disabled={isSubmitting}
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
