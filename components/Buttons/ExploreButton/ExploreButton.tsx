import { useMantineColorScheme, ActionIcon } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconCompass } from '@tabler/icons';
import { useRouter } from 'next/router';

export function ExploreButton() {
    const { colorScheme } = useMantineColorScheme();
    const router = useRouter();
    let mobile = useMediaQuery(`(max-width: 768px)`);

    return (
        <ActionIcon
            onClick={() => {router.push('/explore')}}
            size={mobile ? 52 : 64}
            variant='filled'
            radius="xl"
            sx={(theme) => ({
            backgroundColor:
                theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
            color: theme.colorScheme === 'dark' ? theme.colors.green[7] : theme.colors.grape[7],
            })}
        >
            {colorScheme === 'dark' ? <IconCompass size={32} /> : <IconCompass size={32}/> }
        </ActionIcon>
    );
}