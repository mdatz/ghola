import { useMediaQuery } from '@mantine/hooks';
import { Divider, Grid, Center, ActionIcon } from '@mantine/core';
import { useRouter } from 'next/router';
import { ColorSchemeToggle } from '../../Buttons/ColorSchemeToggle/ColorSchemeToggle';
import { IconArrowLeft } from '@tabler/icons';
import { LogOutButton } from '../../Buttons/LogOutButton/LogOutButton';
import { useSession } from 'next-auth/react';
import { useConversationContext } from '../../../context/ConversationContext';

export function Header({back = false}) {

    const { selectedProfile, setSelectedProfile } = useConversationContext();
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
                                    <IconArrowLeft size={24} stroke={1.5} />
                                </ActionIcon>
                            </div>
                        : status === 'authenticated' &&
                            <div style={{display: 'flex', justifyContent: 'flex-start', paddingLeft: '1rem'}}>
                                <LogOutButton />
                            </div>
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
                            <ColorSchemeToggle/>
                        </div>
                    </Grid.Col>
                </>
            </Grid>
            <Divider/>
        </>
    );
}