import React, {ChangeEvent, useState} from "react";
import {Eye, EyeOff} from "lucide-react";

interface PasswordInputProps {
  password: string | undefined;
  handleGetDataInput: (event: ChangeEvent<HTMLInputElement>) => void
}

const PasswordInput = ({password, handleGetDataInput}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <div className={'content-end'}>
        <label
          className={'text-base font-medium text-gray-900 dark:text-gray-300'}
          htmlFor={'password'}
        >
          Contraseña
        </label>
      </div>
      <div className="relative">
        <input
          className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full pr-10 transition-all ease-in-out duration-200 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-blue-400"
          type={showPassword ? 'text' : 'password'}
          name={'password'}
          value={password}
          onChange={handleGetDataInput}
          placeholder={'Ingresa una contraseña'}
          required={true}
          style={{height: '35px' }}
        />
        <button
          type={'button'}
          className={'absolute inset-y-0 right-2 flex items-center'}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <Eye className={'w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 hover:scale-110'} />
          ) : (
            <EyeOff className={'w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 hover:scale-110'} />
          )}
        </button>
      </div>
    </div>
  );
};

export { PasswordInput }
