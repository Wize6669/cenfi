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
          className="peer w-full h-[35px] p-2 placeholder-gray-400 text-gray-700 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-20
          peer-valid:border-green-500 peer-invalid:border-pink-600"
          type={showPassword ? 'text' : 'password'}
          name={'password'}
          value={password}
          onChange={handleGetDataInput}
          placeholder={'Ingresa la contraseña'}
          required={true}
          style={{height: '35px'}}
          minLength={8}
        />
        <button
          type={'button'}
          className={'absolute inset-y-0 right-2 flex items-center'}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <Eye
              className={'w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 hover:scale-110'}/>
          ) : (
            <EyeOff
              className={'w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 hover:scale-110'}/>
          )}
        </button>
        <p className="absolute invisible peer-focus:peer-invalid:visible text-pink-600 text-xs">
          La contraseña debe tener al menos 8 caracteres.
        </p>
      </div>
    </div>
  );
};

export {PasswordInput}
