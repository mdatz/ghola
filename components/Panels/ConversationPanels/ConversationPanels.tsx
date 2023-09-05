import { useMediaQuery } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { AttributePanel } from './AttributePanel/AttributePanel';
import { ConversationPanel } from './ConversationPanel/ConversationPanel';
import { Quote } from './Quote/Quote';
import Axios from 'axios';
import { Card, Flex } from '@mantine/core';
import { useConversationContext } from '../../../context/ConversationContext';

export function ConversationPanels() {
    
    let isMobile = useMediaQuery('(max-width: 768px)');
    const { selectedProfile } = useConversationContext();
    
    const [messages, setMessages] = useState<Message[]>([]);
    const [profile, setProfile] = useState<Profile | null>(selectedProfile);
    const [generating, setGenerating] = useState<boolean>(false);

    useEffect(() => {
        if (messages.length && messages[messages.length - 1].role === 'user') {
            setGenerating(true);
            Axios.post('/api/generate', {
                messages: messages,
                profile: profile
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

    useEffect(() => {
        if(profile && !generating) {
            setGenerating(true);
            Axios.post('/api/generate', {
                messages: messages,
                profile: profile
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
                        message: 'An error occurred while generating a greeting message. Please try again later.',
                        autoClose: 3000,
                        color: 'red'
                    })
                }
            }).finally(() => {
                setGenerating(false);
            }); 
        }
    }, [])

    return (
        <>
        {isMobile ?
            <div style={{overflow: 'hidden'}}>
            <Flex direction='column' py='xl' px='xs' style={{height: '80vh'}}>
                <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <ConversationPanel messages={messages} setMessages={setMessages} generating={generating}/>
                </div>
            </Flex>
            </div>
        :
            <div style={{height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: '-6rem'}}>
                <Flex direction='row' align='start' gap={16}>
                    <Card shadow='md' pt={5} style={isMobile ? {} : {width: '300px'}}>
                        <AttributePanel profile={profile} setProfile={setProfile}/>
                    </Card>
                    <ConversationPanel messages={messages} setMessages={setMessages} generating={generating}/>
                </Flex>
                <div style={{position: 'absolute', bottom: '40px', left: '20px', zIndex: -1}}>
                    <Quote/>                
                </div>
            </div>
        }
    </>
    );
}