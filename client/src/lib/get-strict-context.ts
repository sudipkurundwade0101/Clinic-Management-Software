import * as React from 'react';

export function getStrictContext<T>(
  name = 'Context'
): [React.Provider<T | undefined>, () => T] {
  const Context = React.createContext<T | undefined>(undefined);
  Context.displayName = name;

  function useStrictContext() {
    const context = React.useContext(Context);
    if (context === undefined) {
      throw new Error(`use${name} must be used within a ${name}Provider`);
    }
    return context;
  }

  return [Context.Provider, useStrictContext];
}
