import { useEffect, useState } from 'react';
import { Header } from '../components/General/Header/Header';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const fetcher = async(input:RequestInfo, init:RequestInit) => {
  const res = await fetch(input, init); 
  return res.json();
};

export default function Developer() {

    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
        if (session?.user?.role !== 'admin') {
            router.push('/explore');
        }
    }, [status, session]);

    return (
        <>
            <div className='fullscreen'>
                <Header/>
            </div>
        </>
    );
}