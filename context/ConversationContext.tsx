import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';

interface ConversationContextProps {
  selectedProfile: Profile | null;
  setSelectedProfile: Dispatch<SetStateAction<null|Profile>>;
  selectedGroup: Profile[] | null;
  setSelectedGroup: Dispatch<SetStateAction<null|Profile[]>>;
}

interface ConversationProviderProps {
  children: ReactNode;
}

const ConversationContext = createContext<ConversationContextProps>({
  selectedProfile: null,
  setSelectedProfile: () => {},
  selectedGroup: null,
  setSelectedGroup: () => {},
});

export const ConversationProvider: React.FC<ConversationProviderProps> = ({ children }) => {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Profile[] | null>(null);

  return (
    <ConversationContext.Provider value={{ selectedProfile, setSelectedProfile, selectedGroup, setSelectedGroup }}>
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversationContext = () => useContext(ConversationContext);