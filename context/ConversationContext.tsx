import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';

interface ConversationContextProps {
  selectedProfile: Profile | null;
  setSelectedProfile: Dispatch<SetStateAction<null|Profile>>;
}

interface ConversationProviderProps {
  children: ReactNode;
}

const ConversationContext = createContext<ConversationContextProps>({
  selectedProfile: null,
  setSelectedProfile: () => {},
});

export const ConversationProvider: React.FC<ConversationProviderProps> = ({ children }) => {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  return (
    <ConversationContext.Provider value={{ selectedProfile, setSelectedProfile }}>
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversationContext = () => useContext(ConversationContext);