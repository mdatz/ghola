import { useMantineColorScheme, ActionIcon } from '@mantine/core';
import { signOut } from 'next-auth/react';
import { TbDoorExit } from 'react-icons/tb';

export function LogOutButton() {
  const { colorScheme } = useMantineColorScheme();

  return (
      <ActionIcon
        onClick={() => {signOut({ callbackUrl: window.location.origin + '/login' })}}
        size='xl'
        radius="xl"
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
          color: theme.colors.red[7],
        })}
      >
        {colorScheme === 'dark' ? <TbDoorExit size={20} /> : <TbDoorExit size={20}/> }
      </ActionIcon>
  );
}