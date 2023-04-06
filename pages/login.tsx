import {
    Paper,
    createStyles,
    Title,
    ActionIcon,
    Button,
  } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons';
import { useRouter } from 'next/router';
import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
  
  const useStyles = createStyles((theme) => ({
    wrapperImage: {
      minHeight: '100vh',
      backgroundSize: 'cover',
      backgroundImage:
        'url(https://images.unsplash.com/photo-1496504175726-c7b4523c7e81?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2117&q=80)',
    },
    
    googleSignIn : {
      backgroundImage: 'url(/google/btn_google_signin_light_normal_web.png)',
      width: '191px', 
      height: '46px', 
      backgroundRepeat: 'no-repeat', 
      border: 'none', 
      cursor: 'pointer',
    },

    form: {
      borderRight: `1px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
      }`,
      minHeight: '100vh',
      maxWidth: 450,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
  
      [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
        maxWidth: '100%',
      },
    },
  
    title: {
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },
  
    logo: {
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      width: 120,
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  }));
  
  export default function AuthenticationImage() {
    const { data: session, status } = useSession();
    const { classes } = useStyles();
    const router = useRouter();

    useEffect(() => {
      if (status === 'authenticated') {
        router.push('/dashboard');
      }
    }, [status]);

    return (
      <div className={classes.wrapperImage}>
        <div style={{position: 'absolute', top: 25, left: 25}}>
            <ActionIcon size="xl" radius="xl" onClick={() => {router.push('/')}}>
                <IconArrowLeft size={24} stroke={1.5} />
            </ActionIcon>
        </div>
        <Paper className={classes.form} radius={0} p={30}>
          <img src="/logo_dark.png" alt="logo" className={classes.logo} />
          <Title order={2} className={classes.title} align="center" mt="md" mb={50}>
            Welcome to ghola!
          </Title>
          <Button fullWidth mt="xl" size="md" color='grape' leftIcon={<FcGoogle size={32} />} onClick={() => {signIn("google", { callbackUrl: window.location.origin + '/dashboard' })}}>
            Sign in with Google
          </Button>
        </Paper>
      </div>
    );
  }