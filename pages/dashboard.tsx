import { useState, useEffect } from 'react';
import { Header } from '../components/Header/Header';
import { ConversationPanels } from '../components/ConversationPanels/ConversationPanels';
import { CharacterPanels } from '../components/CharacterPanels/CharacterPanels';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useSWR from 'swr';


const fetcher = async(input:RequestInfo, init:RequestInit) => {
  const res = await fetch(input, init); 
  return res.json();
};

export default function Dashboard() {

    const { data: session, status } = useSession();
    const { data: profiles, error: profilesError } = useSWR(session ? '/api/profile' : null, fetcher);
    const router = useRouter();
    const [selectedProfile, setSelectedProfile] = useState<null|Profile>(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status]);

    return (
        <div className='fullscreen'>
            <Header selectedProfile={selectedProfile} setSelectedProfile={setSelectedProfile}/>
            {selectedProfile ?
                <ConversationPanels selectedProfile={selectedProfile}/> :
                <CharacterPanels profiles={profiles?.data} setSelectedProfile={setSelectedProfile}/>
            }
        </div>
        
    );
}