import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'

const useTogglePasswordVisibility = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const Icon = showPassword ? (
    <Eye className="w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 hover:scale-110" />
  ) : (
    <EyeOff className="w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 hover:scale-110" />
  );

  return {
    showPassword,
    togglePasswordVisibility,
    Icon,
  };
};

export default useTogglePasswordVisibility;
