import { useEffect } from 'react';
import { Header } from '../components/General/Header/Header';
import { ShowcasePanels } from '../components/Panels/ShowcasePanels/ShowcasePanels';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';


export default function Showcase() {

    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status]);

    return (
        <div className='fullscreen'>
            <Header back={true}/>
            <ShowcasePanels/>
        </div>
    );
}