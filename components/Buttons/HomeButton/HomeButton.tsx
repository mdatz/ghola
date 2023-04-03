import { useMantineColorScheme, ActionIcon } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconHome } from '@tabler/icons';
import { useRouter } from 'next/router';

export function HomeButton() {
    const { colorScheme } = useMantineColorScheme();
    const router = useRouter();
    let mobile = useMediaQuery(`(max-width: 768px)`);

    return (
        <ActionIcon
            onClick={() => {router.push('/dashboard')}}
            size={mobile ? 52 : 64}
            mt={-12}
            radius="xl"
            variant='filled'
            sx={(theme) => ({
            backgroundColor:
                theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
            color: theme.colorScheme === 'dark' ? theme.colors.grape[6] : theme.colors.grape[6],
            })}>
                {colorScheme === 'dark' ? <IconHome size={32} /> : <IconHome size={32}/> }
        </ActionIcon>
    );
}