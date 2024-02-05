import { Text, Card, Textarea, Button, Paper, Divider, Stack, ScrollArea, Skeleton, useMantineTheme, ActionIcon, Avatar, Flex } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { ShareConversationButton } from '../../../Buttons/ShareConversationButton/ShareConversationButton';
import { TbPlayerPause, TbPlayerPlay } from 'react-icons/tb';

export function GroupConversationPanel({ messages, setMessages, generating, paused, setPaused }: { messages: Message[], setMessages: Dispatch<SetStateAction<Message[]>>, generating: boolean, paused: boolean, setPaused: Dispatch<SetStateAction<boolean>>}) {

    const theme = useMantineTheme();
    let isMobile = useMediaQuery('(max-width: 768px)');
    const [message, setMessage] = useState<string>('');
    const [selectedMessages, setSelectedMessages] = useState<SelectedMessage[]>([]);

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
        if(paused) {
            setPaused(false);
        }
    }

    const selectMessage = (message : Message, index : number) => {
        const selectedMessage = { message, index };
        if (selectedMessages.some((msg) => msg.index === index)) {
          setSelectedMessages(selectedMessages.filter((msg) => msg.index !== index));
        } else {
          setSelectedMessages([...selectedMessages, selectedMessage]);
        }
    }

    const isSelected = (index : number) => {
        return selectedMessages.some((msg) => msg.index === index);
    };

    return (
        <>
            <Card shadow='md' style={isMobile ? {minWidth: '91vw'} : {minWidth: '40vw'}}>
                <ScrollArea style={isMobile ? {display: 'flex', flexDirection: 'column', height: '60vh', zIndex: 2077} : {display: 'flex', flexDirection: 'column', height: '583px', zIndex: 2077}} viewportRef={viewport} offsetScrollbars>
                    {messages.length ? messages.map((message, index) => {
                        return (
                            <>
                                {message.role === 'user' 
                                    ? 
                                    <Paper px={8} py={3} radius='sm' mb='lg' style={isMobile ? (isSelected(index) ? {width: 'max-content', maxWidth: '30ch', marginLeft: 'auto', background: '#9C36B5', border: '2px solid #ae3ec9'} : {width: 'max-content', maxWidth: '30ch', marginLeft: 'auto', background: '#9C36B5'}) : (isSelected(index) ? {width: 'max-content', maxWidth: '50ch', marginLeft: 'auto', background: '#9C36B5', border: '2px solid #ae3ec9'} : {width: 'max-content', maxWidth: '50ch', marginLeft: 'auto', background: '#9C36B5'})} onClick={() => {selectMessage(message, index)}} shadow='xl'>
                                        <Text color='#fafafa'>{message.content}</Text>
                                    </Paper>
                                    :
                                    <>
                                        <Flex align='flex-end' justify='flex-start'>
                                            <Avatar src={message.profileImage} radius='xl' mb={4}/>
                                            <Text size='xs' color='dimmed' ml={4}>{message.profileName}</Text>
                                        </Flex>
                                        <Paper px={8} py={3} radius='sm' mb='lg' style={isMobile ? (isSelected(index) ? {width: 'max-content', maxWidth: '30ch', marginRight: 'auto', border: '2px solid #ae3ec9'} : {width: 'max-content', maxWidth: '30ch', marginRight: 'auto'}) : (isSelected(index) ? {width: 'max-content', maxWidth: '50ch', marginRight: 'auto', border: '2px solid #ae3ec9'} : {width: 'max-content', maxWidth: '50ch', marginRight: 'auto'})} onClick={() => {selectMessage(message, index)}} shadow='xl' withBorder>
                                            <Text>{message.content}</Text>
                                        </Paper>
                                    </>
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
                        <Textarea  minRows={1} maxRows={3} value={message} onFocus={() => {setPaused(true)}} onChange={(event) => setMessage(event.currentTarget.value.slice(0, 1000))} autosize/>
                        <div style={{position: 'relative', display: 'flex', justifyContent: 'end', marginBottom: -10}}><Text size='xs' color='dimmed'>{message?.length}/1000</Text></div>
                    </div>
                    {isMobile ?
                        <ActionIcon size='md' onClick={() => {setPaused(!paused)}} style={{marginTop: '7px'}}>
                            {paused ? <TbPlayerPlay size={22}/> : <TbPlayerPause size={22}/>}
                        </ActionIcon>
                        :
                        <Button color='grape' variant='outline' size='md' leftIcon={paused ? <TbPlayerPlay size={20}/> : <TbPlayerPause size={20}/>} onClick={() => {setPaused(!paused)}}>{paused ? 'Resume' : 'Pause'}</Button>
                    }
                    <Button color='grape' size='md' onClick={() => {updateConversation()}} loading={generating}>Send</Button>
                </div>
            </Card>
            {selectedMessages.length > 2 && 
                <div style={{position: 'fixed', bottom: '10px', right: '10px', zIndex: 2077}}>
                    <ShareConversationButton highlightedMessages={selectedMessages} messages={messages}/>
                </div>
            }
        </>
    );
}