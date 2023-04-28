import { useMediaQuery } from '@mantine/hooks';
import { createStyles, Paper, Skeleton, Title, Button, useMantineTheme, Grid, Center, TextInput, Loader, Stack, Flex } from '@mantine/core';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TbSearch, TbMessages } from 'react-icons/tb';
import { useConversationContext } from '../../../context/ConversationContext';
import Axios from 'axios';

const useStyles = createStyles((theme) => ({
  desktopCard: {
    minHeight: '23vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },

  mobileCard: {
    height: '40vh',
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
    backdropFilter: 'blur(8px)',
    paddingInline: theme.spacing.xs,
    paddingBlock: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    backgroundColor: '#ffffff33',
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
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
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
        Open Profile
      </Button>
    </Paper>
  );
}

export function ExplorePanels({profiles}: CharacterPanelProps) {
  
  const theme = useMantineTheme();
  let mobile = useMediaQuery(`(max-width: 768px)`);
  const { setSelectedProfile } = useConversationContext();

  const [searchValue, setSearchValue] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [searchResults, setSearchResults] = useState<Profile[]>([]);

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    if (searchValue.length > 0) {
      setSearching(true);
      setSearchTimeout(setTimeout(() => {
        Axios.get('/api/profile/public', {params: {search: searchValue}}).then((res) => {
          setSearchResults(res.data.data);
        });
        setSearching(false);
      }, 600));
    } else {
      if(searchTimeout) {clearTimeout(searchTimeout);}
      if(searchResults.length > 0) {setSearchResults([]);}
      setSearching(false);
    }
  }, [searchValue]);

  return (
    <div>
      <Center>
        <TextInput
          icon={<TbSearch />}
          placeholder="Search for a profile"
          style={{width: '100%', maxWidth: '1000px', marginTop: '25px'}}
          size="md"
          radius="xl"
          onChange={(e) => {setSearchValue(e.currentTarget.value)}}
          value={searchValue}
          rightSection={searching ? <Loader size="xs" /> : <></>}
        />
      </Center>
      <div style={{display: 'flex', alignItems: 'start', justifyContent: 'center', marginTop: '25px', height: '80vh', width: '100%'}}>
        {
          (searchResults && searchResults.length > 0 && !searching) && (
            <>
              <Grid style={mobile ? {width: '100%', height: '40vh'} : {width: '95%', height: 'auto'}}>
              {searchResults.map((item, index) => (
                <Grid.Col span={mobile ? 12 : 3}>
                    <Card profile={item} setSelectedProfile={setSelectedProfile}/>
                </Grid.Col>
              ))}
              </Grid>
            </>
        )}
        { 
          searchResults && searchResults.length === 0 && searchValue && searchValue.length > 0 && !searching && (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              {!mobile && <h1 style={theme.colorScheme === 'dark' ? {color: theme.white, fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900, fontSize: 32, lineHeight: 1.2, textAlign: 'center'} : {color: theme.black, fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900, fontSize: 32, lineHeight: 1.2, textAlign: 'center'}}>No better time to create a new profile!</h1>}
              <h2 style={theme.colorScheme === 'dark' ? {color: theme.white, fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900, fontSize: 28, lineHeight: 1.2, textAlign: 'center'} : {color: theme.black, fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900, fontSize: 28, lineHeight: 1.2, textAlign: 'center'}}>No profiles found</h2>
            </div>
          )
        }
          {(profiles && profiles.length > 0 && !searching && searchValue?.length === 0) && (
            <>
              <Grid style={mobile ? {width: '100%', height: '40vh'} : {width: '95%', height: 'auto'}}>
              {profiles.map((item) => (
                <Grid.Col span={mobile ? 12 : 3}>
                    <Card profile={item} setSelectedProfile={setSelectedProfile}/>
                </Grid.Col>
              ))}
              </Grid>
            </>
        )}
        { 
          profiles && profiles.length === 0 && (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              {!mobile && <h1 style={theme.colorScheme === 'dark' ? {color: theme.white, fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900, fontSize: 32, lineHeight: 1.2, textAlign: 'center'} : {color: theme.black, fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900, fontSize: 32, lineHeight: 1.2, textAlign: 'center'}}>No community profiles found.</h1>}
              <h2 style={theme.colorScheme === 'dark' ? {color: theme.white, fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900, fontSize: 28, lineHeight: 1.2, textAlign: 'center'} : {color: theme.black, fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900, fontSize: 28, lineHeight: 1.2, textAlign: 'center'}}>Please check back later.</h2>
            </div>
          )
        }
        {
          (!profiles || searching) && (
            <>
            {mobile ? 
              (
                <div style={{display: 'flex', height: '90vh', width: '100%', flexDirection: 'column'}}>
                  <Skeleton height='40vh' radius='md' />
                  <Skeleton height='40vh' mt='md' radius='md' />
                </div>
              ) 
            : 
              (
                <Grid style={mobile ? {width: '100%', height: '400px'} : {width: '95%', height: 'auto'}}>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map((item, index) => (
                      <Grid.Col span={mobile ? 12 : 3} key={index}>
                        <Skeleton height='20vh' radius='md'/>
                      </Grid.Col>
                  ))}
                </Grid>
              )}
            </>
          )
        }
      </div>
    </div>
  );
}