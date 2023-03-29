import { Carousel } from '@mantine/carousel';
import { useMediaQuery } from '@mantine/hooks';
import { createStyles, Paper, Skeleton, Title, Button, useMantineTheme, ActionIcon, useMantineColorScheme, Grid } from '@mantine/core';
import { Dispatch, SetStateAction } from 'react';
import { IconHome } from '@tabler/icons';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const useStyles = createStyles((theme) => ({
  desktopCard: {
    minHeight: '20vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },

  mobileCard: {
    height: 600,
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
  setSelectedProfile: Dispatch<SetStateAction<null|Profile>>;
}

function shuffleArray(array: Profile[]) {
  if (!array) {return;}
  let curId = array.length;
  while (0 !== curId) {
    let randId = Math.floor(Math.random() * curId);
    curId -= 1;
    let tmp = array[curId];
    array[curId] = array[randId];
    array[randId] = tmp;
  }
  return array;
}

function Card({ profile, setSelectedProfile }: CardProps) {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);

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
      </div>
      <Button variant="white" color="dark" onClick={() => {setSelectedProfile(profile)}}>
        Open Profile
      </Button>
    </Paper>
  );
}

export function ExplorePanels({profiles, setSelectedProfile}: CharacterPanelProps) {
  const { data: session, status } = useSession();
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
  const randProfiles = shuffleArray(profiles);
  const { colorScheme } = useMantineColorScheme();
  const router = useRouter();

  return (
    <div>
      <div style={{display: 'flex', alignItems: 'start', justifyContent: 'center', marginTop: '25px', marginBottom: '25px', height: '80vh', width: '100%'}}>
        {
          randProfiles && randProfiles.length > 0 && (
            <>
              <Grid style={mobile ? {width: '100%', height: '600px'} : {width: '95%', height: 'auto'}}>
              {randProfiles.map((item) => (
                <Grid.Col span={mobile ? 12 : 3}>
                    <Card profile={item} setSelectedProfile={setSelectedProfile}/>
                </Grid.Col>
              ))}
              </Grid>
            </>
        )}
        { 
          randProfiles && randProfiles.length === 0 && (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              {!mobile && <h1 style={theme.colorScheme === 'dark' ? {color: theme.white, fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900, fontSize: 32, lineHeight: 1.2, textAlign: 'center'} : {color: theme.black, fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900, fontSize: 32, lineHeight: 1.2, textAlign: 'center'}}>No community profiles found.</h1>}
              <h2 style={theme.colorScheme === 'dark' ? {color: theme.white, fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900, fontSize: 32, lineHeight: 1.2, textAlign: 'center'} : {color: theme.black, fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900, fontSize: 32, lineHeight: 1.2, textAlign: 'center'}}>Please check back later.</h2>
            </div>
          )
        }
        {
          !randProfiles && (
            <Carousel
            style={mobile ? {width: '100%'} : {width: '95%'}}
            slideSize={"25%"}
            breakpoints={[{ maxWidth: 'sm', slideSize: '100%', slideGap: 2 }]}
            slideGap="xl"
            align="start"
            height={mobile ? 600 : 'auto'}
            orientation={mobile ? 'vertical' : 'horizontal'}
            slidesToScroll={1}
            loop>
              {mobile ? (
                <Skeleton height={600} />
              ):(
                <Grid style={mobile ? {width: '100%', height: '600px'} : {width: '95%', height: 'auto'}}>
                  {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map((item, index) => (
                      <Grid.Col span={mobile ? 12 : 3} key={index}>
                        <Skeleton height='100%'/>
                      </Grid.Col>
                  ))}
                </Grid>
              )}
          </Carousel>
          )
        }
      </div>
      <div style={{position: 'fixed', bottom: 35, right: 35}}>
        {(status === 'authenticated' && session.user.role === 'admin') && 
          <ActionIcon
            onClick={() => {router.push('/dashboard')}}
            size={64}
            mt={-12}
            radius="xl"
            sx={(theme) => ({
              backgroundColor:
                theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
              color: theme.colorScheme === 'dark' ? theme.colors.green[7] : theme.colors.grape[7],
            })}
          >
            {colorScheme === 'dark' ? <IconHome size={32} /> : <IconHome size={32}/> }
          </ActionIcon>
        }
      </div>
    </div>
  );
}