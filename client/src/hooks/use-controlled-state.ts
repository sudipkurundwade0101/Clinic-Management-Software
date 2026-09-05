import * as React from 'react';

type UseControlledStateOptions<T> = {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
};

export function useControlledState<T>({
  value,
  defaultValue,
  onChange,
}: UseControlledStateOptions<T>): [T, (val: T | ((prev: T) => T)) => void] {
  const [state, setState] = React.useState<T>(
    value !== undefined ? value : (defaultValue as T)
  );

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : state;

  const setValue = React.useCallback(
    (val: T | ((prev: T) => T)) => {
      const nextValue = typeof val === 'function' ? (val as (prev: T) => T)(currentValue) : val;
      if (!isControlled) {
        setState(nextValue);
      }
      onChange?.(nextValue);
    },
    [isControlled, currentValue, onChange]
  );

  return [currentValue, setValue];
}
