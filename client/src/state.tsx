import React, { createContext, useContext, useState } from 'react';
import storage from './storage';

const initialState: string = storage.loadToken() || '';

const StateContext = createContext<[string, React.Dispatch<React.SetStateAction<string>>]>([
  initialState,
  () => initialState
]);

type StateProps = {
  children: React.ReactElement;
};

export const StateProvider: React.FC<StateProps> = ({ children }) => {
  const [token, setToken] = useState(initialState);
  return (
    <StateContext.Provider value={[token, setToken]}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateValue = (): [string, React.Dispatch<React.SetStateAction<string>>] => useContext(StateContext);