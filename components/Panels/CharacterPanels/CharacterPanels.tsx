import { Carousel } from '@mantine/carousel';
import { useMediaQuery } from '@mantine/hooks';
import { createStyles, Paper, Skeleton, Title, Button, useMantineTheme, ActionIcon, useMantineColorScheme, Modal, Flex } from '@mantine/core';
import { AddProfileButton } from '../../Buttons/AddProfileButton/AddProfileButton';
import { Dispatch, SetStateAction, useState } from 'react';
import { IconTool } from '@tabler/icons';
import { useRouter } from 'next/router';
import { AttributePanel } from '../ConversationPanels/AttributePanel/AttributePanel';
import { ExploreButton } from '../../Buttons/ExploreButton/ExploreButton';
import { useConversationContext } from '../../../context/ConversationContext';
import { TbMessages } from 'react-icons/tb';


const useStyles = createStyles((theme) => ({
  desktopCard: {
    height: '65vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },

  mobileCard: {
    height: '70vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 900,
    color: theme.white,
    lineHeight: 1.2,
    fontSize: 32,
    marginTop: theme.spacing.xs,
  },

  category: {
    color: theme.white,
    opacity: 0.7,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
}));

interface CardProps {
  profile: Profile;
  setSelectedProfile: Dispatch<SetStateAction<null|Profile>>;
}

interface CharacterPanelProps {
  profiles: Profile[];
}

function Card({ profile, setSelectedProfile }: CardProps) {
  const { classes } = useStyles();
  const mobile = useMediaQuery(`(max-width: 768px)`);
  const router = useRouter();

  return (
    <Paper
      shadow="md"
      p="xl"
      radius="md"
      sx={{ backgroundImage: `url(${profile.imageUrl})` }}
      className={mobile ? classes.mobileCard : classes.desktopCard}
    >
      <div>
        <Title order={3} className={classes.title}>
          {profile.name}
        </Title>
        <Flex gap={4} mt={4}>
          <TbMessages size={20}/>
          <Title order={4} className={classes.category}>
            {profile.messageCount}
          </Title>
        </Flex>
      </div>
      <Button variant="white" color="dark" onClick={() => {setSelectedProfile(profile); router.push('/chat');}}>
        {mobile ? 'Open Chat' : 'Open Profile'}
      </Button>
    </Paper>
  );
}

export function CharacterPanels({profiles}: CharacterPanelProps) {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: 768px)`);
  const { colorScheme } = useMantineColorScheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [profile, setProfile] = useState<Profile|null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { setSelectedProfile } = useConversationContext();

  const editCurrentProfile = () => {
    if(!profiles) {return;}
    setProfile(profiles[selectedIndex]);
    setModalOpen(true);
  }

  return (
    <div>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', width: '100%'}}>
        {
          profiles && profiles.length > 0 && (
            <>
              <Carousel
              style={mobile ? {width: '100%'} : {width: '95%'}}
              slideSize={"25%"}
              breakpoints={[{ maxWidth: 'sm', slideSize: '100%', slideGap: 2 }]}
              slideGap="xl"
              align="start"
              height={mobile ? '70vh' : 'auto'}
              orientation={mobile ? 'vertical' : 'horizontal'}
              slidesToScroll={1}
              initialSlide={selectedIndex}
              onSlideChange={(index) => {setSelectedIndex(index)}}
              skipSnaps
              loop>
                {profiles.map((item) => (
                  <Carousel.Slide key={item.name}>
                    <Card profile={item} setSelectedProfile={setSelectedProfile}/>
                  </Carousel.Slide>
                ))}
            </Carousel>
            <Modal title='Edit Profile' opened={modalOpen} transition='slide-down' onClose={() => {setModalOpen(false); setProfile(null)}}>
              <Flex style={{display: 'flex', alignItems: 'center'}} mt={-15}>
                <div style={{width: '100%'}}>
                    {profile && <AttributePanel profile={profile} setProfile={setProfile}/>}
                </div>
              </Flex>
            </Modal>
            </>
        )}
        { 
          profiles && profiles.length === 0 && (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              {!mobile && <h1 style={theme.colorScheme === 'dark' ? {color: theme.white, fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900, fontSize: 32, lineHeight: 1.2, textAlign: 'center'} : {color: theme.black, fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900, fontSize: 32, lineHeight: 1.2, textAlign: 'center'}}>You don't have any profiles yet.</h1>}
              <h2 style={theme.colorScheme === 'dark' ? {color: theme.white, fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900, fontSize: 32, lineHeight: 1.2, textAlign: 'center'} : {color: theme.black, fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900, fontSize: 32, lineHeight: 1.2, textAlign: 'center'}}>Add a profile to get started.</h2>
            </div>
          )
        }
        {
          !profiles && (
            <Carousel
            style={mobile ? {width: '100%'} : {width: '95%'}}
            slideSize={"25%"}
            breakpoints={[{ maxWidth: 'sm', slideSize: '100%', slideGap: 2 }]}
            slideGap="xl"
            align="start"
            height={mobile ? '70vh' : 'auto'}
            orientation={mobile ? 'vertical' : 'horizontal'}
            slidesToScroll={1}
            loop>
              {mobile ? (
                <Carousel.Slide>
                  <Skeleton height={'70vh'} />
                </Carousel.Slide>
              ):(
                [1,2,3,4].map((item) => (
                  <Carousel.Slide key={item}>
                    <Skeleton height={800} />
                  </Carousel.Slide>
                ))
              )}
          </Carousel>
          )
        }
      </div>
      <div style={{position: 'absolute', bottom: 35, right: 35}}>
        <AddProfileButton />
        {/* TODO: Extract this action icon */}
        {mobile && (
          <ActionIcon
            onClick={() => {editCurrentProfile()}}
            size={mobile ? 52 : 64}
            mb='xs'
            variant='filled'
            radius="xl"
            sx={(theme) => ({
              backgroundColor:
                theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
              color: theme.colorScheme === 'dark' ? theme.colors.grape[6] : theme.colors.grape[6],
            })}
          >
            {colorScheme === 'dark' ? <IconTool size={32} /> : <IconTool size={32}/> }
          </ActionIcon>
        )}
        <ExploreButton />
      </div>
    </div>
  );
}