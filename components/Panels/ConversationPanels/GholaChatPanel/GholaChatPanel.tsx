import { Text, Card, Textarea, Button, Paper, Divider, Stack, ScrollArea, Skeleton, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

export function GholaChatPanel({ messages, setMessages, generating }: { messages: Message[], setMessages: Dispatch<SetStateAction<Message[]>>, generating: boolean}) {

    const theme = useMantineTheme();
    let isMobile = useMediaQuery('(max-width: 768px)');
    const [message, setMessage] = useState<string>('');

    useEffect(() => {scrollToBottom()}, [messages]);
    useEffect(() => {generating && scrollToBottom()}, [generating]);

    const viewport = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {viewport.current?.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });}

    const updateConversation = () => {
        setMessages([...messages, {
            role: 'user',
            content: message
        }]);
        setMessage('');
    }

    return (
        <>
            <Card shadow='md' style={isMobile ? {minWidth: '100%'} : {minWidth: '100%'}}>
                <ScrollArea style={isMobile ? {display: 'flex', flexDirection: 'column', height: '60vh', zIndex: 2077} : {display: 'flex', flexDirection: 'column', height: '583px', zIndex: 2077}} viewportRef={viewport} offsetScrollbars>
                    {messages.length ? messages.map((message, index) => {
                        return (
                            <>
                                {message.role === 'user' 
                                    ? 
                                    <Paper px={8} py={3} radius='sm' mb='lg' style={isMobile ? {width: 'max-content', maxWidth: '30ch', marginLeft: 'auto', background: '#9C36B5'} : {width: 'max-content', maxWidth: '50ch', marginLeft: 'auto', background: '#9C36B5'}} shadow='xl'>
                                        <Text color='#fafafa'>{message.content}</Text>
                                    </Paper>
                                    : 
                                    <Paper px={8} py={3} radius='sm' mb='lg' style={isMobile ? {width: 'max-content', maxWidth: '30ch', marginRight: 'auto'} : {width: 'max-content', maxWidth: '50ch', marginRight: 'auto'}} shadow='xl' withBorder>
                                        <Text>{message.content}</Text>
                                    </Paper>
                                }
                            </>
                        );
                    })
                        : 
                           !generating && <Stack style={isMobile ? {height: '60vh'} : {height: '583px'}} justify='center'>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                        {!isMobile && <h1 style={theme.colorScheme === 'dark' ? {color: theme.white, fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900, fontSize: 32, lineHeight: 1.2, textAlign: 'center'} : {color: theme.black, fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900, fontSize: 32, lineHeight: 1.2, textAlign: 'center'}}>You don't have any messages yet.</h1>}
                        <h2 style={theme.colorScheme === 'dark' ? {color: theme.white, fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900, fontSize: 32, lineHeight: 1.2, textAlign: 'center'} : {color: theme.black, fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900, fontSize: 32, lineHeight: 1.2, textAlign: 'center'}}>Send a message to get started.</h2>
                    </div>
                            </Stack>
                    }
                    {generating && <Skeleton px={8} py={3} radius='sm' mb='lg' width={isMobile ? '74%' : '45%'} height={35} style={{marginRight: 'auto'}} />}
                </ScrollArea>
                <Divider mb='sm' mt='md' />
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'start', gap: '10px'}}>
                    <div style={{width: '100%'}}>
                        <Textarea  minRows={1} maxRows={3} value={message} onChange={(event) => setMessage(event.currentTarget.value.slice(0, 1000))} autosize/>
                        <div style={{position: 'relative', display: 'flex', justifyContent: 'end', marginBottom: -10}}><Text size='xs' color='dimmed'>{message?.length}/1000</Text></div>
                    </div>
                    <Button color='grape' size='md' onClick={() => {updateConversation()}} loading={generating}>Send</Button>
                </div>
            </Card>
        </>
    );
}