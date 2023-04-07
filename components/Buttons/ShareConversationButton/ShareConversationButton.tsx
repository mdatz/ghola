import { useMantineColorScheme, ActionIcon, Group, Modal, Text, Button, Center, ThemeIcon, Divider, List } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { TbMessageShare, TbMessage2Share } from 'react-icons/tb';
import { useState } from 'react';
import Axios from 'axios';
import { useMediaQuery } from '@mantine/hooks';
import { useConversationContext } from '../../../context/ConversationContext';


export function ShareConversationButton({highlightedMessages, messages}: {highlightedMessages: SelectedMessage[], messages: Message[]}) {

  const { selectedProfile } = useConversationContext();
  const { colorScheme } = useMantineColorScheme();

  const mobile = useMediaQuery(`(max-width: 768px)`);
  const [modalOpened, setModalOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  const shareConversation = () => {
    setLoading(true);
    const orderedMessages = highlightedMessages.sort((a, b) => a.index - b.index);
    Axios.post('/api/conversations/share', {
      messages: messages,
      profile: selectedProfile,
      highlightedMessages: orderedMessages,
    }).then((response) => {
      showNotification({
        title: 'Success',
        message: 'Conversation shared successfully! Thank you for being part of the ghola community!',
        autoClose: 5000,
        color: 'green'
      });
    }).catch((error) => {
      console.log(error);
      showNotification({
        title: 'Error',
        message: 'An error occurred while sharing your conversation. Please try again later.',
        autoClose: 3000,
        color: 'red'
      })
    }).finally(() => {
      setLoading(false);
      setModalOpened(false);
    });
  }

  return (
    <>
      <Group position="center" my="xs">
        <ActionIcon
          onClick={() => {setModalOpened(true)}}
          size={mobile ? 52 : 64}
          radius="xl"
          variant='filled'
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
            color: theme.colorScheme === 'dark' ? theme.colors.grape[6] : theme.colors.grape[6],
          })}
        >
          {colorScheme === 'dark' ? <TbMessageShare size={32} /> : <TbMessageShare size={32}/> }
        </ActionIcon>
      </Group>
      <Modal opened={modalOpened} onClose={() => {setModalOpened(false)}} transition='slide-down'>
        <Center mt={-30}>
          <ThemeIcon size={100} radius={50} variant='outline' color='grape'>
            <TbMessage2Share size={45}/>
          </ThemeIcon>
        </Center>
        <Text my='md' align='center' weight={600}>Share Highlighted Conversation?</Text>
        <Text mb='sm' align='justify' size='sm'>To ensure the privacy and security of all community members, please do not share any messages that contain sensitive or personal information such as:</Text>
        <List size='sm' mb='sm' px='xl'>
          <List.Item>Your full name or the full name of another individual</List.Item>
          <List.Item>Addresses or other contact information</List.Item>
          <List.Item>Financial information such as credit card numbers or bank account details</List.Item>
          <List.Item>Passwords or login credentials</List.Item>
          <List.Item>Health information or medical history</List.Item>
          <List.Item>Any other information that you would not feel comfortable sharing publicly</List.Item>
        </List>
        <Text mt='sm' align='justify' size='sm'>Are you sure you want to share this selected conversation to the Community Highlights Reel? This will make the conversation visible to all community members.</Text>
        <Divider mt='md' mb='md'/>
        <Group grow>
          <Button color='gray' onClick={() => {setModalOpened(false)}}>Cancel</Button>
          <Button color='grape' loading={loading} onClick={() => {shareConversation()}}>Share</Button>
        </Group>
      </Modal>
    </>
  );
}