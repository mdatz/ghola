import { useEffect, useState } from 'react';
import { Header } from '../components/General/Header/Header';
import { ExplorePanels } from '../components/Panels/ExplorePanels/ExplorePanels';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Pagination, Center } from '@mantine/core';
import useSWR from 'swr';


const fetcher = async(input:RequestInfo, init:RequestInit) => {
  const res = await fetch(input, init); 
  return res.json();
};

export default function Dashboard() {

    const { data: session, status } = useSession();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { data: profiles, error: profilesError } = useSWR(session ? `/api/profile/public?page=${page}` : null, fetcher);
    const { data: totalProfiles, error: totalProfilesError } = useSWR(session ? `/api/profile/public?total=pls` : null, fetcher);
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status]);

    useEffect(() => {
        if (totalProfiles?.data) {
            setTotalPages(Math.ceil(totalProfiles?.data / 12));
        }
    }, [totalProfiles]);

    return (
        <>
            <div className='fullscreen'>
                <Header/>
                <ExplorePanels profiles={profiles?.data}/>
                <Center style={{position: 'fixed', bottom: 45, right: 0, left: 0}}>
                    <Pagination total={totalPages} page={page} onChange={setPage} color='grape'/>
                </Center>
            </div>
        </>
    );
}