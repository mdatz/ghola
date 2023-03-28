import { useMantineColorScheme, ActionIcon, Group, Modal, TextInput, Textarea, SegmentedControl, Center, Paper, Avatar, Button } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconUserPlus } from '@tabler/icons';
import { useState } from 'react';
import Axios from 'axios';
import useSWR from 'swr';

const fetcher = async(input:RequestInfo, init:RequestInit) => {
  const res = await fetch(input, init); 
  return res.json();
};

export function AddProfileButton() {

  const { mutate: updateProfiles } = useSWR('/api/profile', fetcher);
  
  const { colorScheme } = useMantineColorScheme();

  const [modalOpened, setModalOpened] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileImage, setNewProfileImage] = useState('');
  const [newProfileDescription, setNewProfileDescription] = useState('');
  const [newProfileVisibility, setNewProfileVisibility] = useState('private');
  const [loading, setLoading] = useState(false);

  const resetValues = () => {
    setNewProfileName('');
    setNewProfileImage('');
    setNewProfileDescription('');
    setNewProfileVisibility('private');
  }

  const createProfile = () => {
    setLoading(true);
    Axios.post('/api/profile', {
      name: newProfileName,
      imageUrl: newProfileImage,
      description: newProfileDescription,
      visibility: newProfileVisibility
    }).then(() => {
      setModalOpened(false);
      resetValues();
      updateProfiles();
      showNotification({
        title: 'Profile Created',
        message: 'Your new profile has been created successfully.',
        color: 'green',
      });
    }).catch((error) => {
      if(error.response.status === 400) {
        showNotification({
          title: 'Error with Profile Request',
          message: 'There was an error with your request. Please check your input values and try again',
          color: 'red',
        });
      } else {
        showNotification({
          title: 'Error Creating Profile',
          message: 'There was an error creating your profile. Please try again later.',
          color: 'red',
        });
      }
    }).finally(() => {
      setLoading(false);
    });
  }

  return (
    <>
      <Group position="center" my="xl">
        <ActionIcon
          onClick={() => {setModalOpened(true)}}
          size={64}
          radius="xl"
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
            color: theme.colorScheme === 'dark' ? theme.colors.green[7] : theme.colors.grape[7],
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