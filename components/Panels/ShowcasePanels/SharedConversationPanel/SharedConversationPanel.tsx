import { Text, Card, Textarea, Button, Paper, Divider, ScrollArea, Skeleton, useMantineTheme, ActionIcon, Flex } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { ShareConversationButton } from '../../../Buttons/ShareConversationButton/ShareConversationButton';
import { useConversationContext } from '../../../../context/ConversationContext';
import Axios from 'axios';
import useSWR from 'swr';
import { TbHeart, TbHeartFilled } from 'react-icons/tb';


const fetcher = async(input:RequestInfo, init:RequestInit) => {
    const res = await fetch(input, init); 
    return res.json();
};

export function  SharedConversationPanel({ index, key, setTotalCount }: { index: number, key: number, setTotalCount: Dispatch<SetStateAction<number>> }) {

    const theme = useMantineTheme();
    let isMobile = useMediaQuery('(max-width: 768px)');
    const { selectedProfile, setSelectedProfile } = useConversationContext();
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [generating, setGenerating] = useState<boolean>(false);
    const [liked, setLiked] = useState<boolean>(false);
    const [likeCount, setLikeCount] = useState<number>(0);
    const [likeTimeout, setLikeTimeout] = useState<NodeJS.Timeout | null>(null);
    const [selectedMessages, setSelectedMessages] = useState<SelectedMessage[]>([]);

    const { data: conversation, error: conversationError } = useSWR(`/api/conversations/share?page=`+index, fetcher);

    useEffect(() => {scrollToBottom()}, [messages]);
    useEffect(() => {generating && scrollToBottom()}, [generating]);
    useEffect(() => {
        if(conversation?.sharedConversation) {
            setSelectedProfile(conversation?.sharedConversation.profile);
            let _: Message[] = [];
            conversation?.sharedConversation.messages.forEach((messageItem: {message: Message, index: number}) => {
                _.push(messageItem.message);
            });
            setMessages(_);
            setLikeCount(conversation?.sharedConversation.likeCount);
        }
        if(conversation?.totalCount) {
            setTotalCount(conversation?.totalCount);
        }
    }, [conversation]);

    const viewport = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {viewport.current?.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });}

    const updateConversation = () => {
        setMessages([...messages, {
            role: 'user',
            content: message
        }]);
        setMessage('');
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

    const addLike = () => {
        let value: number;
        if(!liked) {
            setLikeCount(likeCount + 1);
            value = 1;
        } else {
            setLikeCount(likeCount - 1);
            value = -1;
        }
        setLiked(!liked);

        if(likeTimeout) {
            clearTimeout(likeTimeout);
        }

        setLikeTimeout(setTimeout(() => {
            Axios.post('/api/conversations/like', {
                conversationId: conversation?.sharedConversation._id,
                count: value
            }).then((response) => {
                console.log('Like response: ', response);
            }).catch((error) => {
                console.log('Like error: ', error);
            });
        }, 2000));
    }

    useEffect(() => {
        if (messages.length && messages[messages.length - 1].role === 'user') {
            setGenerating(true);
            Axios.post('/api/generate', {
                messages: messages,
                profile: selectedProfile
            }).then((response) => {
                setMessages([...messages, {
                    role: 'assistant',
                    content: response.data.message
                }]);
            }).catch((error) => {
                if(error.response.status === 400) {
                    if(error.response.data.scores){
                        console.log('Moderation Categories: ', error.response.data.categories);
                        console.log('Moderation Scores: ', error.response.data.scores);
                        setMessages(messages.slice(0, messages.length - 1));
                        showNotification({
                            title: 'Error',
                            message: 'This conversation is not ideal...Please try again...',
                            autoClose: 3000,
                            color: 'red'
                        });
                    } else {
                        showNotification({
                            title: 'Error',
                            message: 'Bad Request. Please try again later.',
                            autoClose: 3000,
                            color: 'red'
                        });
                    } 
                } else {
                    showNotification({
                        title: 'Error',
                        message: 'An error occurred while generating a response. Please try again later.',
                        autoClose: 3000,
                        color: 'red'
                    })
                }
            }).finally(() => {
                setGenerating(false);
            }); 
        }
    }, [messages]);

    return (
        <Flex direction='column'>
            <Card shadow='md' style={isMobile ? {minWidth: '91vw'} : {minWidth: '40vw'}}>
                {messages.length && 
                    <ScrollArea style={isMobile ? {display: 'flex', flexDirection: 'column', height: '50vh', zIndex: 1} : {display: 'flex', flexDirection: 'column', height: '583px', zIndex: 1}} viewportRef={viewport} offsetScrollbars>
                        {messages.map((message, index) => {
                            return (
                                <div key={index}>
                                    {message.role === 'user' 
                                        ? 
                                        <Paper px={8} py={3} radius='sm' mb='lg' style={isMobile ? (isSelected(index) ? {width: 'max-content', maxWidth: '30ch', marginLeft: 'auto', background: '#9C36B5', border: '2px solid #ae3ec9'} : {width: 'max-content', maxWidth: '30ch', marginLeft: 'auto', background: '#9C36B5'}) : (isSelected(index) ? {width: 'max-content', maxWidth: '50ch', marginLeft: 'auto', background: '#9C36B5', border: '2px solid #ae3ec9'} : {width: 'max-content', maxWidth: '50ch', marginLeft: 'auto', background: '#9C36B5'})} onClick={() => {selectMessage(message, index)}} shadow='xl'>
                                            <Text color='#fafafa'>{message.content}</Text>
                                        </Paper>
                                        : 
                                        <Paper px={8} py={3} radius='sm' mb='lg' style={isMobile ? (isSelected(index) ? {width: 'max-content', maxWidth: '30ch', marginRight: 'auto', border: '2px solid #ae3ec9'} : {width: 'max-content', maxWidth: '30ch', marginRight: 'auto'}) : (isSelected(index) ? {width: 'max-content', maxWidth: '50ch', marginRight: 'auto', border: '2px solid #ae3ec9'} : {width: 'max-content', maxWidth: '50ch', marginRight: 'auto'})} onClick={() => {selectMessage(message, index)}} shadow='xl' withBorder>
                                            <Text>{message.content}</Text>
                                        </Paper>
                                    }
                                </div>
                            )})
                        }
                        {generating && <Skeleton px={8} py={3} radius='sm' mb='lg' width={isMobile ? '74%' : '45%'} height={35} style={{marginRight: 'auto'}} />}
                    </ScrollArea>
                }
                {!messages.length &&
                    <Flex direction='column' style={isMobile ? {height: '60vh'} : {height: '583px'}} justify='top' gap='md'>
                        <Skeleton w={isMobile ? '85%' : '65%'} h={50}/>
                        <Skeleton w={isMobile ? '85%' : '65%'} h={50} style={{alignSelf: 'end'}}/>
                        <Skeleton w={isMobile ? '85%' : '65%'} h={50}/>
                    </Flex>
                }
                <Divider mb='sm' mt='md' />
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px'}}>
                    <Textarea style={{width: '100%'}} minRows={1} maxRows={3} value={message} onChange={(event) => setMessage(event.currentTarget.value)} autosize/>
                    <Button color='grape' onClick={() => {updateConversation()}} loading={generating}>Send</Button>
                </div>
            </Card>
            <Flex mt={4} align='center' justify='end'>
                <Text color='dimmed' mr={2}>{likeCount}</Text>
                <ActionIcon size='lg' radius='xl' onClick={() => {addLike()}}>
                    {liked ? <TbHeartFilled size={20}/> : <TbHeart size={20}/>}
                </ActionIcon>
            </Flex>
            {selectedMessages.length > 2 && 
                <div style={{position: 'fixed', bottom: '10px', right: '10px', zIndex: 2077}}>
                    <ShareConversationButton highlightedMessages={selectedMessages} messages={messages}/>
                </div>
            }
        </Flex>
    );
}