import { Search } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const TextInputVariant = ['primary', 'basic'] as const;

type TextInputProps = {
  icon?: boolean;
  variant?: (typeof TextInputVariant)[number];
  wrapperClassName?: string;
  inputClassName?: string;
} & React.ComponentPropsWithRef<'input'>;

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      icon = true,
      children,
      wrapperClassName,
      inputClassName,
      variant = 'primary',
      disabled: inputDisabled,
      ...rest
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          'flex items-center w-full max-w-xl px-4 py-2',
          'bg-white border border-gray-300 rounded-full shadow-sm',
          'focus-within:shadow-lg transition-shadow',
          wrapperClassName
        )}
      >
        {icon && <Search className='w-5 h-5 text-gray-500 mr-3' />}
        <input
          ref={ref}
          type='text'
          disabled={inputDisabled}
          className={cn(
            'flex-grow bg-transparent outline-none text-gray-800 placeholder-gray-400 border-none',
            //#region  //*=========== Variant ===========
            variant === 'primary' && [
              'text-primary-500 hover:text-primary-600 active:text-primary-700',
              'disabled:text-primary-200',
            ],
            variant === 'basic' && [
              'text-black hover:text-gray-600 active:text-gray-800',
              'disabled:text-gray-300',
            ],
            //#endregion  //*======== Variant ===========
            'disabled:cursor-not-allowed disabled:brightness-105 disabled:hover:underline',
            inputClassName
          )}
          {...rest}
        >
          {children}
        </input>
      </div>
    );
  }
);

export default TextInput;
