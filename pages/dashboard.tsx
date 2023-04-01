import { useEffect } from 'react';
import { Header } from '../components/General/Header/Header';
import { CharacterPanels } from '../components/Panels/CharacterPanels/CharacterPanels';
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

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status]);

    return (
        <div className='fullscreen'>
            <Header/>
            <CharacterPanels profiles={profiles?.data}/>
        </div>
    );
}