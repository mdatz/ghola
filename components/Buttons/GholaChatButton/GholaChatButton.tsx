import { useMantineColorScheme, ActionIcon, Group, Modal, Title } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { TbMessageChatbot } from 'react-icons/tb';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import { useMediaQuery } from '@mantine/hooks';
import { GholaChatPanel } from '../../Panels/ConversationPanels/GholaChatPanel/GholaChatPanel';

export function GholaChatButton() {

  const { colorScheme } = useMantineColorScheme();

  const mobile = useMediaQuery(`(max-width: 768px)`);
  const [modalOpened, setModalOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleClick = () => {
    if(initialized) {
      setModalOpened(true);
      return;
    }

    setLoading(true);
    Axios.post('/api/ghola-bot/init').then((response) => {
      setInitialized(true);
      setModalOpened(true);
    }).catch((error) => {
      console.log(error);
      showNotification({
        title: 'Server Error',
        message: 'An error occurred initializing the chat. Please try again later.',
        autoClose: 5000,
        color: 'red'
      })
    }).finally(() => {
      setLoading(false);
    });
  }

  useEffect(() => {
    if(!initialized) return;
    if(messages.length && messages[messages.length - 1].role === 'assistant') return;
    setGenerating(true);
    Axios.post('/api/v1/chat', {
      messages: messages
    }).then((response) => {
      if(!response.data.message) {
        showNotification({
          title: 'Server Error',
          message: 'An error occurred generating the chat. Please try again later.',
          autoClose: 5000,
          color: 'red'
        })
        return;
      }
      setMessages([...messages, {role: "assistant", content: response.data.message}]);
    }).catch((error) => {
      console.log(error);
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
              title: 'Server Error',
              message: 'An error occurred generating the chat. Please try again later.',
              autoClose: 5000,
              color: 'red'
            });
        }
      } 
    }).finally(() => {
      setGenerating(false);
    });
  }, [initialized, messages]);
  
  return (
    <>
      <Group position="center" my="xs">
        <ActionIcon
          onClick={() => {handleClick()}}
          loading={loading}
          size={mobile ? 52 : 60}
          radius="xl"
          variant='filled'
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
            color: theme.colorScheme === 'dark' ? theme.colors.grape[6] : theme.colors.grape[6],
          })}
        >
          {colorScheme === 'dark' ? <TbMessageChatbot size={32} /> : <TbMessageChatbot size={32}/> }
        </ActionIcon>
      </Group>
      <Modal title={<Title order={3}>Ghola Chat Bot</Title>} size={'800px'} opened={modalOpened} onClose={() => {setModalOpened(false)}} transition='slide-down'>
          <GholaChatPanel messages={messages} setMessages={setMessages} generating={generating}/>
      </Modal>
    </>
  );
}