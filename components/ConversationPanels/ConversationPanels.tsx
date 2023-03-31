import { useMediaQuery, useScrollIntoView } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { AttributePanel } from './AttributePanel/AttributePanel';
import { ConversationPanel } from './ConversationPanel/ConversationPanel';
import { Quote } from './Quote/Quote';
import Axios from 'axios';
import { Card, Flex } from '@mantine/core';

interface ConversationProps {
    selectedProfile: Profile;
}
  
type Message = {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export function ConversationPanels({selectedProfile}: ConversationProps) {
    
    let isMobile = useMediaQuery('(max-width: 768px)');
    //Rewrite this to use alias names for scrollInotView and targetRef
    const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({});
    

    const [messages, setMessages] = useState<Message[]>([]);
    const [profile, setProfile] = useState<Profile>(selectedProfile);
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

    return (
        <>
        {isMobile ?
            <div style={{overflow: 'hidden'}}>
            <Flex direction='column' py='xl' style={{height: '100%'}}>
                <Flex>
                    <div style={{height: '100%', display: 'flex', alignItems: 'center'}}>
                        <div style={{width: '100%'}}>
                            <ConversationPanel messages={messages} setMessages={setMessages} generating={generating}/>
                        </div>
                    </div>
                </Flex>
            </Flex>
            </div>
        :
            <div style={{height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: '-6rem'}}>
                <div style={{display: 'flex', alignItems: 'center', marginRight: '20px'}}>
                    <Card shadow='md' pt={5} style={isMobile ? {} : {width: '300px'}}>
                        <AttributePanel profile={profile} setProfile={setProfile}/>
                    </Card>
                </div>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <ConversationPanel messages={messages} setMessages={setMessages} generating={generating}/>
                </div>
                <div style={{position: 'absolute', bottom: '40px', left: '20px'}}>
                    <Quote/>                
                </div>
            </div>
    }
    </>
    );
}