import { createContext, useState, ReactNode, useContext } from 'react';

const Context = createContext<any | null>("")

export const ContextProvider = () => useContext(Context);

export const AppContext: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messageView, setMessageView] = useState(null);

  const value = {
    messageView, setMessageView,
  }

  return (
    <Context.Provider value={value as any}>
      {children}
    </Context.Provider>
  );
};
