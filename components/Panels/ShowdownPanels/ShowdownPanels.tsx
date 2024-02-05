import { useMediaQuery } from "@mantine/hooks";
import { Flex } from "@mantine/core";
import { GroupConversationPanel } from "./GroupConversationPanel/GroupConversation";
import { useEffect, useState } from "react";
import Axios from "axios";
import { useConversationContext } from "../../../context/ConversationContext";
import { showNotification } from "@mantine/notifications";

export function ShowdownPanels() {

    let isMobile = useMediaQuery('(max-width: 768px)');
    const { selectedGroup } = useConversationContext();
    
    const [messages, setMessages] = useState<Message[]>([]);
    const [profiles] = useState<Profile[] | null>(selectedGroup);
    const [generating, setGenerating] = useState<boolean>(false);
    const [awaiting, setAwaiting] = useState<boolean>(false);
    const [paused, setPaused] = useState<boolean>(false);

    useEffect(() => {
        if(profiles && !generating && !awaiting && !paused) {
            setGenerating(true);
            setAwaiting(true);
            Axios.post('/api/generate/group', {
                messages: messages,
                profiles: profiles.map((profile) => profile._id)
            }).then((response) => {
                setMessages([...messages, {
                    role: 'assistant',
                    content: response.data.content,
                    profileId: response.data.profileId,
                    profileName: response.data.profileName,
                    profileImage: response.data.profileImage
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
                setTimeout(() => {
                    setAwaiting(false);
                }, Math.floor(Math.random() * 5000) + 5000);
            }); 
        }
    }, [messages, paused, awaiting]);

    return (
    <>
        {isMobile ?
            <div style={{overflow: 'hidden'}}>
            <Flex direction='column' py='xl' px='xs' style={{height: '85vh'}}>
                <div style={{height: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center'}}>
                    <GroupConversationPanel messages={messages} setMessages={setMessages} generating={generating} paused={paused} setPaused={setPaused}/>
                </div>
            </Flex>
            </div>
        :
            <div style={{height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: '-6rem'}}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <GroupConversationPanel messages={messages} setMessages={setMessages} generating={generating} paused={paused} setPaused={setPaused}/>
                </div>
            </div>
    }
    </>
    )
}