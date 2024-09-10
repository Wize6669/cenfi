import React, {ChangeEvent, useState} from "react";
import {Eye, EyeOff} from "lucide-react";

interface PasswordInputProps {
  password: string | undefined;
  handleGetDataInput: (event: ChangeEvent<HTMLInputElement>) => void
}

const PasswordInput = ({password, handleGetDataInput}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col mb-3">
      <label className="text-md font-medium" htmlFor="password">
        Contraseña
      </label>
      <div className="relative">
        <input
          className="border rounded-md p-2 w-full pr-10 transition-all ease-in-out duration-200 focus:ring-2 focus:ring-blue-500"
          type={showPassword ? 'text' : 'password'}
          placeholder={'Ingresa tu contraseña'}
          name={'password'}
          value={password}
          onChange={handleGetDataInput}
          style={{width: '385px', height: '35px'}}
          required={true}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-2 flex items-center"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4 text-gray-400 transition-transform duration-200 hover:scale-110" />
          ) : (
            <Eye className="w-4 h-4 text-gray-400 transition-transform duration-200 hover:scale-110" />
          )}
        </button>
      </div>
    </div>
  );
};

export { PasswordInput }
