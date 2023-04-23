import { useMediaQuery } from '@mantine/hooks';
import { Divider, Grid, Center, ActionIcon, Burger, Menu } from '@mantine/core';
import { useRouter } from 'next/router';
import { ColorSchemeToggle } from '../../Buttons/ColorSchemeToggle/ColorSchemeToggle';
import { signOut, signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useConversationContext } from '../../../context/ConversationContext';
import { useState } from 'react';
import { TbUsers, TbCompass, TbDoorExit, TbDoorEnter, TbSpy, TbScale, TbArrowLeft, TbMedal } from 'react-icons/tb';

export function Header({back = false}) {

    const { selectedProfile, setSelectedProfile } = useConversationContext();
    const [menuOpen, setMenuOpen] = useState(false);
    const { data: session, status } = useSession();
    let isMobile = useMediaQuery('(max-width: 768px)');
    const router = useRouter();

    return (
        <>
            <Grid align='center' justify='center' my={isMobile ? 4 : 0}>
                <>
                    <Grid.Col span={4}>
                        {(selectedProfile || back) ?
                            <div style={{display: 'flex', justifyContent: 'flex-start', paddingLeft: '1rem'}}>
                                <ActionIcon
                                    onClick={() => {setSelectedProfile(null); router.back();}}
                                    size="xl"
                                    radius="xl"
                                >
                                    <TbArrowLeft size={24} />
                                </ActionIcon>
                            </div>
                        : status === 'authenticated' &&
                            <div style={{display: 'flex', justifyContent: 'flex-start', paddingLeft: '1rem'}}></div>
                        }
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Center>
                            <img src='/logo_dark.png' alt='gganbu logo' onClick={() => {router.push('/')}} style={isMobile ? {width: '60px', marginRight: '5px'} : {cursor: 'pointer', width: '80px', marginRight: '10px'}}/>
                            <h1 className='logo-text' onClick={() => {router.push('/')}}>ghola</h1>
                        </Center>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <div style={{display: 'flex', justifyContent: 'flex-end', paddingRight: '1rem'}}>
                            <Menu onChange={(value) => {setMenuOpen(value)}} offset={isMobile ? 26 : 32} transition={'slide-left'} position='bottom-end'>
                                <Menu.Target>
                                    <Burger opened={menuOpen} onClick={() => {setMenuOpen(!menuOpen)}}/>
                                </Menu.Target>

                                <Menu.Dropdown>
                                    {session && status === 'authenticated' &&
                                        <>
                                            <Menu.Label>Application</Menu.Label>
                                            <Menu.Item mb={2} icon={<TbUsers size={20}/>} onClick={() => {router.push('/dashboard')}}>My Profiles</Menu.Item>
                                            <Menu.Item mb={2} icon={<TbMedal size={20}/>} onClick={() => {router.push('/showcase')}}>Showcase</Menu.Item>
                                            <Menu.Item mb={2} icon={<TbCompass size={20}/>} onClick={() => {router.push('/explore')}}>Explore</Menu.Item>
                                        </>
                                    }
                                    <Menu.Label>Support</Menu.Label>
                                    <Menu.Item mb={2} icon={<TbSpy size={20}/>} onClick={() => {router.push('/privacy')}}>Privacy Policy</Menu.Item>
                                    <Menu.Item mb={2} icon={<TbScale size={20}/>} onClick={() => {router.push('/terms')}}>Terms of Service</Menu.Item>

                                    {(session && status === 'authenticated') ? 
                                        <Menu.Item mb='xs' color='red' icon={<TbDoorExit size={20}/>} onClick={() => {signOut()}}>Sign Out</Menu.Item> 
                                    :
                                        <Menu.Item mb='xs' color='grape' icon={<TbDoorEnter size={20}/>} onClick={() => {signIn('google', {callbackUrl: window.location.origin + '/dashboard'})}}>Sign In / Register</Menu.Item>
                                    }
                                    <Menu.Divider/>
                                    <div style={{width: '180px'}}>
                                        <ColorSchemeToggle/>
                                    </div>
                                </Menu.Dropdown>
                            </Menu>
                        </div>
                    </Grid.Col>
                </>
            </Grid>
            <Divider/>
        </>
    );
}