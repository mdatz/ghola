import { useEffect } from 'react';
import { Header } from '../components/General/Header/Header';
import { ConversationPanels } from '../components/Panels/ConversationPanels/ConversationPanels';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useConversationContext } from '../context/ConversationContext';


export default function Chat() {

    const { selectedProfile } = useConversationContext();
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status]);

    useEffect(() => {
        if (selectedProfile === null) {
            router.push('/dashboard');
        }
    });

    return (
        <div className='fullscreen'>
            <Header/>
            <ConversationPanels/>
        </div>
    );
}