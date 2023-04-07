import { useMantineColorScheme, ActionIcon, Group, Modal, TextInput, Textarea, SegmentedControl, Center, Paper, Avatar, Button } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconUserPlus } from '@tabler/icons';
import { useState } from 'react';
import Axios from 'axios';
import useSWR from 'swr';
import { useMediaQuery } from '@mantine/hooks';

const fetcher = async(input:RequestInfo, init:RequestInit) => {
  const res = await fetch(input, init); 
  return res.json();
};

export function HighlightConversationButton({highlightedMessages}: {highlightedMessages: SelectedMessage[]}) {

  const { mutate: updateProfiles } = useSWR('/api/profile', fetcher);
  
  const { colorScheme } = useMantineColorScheme();

  const mobile = useMediaQuery(`(max-width: 768px)`);
  const [modalOpened, setModalOpened] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileImage, setNewProfileImage] = useState('');
  const [newProfileDescription, setNewProfileDescription] = useState('');
  const [newProfileVisibility, setNewProfileVisibility] = useState('private');
  const [loading, setLoading] = useState(false);

  const createProfile = () => {
    console.log(highlightedMessages);
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
          {colorScheme === 'dark' ? <IconUserPlus size={32} /> : <IconUserPlus size={32}/> }
        </ActionIcon>
      </Group>
      <Modal
        opened={modalOpened}
        onClose={() => {setModalOpened(false)}}
        title="Create New Profile"
        size="sm"
        transition="slide-down">
        <Center>
            <Paper radius={100} shadow='xl' withBorder>
                <Avatar src={newProfileImage} size={200} radius={100}/>
            </Paper>
        </Center>
        <div style={{display: 'flex', justifyContent: 'end'}}>
          <SegmentedControl
            mt='sm'
            data={[
              { label: 'Private', value: 'private' },
              { label: 'Public', value: 'public' },
            ]}
            value={newProfileVisibility}
            onChange={setNewProfileVisibility}
          />
        </div>
        <TextInput
          label="Profile Name"
          placeholder="Enter a name for your profile"
          value={newProfileName}
          onChange={(event) => {setNewProfileName(event.currentTarget.value)}}
        />
        <TextInput
          label="Profile Image"
          placeholder="Enter a URL for your profile image"
          value={newProfileImage}
          onChange={(event) => {setNewProfileImage(event.currentTarget.value)}}
          mt='sm'
        />
        <Textarea
          label="Profile Description"
          placeholder="Enter a detailed description of the character to emulate"
          value={newProfileDescription}
          onChange={(event) => {setNewProfileDescription(event.currentTarget.value)}}
          minRows={4}
          maxRows={6}
          autosize
          mt='sm'
        />
        <Button mt='xl' color='grape' onClick={() => {createProfile()}} loading={loading} fullWidth>Create Profile</Button>
      </Modal>
    </>
  );
}