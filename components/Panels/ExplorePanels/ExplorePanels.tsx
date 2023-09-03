import { useMediaQuery } from '@mantine/hooks';
import { createStyles, Paper, Skeleton, Title, Button, useMantineTheme, Grid, Center, TextInput, Loader, Flex, ActionIcon, useMantineColorScheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TbSearch, TbMessages, TbSparkles } from 'react-icons/tb';
import { useConversationContext } from '../../../context/ConversationContext';
import Axios from 'axios';
import { useSession } from 'next-auth/react';

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
}

interface CharacterPanelProps {
  profiles: Profile[];
}

function Card({ profile }: CardProps) {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: 768px)`);
  const [selected, setSelected] = useState(false);
  const router = useRouter();
  const {data: session} = useSession();
  const { selectedGroup, setSelectedGroup, setSelectedProfile } = useConversationContext();

  const handleSelect = () => {
    if(session?.user?.role !== 'admin') {return}
    if (selectedGroup) {
      if (selectedGroup.includes(profile)) {
        setSelectedGroup(selectedGroup.filter((p) => p !== profile));
        setSelected(false);
      } else {
        setSelectedGroup([...selectedGroup, profile]);
        setSelected(true);
      }
    } else {
      setSelectedGroup([profile]);
      setSelected(true);
    }
  };

  return (
    <Paper
      shadow="md"
      p="xl"
      radius="md"
      sx={{ backgroundImage: `url(${profile.imageUrl})` }}
      className={isMobile ? classes.mobileCard : classes.desktopCard}
      style={selected ? { border: `2px solid ${theme.colors.grape[6]}` } : {}}
      onClick={() => {handleSelect()}}
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
  const { colorScheme } = useMantineColorScheme();
  let isMobile = useMediaQuery(`(max-width: 768px)`);
  const { selectedGroup, setSelectedGroup } = useConversationContext();
  const router = useRouter();

  const [searchValue, setSearchValue] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [searchResults, setSearchResults] = useState<Profile[]>([]);

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    if (abortController && !abortController.abort) {
      abortController.abort();
    }
    if (searchValue.length > 0) {
      setSearching(true);
      setAbortController(new AbortController());
      setSearchTimeout(setTimeout(() => {
        Axios.get('/api/profile/public', {params: {search: searchValue}, signal: abortController?.signal}).then((res) => {
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

  useEffect(() => {
    if(selectedGroup && selectedGroup.length > 0) {
      setSelectedGroup([]);
    }
  }, []);

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
              <Grid style={isMobile ? {width: '100%', height: '40vh'} : {width: '95%', height: 'auto'}}>
              {searchResults.map((item, index) => (
                <Grid.Col span={isMobile ? 12 : 3}>
                    <Card profile={item}/>
                </Grid.Col>
              ))}
              </Grid>
            </>
        )}
        { 
          searchResults && searchResults.length === 0 && searchValue && searchValue.length > 0 && !searching && (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              {!isMobile && <h1 style={theme.colorScheme === 'dark' ? {color: theme.white, fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900, fontSize: 32, lineHeight: 1.2, textAlign: 'center'} : {color: theme.black, fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900, fontSize: 32, lineHeight: 1.2, textAlign: 'center'}}>No better time to create a new profile!</h1>}
              <h2 style={theme.colorScheme === 'dark' ? {color: theme.white, fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900, fontSize: 28, lineHeight: 1.2, textAlign: 'center'} : {color: theme.black, fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900, fontSize: 28, lineHeight: 1.2, textAlign: 'center'}}>No profiles found</h2>
            </div>
          )
        }
          {(profiles && profiles.length > 0 && !searching && searchValue?.length === 0) && (
            <>
              <Grid style={isMobile ? {width: '100%', height: '40vh'} : {width: '95%', height: 'auto'}}>
              {profiles.map((item) => (
                <Grid.Col span={isMobile ? 12 : 3}>
                    <Card profile={item}/>
                </Grid.Col>
              ))}
              </Grid>
            </>
        )}
        { 
          profiles && profiles.length === 0 && (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              {!isMobile && <h1 style={theme.colorScheme === 'dark' ? {color: theme.white, fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900, fontSize: 32, lineHeight: 1.2, textAlign: 'center'} : {color: theme.black, fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900, fontSize: 32, lineHeight: 1.2, textAlign: 'center'}}>No community profiles found.</h1>}
              <h2 style={theme.colorScheme === 'dark' ? {color: theme.white, fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900, fontSize: 28, lineHeight: 1.2, textAlign: 'center'} : {color: theme.black, fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900, fontSize: 28, lineHeight: 1.2, textAlign: 'center'}}>Please check back later.</h2>
            </div>
          )
        }
        {
          (!profiles || searching) && (
            <>
            {isMobile ? 
              (
                <div style={{display: 'flex', height: '90vh', width: '100%', flexDirection: 'column'}}>
                  <Skeleton height='40vh' radius='md' />
                  <Skeleton height='40vh' mt='md' radius='md' />
                </div>
              ) 
            : 
              (
                <Grid style={isMobile ? {width: '100%', height: '400px'} : {width: '95%', height: 'auto'}}>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map((item, index) => (
                      <Grid.Col span={isMobile ? 12 : 3} key={index}>
                        <Skeleton height='20vh' radius='md'/>
                      </Grid.Col>
                  ))}
                </Grid>
              )}
            </>
          )
        }
      </div>
      <div style={isMobile ? {position: 'fixed', bottom: 55, right: 35, zIndex: 10} : {position: 'fixed', bottom: 35, right: 35, zIndex: 10}}>
        {selectedGroup && selectedGroup.length > 1 && 
          <ActionIcon
          onClick={() => {router.push('/showdown')}}
          size={isMobile ? 52 : 64}
          mb='xs'
          variant='filled'
          radius={32}
          sx={(theme) => ({
            pointer: 'cursor',
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
            color: theme.colorScheme === 'dark' ? theme.colors.grape[6] : theme.colors.grape[6],
          })}
        >
          {colorScheme === 'dark' ? <TbSparkles onClick={() => {router.push('/showdown')}} color='white' size={32} style={{cursor: 'pointer'}} /> : <TbSparkles onClick={() => {router.push('/showdown')}} color='white' size={32} style={{cursor: 'pointer'}}/> }
        </ActionIcon>
        }
      </div>
    </div>
  );
}