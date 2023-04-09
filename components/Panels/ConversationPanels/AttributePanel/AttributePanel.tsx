import { Center, Text, Avatar, Stack, Divider, ThemeIcon, Input, Textarea, Button, Paper, SegmentedControl, ActionIcon, Modal, Group, Skeleton, Title, ScrollArea } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useMediaQuery } from '@mantine/hooks';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { TbTrashX, TbMessageChatbot } from 'react-icons/tb';
import { RiAlarmWarningLine } from 'react-icons/ri';
import { useSession } from 'next-auth/react';
import Axios from 'axios';
import useSWR from 'swr';

interface AttributePanelProps {
    profile: Profile | null;
    setProfile: Dispatch<SetStateAction<Profile>> | Dispatch<SetStateAction<Profile|null>>;
}

const fetcher = async(input:RequestInfo, init:RequestInit) => {
    const res = await fetch(input, init); 
    return res.json();
  };

export function AttributePanel({profile, setProfile}: AttributePanelProps) {

    const {mutate: updateProfiles} = useSWR('/api/profile', fetcher);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [modalOpened, setModalOpened] = useState(false);
    const [originalProfile, setOriginalProfile] = useState<Profile>(JSON.parse(JSON.stringify(profile)));
    const [modified, setModified] = useState(false);
    const [editable, setEditable] = useState<boolean|null>(null);
    const {data: session, status} = useSession();

    useEffect(() => {
        JSON.stringify(originalProfile) !== JSON.stringify(profile) ? setModified(true) : setModified(false);
    }, [profile]);

    useEffect(() => {
        if(status === 'authenticated') {
          session?.user?.id !== profile?.creator ? setEditable(false) : setEditable(true);
        }
    }, [status, session]);

    let isMobile = useMediaQuery('(max-width: 768px)');

    const updateProfile = () => {
        setLoading(true);
        Axios.put('/api/profile', {...profile}).then(() => {
          updateProfiles();
          setOriginalProfile(JSON.parse(JSON.stringify(profile)));
          setModified(false);
          showNotification({
            title: 'Profile Updated',
            message: 'Your profile has been updated successfully.',
            color: 'green',
          });
        }).catch((error) => {
          if(error.response.status === 400) {
            if(error.response.data?.message.includes('moderation')) {
              showNotification({
                title: 'Content Fails Moderation',
                message: 'Your profile description or name fails our moderation checks. Please remove any profanity and try again.',
                color: 'red',
              });
            } else {
              showNotification({
                title: 'Error with Profile Request',
                message: 'There was an error with your request. Please check your input values and try again',
                color: 'red',
              });
            }
          } else {
            showNotification({
              title: 'Error Updating Profile',
              message: 'There was an error updating your profile. Please try again later.',
              color: 'red',
            });
          }
        }).finally(() => {
          setLoading(false);
        });
    }

    const deleteProfile = () => {
      setDeleting(true);
      Axios.delete('/api/profile', {data:{_id: profile?._id, creator: profile?.creator}}).then(() => {
        updateProfiles();
        showNotification({
          title: 'Profile Deleted',
          message: 'Your profile has been deleted successfully.',
          color: 'green',
        });
      }).catch((error) => {
        if(error.response.status === 400) {
          showNotification({
            title: 'Error with Profile Delete Request',
            message: 'There was an error with your request. Please check your input values and try again',
            color: 'red',
          });
        } else {
          showNotification({
            title: 'Error Deleting Profile',
            message: 'There was an error updating your profile. Please try again later.',
            color: 'red',
          });
        }
      }).finally(() => {
        setDeleting(false);
        setModalOpened(false);
      });
    }

    return (
        <>
            {editable === null && (
              <Stack align='center' pt='xl' pb='sm'>
                <Skeleton height={200} width={200} radius={100}/>
                <Skeleton height={40} radius='md'/>
                <Skeleton height={40} radius='md'/>
                <Skeleton height={302} radius='md'/>
              </Stack>
              )}
            {editable === false && (
              <>
                <Stack pt='sm'>
                    <Center mb={-10}>
                        <Paper radius={100} shadow='xl' withBorder>
                            <Avatar src={profile?.imageUrl} size={200} radius={100}/>
                        </Paper>
                    </Center>
                    <Title align='center' mb={-10}>{profile?.name}</Title>
                    <Center>
                        <TbMessageChatbot color='gray' size={22}/>
                        <Text color='dimmed' ml={4}>{profile?.messageCount} messages</Text>
                    </Center>
                    <Divider/>
                    <ScrollArea style={{height: 340}}>
                      <Text align='center'>{profile?.description}</Text>
                    </ScrollArea>
                </Stack>
              </>
            )} 
            {editable === true && (
              <>
                <Stack pt='sm'>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <ActionIcon color="red" radius="xl" variant="outline" size={36} onClick={() => {setModalOpened(true)}}>
                            <TbTrashX size={20}/>
                        </ActionIcon>
                        <SegmentedControl
                          data={[
                            { label: 'Private', value: 'private' },
                            { label: 'Public', value: 'public' },
                          ]}
                          value={profile?.visibility}
                          // @ts-ignore
                          onChange={(value) => setProfile({...profile, ...{visibility: value}})}
                        />
                    </div>
                    <Center mb={-20}>
                        <Paper radius={100} shadow='xl' withBorder>
                            <Avatar src={profile?.imageUrl} size={200} radius={100}/>
                        </Paper>
                    </Center>
                    <Input.Wrapper label='Profile Name'>
                        <Input placeholder='enter a name' value={profile?.name} 
                        // @ts-ignore
                        onChange={(event: any) => setProfile({...profile, ...{name: event.currentTarget.value}})} />
                    </Input.Wrapper>
                    <Input.Wrapper label='Profile Image URL'>
                        <Input placeholder='enter a url' value={profile?.imageUrl} 
                        // @ts-ignore
                        onChange={(event: any) => setProfile({...profile, ...{imageUrl: event.currentTarget.value}})} />
                    </Input.Wrapper>
                    <Textarea label='Profile Description' placeholder='include a detailed summary of the profiles character' minRows={isMobile ? 3 : 6} maxRows={isMobile ? 3 : 6} value={profile?.description}
                    // @ts-ignore
                    onChange={(event) => setProfile({...profile, ...{description: event.currentTarget.value}})} autosize/>
                    <Divider/>
                    <Button color='grape' onClick={() => {updateProfile()}} disabled={!modified} loading={loading}>Save Profile</Button>
                </Stack>
                <Modal opened={modalOpened} onClose={() => {setModalOpened(false)}}>
                  <Center mt={-30}>
                    <ThemeIcon size={100} radius={50} variant='outline' color='red'>
                      <RiAlarmWarningLine size={45}/>
                    </ThemeIcon>
                  </Center>
                  <Text mt='md' align='center' weight={600}>Confirm Profile Deletion?</Text>
                  <Text mt='sm' align='center' size='sm'>Are you sure you want to delete this profile? This action cannot be undone.</Text>
                  <Divider mt='md' mb='md'/>
                  <Group grow>
                    <Button color='gray' onClick={() => {setModalOpened(false)}}>Cancel</Button>
                    <Button color='red' loading={deleting} onClick={() => {deleteProfile()}}>Delete</Button>
                  </Group>
                </Modal>
              </>)
              }
        </>
    );
}