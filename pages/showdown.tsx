import { useEffect } from 'react';
import { Header } from '../components/General/Header/Header';
import { ShowdownPanels } from '../components/Panels/ShowdownPanels/ShowdownPanels';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';


export default function Showdown() {

    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
        if(status === 'authenticated' && session?.user?.role !== 'admin') {
            router.push('/explore');
        }
    }, [status, session]);

    return (
        <div className='fullscreen'>
            <Header back={true}/>
            <ShowdownPanels/>
        </div>
    );
}