import { useEffect, useState } from 'react';
import { Header } from '../components/General/Header/Header';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Card, Center, Container, Divider, Text, Button, Modal, Flex, ScrollArea, ActionIcon, Title, Avatar, Skeleton } from '@mantine/core';
import useSWR from 'swr';
import { showNotification } from '@mantine/notifications';
import { TbAlertCircle } from 'react-icons/tb';
import { useMediaQuery } from '@mantine/hooks';

const fetcher = async(input:RequestInfo, init:RequestInit) => {
    const res = await fetch(input, init); 
    return res.json();
};

export default function Settings() {

    const { data: session, status } = useSession();
    const { data: stats, error: statsError } = useSWR(session ? '/api/user/stats' : null, fetcher);

    const router = useRouter();
    let isMobile = useMediaQuery('(max-width: 768px)');
    const [modalOpened, setModalOpened] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, session]);

    useEffect(() => {
        if (statsError) {
            showNotification({
                title: 'Error',
                message: 'There was an error fetching your stats. Please try again later.',
                color: 'red',
                autoClose: 5000,
            });
        } else if (stats) {
            setLoading(false);
        }
    }, [stats, statsError]);

    const handleDownload = async () => {
        const res = await fetch('/api/user/data');
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'user-data.json';
        link.click();
    }

    const handleDelete = async () => {
        const res = await fetch('/api/user/data', {
            method: 'DELETE',
        });
        if(res.status === 200) {
            signOut({ callbackUrl: '/' });
        }
    }

    return (
        <>
            <div className='fullscreen'>
                <Header back={true}/>
                <Container>
                    <Center>
                    <Flex direction='column'>
                    <Card mt='xl' shadow='sm' p='md' radius='md' style={isMobile ? {width: '96vw', maxWidth: '600px'} : {width: '100%', maxWidth: '600px'}}>
                        <Flex align='center'>
                            {
                                loading ? 
                                <Skeleton width={100} height={100} radius={50}/>
                                :
                                <Flex direction='column'>
                                    <Avatar size={75} radius={50} src={session?.user?.image} style={{margin: 'auto'}}/>
                                    <Text align='center'>{session?.user?.name}</Text>
                                </Flex>
                            }
                            <Divider orientation='vertical' mx='sm'/>
                            <ScrollArea offsetScrollbars>
                                <Flex gap='sm' align='center'>
                                    {loading ? 
                                    <>
                                        <Skeleton width={100} height={100} radius='md'/>
                                        <Skeleton width={100} height={100} radius='md'/>
                                        <Skeleton width={100} height={100} radius='md'/>
                                    </>
                                    :
                                    <>
                                        <Flex direction='column'>
                                            <Title order={3} align='center' style={{margin: 0}}>{stats?.daysActive}</Title>
                                            <Text align='center' color='dimmed'>Days Active</Text>
                                        </Flex>
                                        <Flex direction='column'>
                                            <Title order={3} align='center' style={{margin: 0}}>{stats?.messageCount}</Title>
                                            <Text align='center' color='dimmed'>Total Messages</Text>
                                        </Flex>
                                        <Flex direction='column'>
                                            <Title order={3} align='center' style={{margin: 0}}>{stats?.profileCount}</Title>
                                            <Text align='center' color='dimmed'>Total Profiles</Text>
                                        </Flex>
                                        <Flex direction='column'>
                                            <Title order={3} align='center' style={{margin: 0}}>{stats?.publicProfileCount}</Title>
                                            <Text align='center' color='dimmed'>Public Profiles</Text>
                                        </Flex>
                                        <Flex direction='column'>
                                            <Title order={3} align='center' style={{margin: 0}}>{stats?.privateProfileCount}</Title>
                                            <Text align='center' color='dimmed'>Private Profiles</Text>
                                        </Flex>
                                    </>
                                }
                                </Flex>
                            </ScrollArea>
                        </Flex>
                    </Card>
                    <Card mt='xl' shadow='sm' p='md' pt={0} radius='md' style={{width: '100%', maxWidth: '600px'}}>
                        <Center>
                            <h2>Download user data</h2>
                        </Center>
                        <Divider/>
                        <Text mt='sm'>Easily access a JSON file that contains all your profile information on this platform. This allows you to maintain a copy of your data for your records or future reference at any time.</Text>
                        <Button mt='md' color='grape' onClick={() => {handleDownload()}} fullWidth>Download Data</Button>
                    </Card>
                    <Card mt='xl' shadow='sm' p='md' pt={0} radius='md' style={{width: '100%', maxWidth: '600px'}}>
                        <Center>
                            <h2>Delete user account</h2>
                        </Center>
                        <Divider/>
                        <Text mt='sm'>This action is irreversible and will permanently remove your user account and all associated data from this platform. 
                        <br/><br/>
                        If you're sure about deleting your user account and don't wish to continue using our services, you can initiate the process by clicking 'Delete Account' Please note that all your information, including profiles, usage records, and account settings, will be permanently lost. Make sure to download your user data first if you'd like to retain any information before proceeding.</Text>
                        <Button mt='md' color='red' onClick={() => {setModalOpened(true)}} fullWidth>Delete Account</Button>
                    </Card>
                    </Flex>
                    </Center>
                </Container>
                <Modal opened={modalOpened} onClose={() => setModalOpened(false)} centered>
                    <Center mt={-35}>
                        <ActionIcon color='red' variant='transparent' radius='xl' size={60}>
                            <TbAlertCircle size={50}/>
                        </ActionIcon>
                    </Center>
                    <Center  mt={-20}><h2>Warning</h2></Center>
                    <Text align='center' mt={-10}>You've chosen to delete your user account and all associated data from our platform. This action is irreversible and will result in the permanent loss of all your information, including profiles, usage records, and account settings.
                    <br/><br/>Please take a moment to reconsider your decision. If you have any concerns or if you'd like to download your user data before proceeding, you can do so by clicking 'Download Data' from the previous menu. If you are absolutely sure about deleting your user account, please confirm your choice by clicking 'Confirm' below.</Text>
                    <Divider my='md'/>
                    <Button mt='md' color='red' onClick={() => {handleDelete()}} fullWidth>Confirm</Button>
                </Modal>
            </div>
        </>
    );
}