import {
  createStyles,
  Image,
  Container,
  Title,
  Button,
  Group,
  Text,
  List,
  ThemeIcon,
  Accordion,
  Grid,
  Col,
  Badge,
} from '@mantine/core';
import { IconCheck } from '@tabler/icons';
import { Header } from '../components/General/Header/Header';
import imageA from '../public/undraw/undraw_8.svg';
import imageB from '../public/undraw/undraw_2.svg';
import { useRouter } from 'next/router';
import { useMediaQuery } from '@mantine/hooks';
import { Footer } from '../components/General/Footer/Footer';
import { GholaChatButton } from '../components/Buttons/GholaChatButton/GholaChatButton';

const useStyles = createStyles((theme) => ({
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.xl * 4,
    paddingBottom: theme.spacing.xl * 4,
  },

  content: {
    maxWidth: 480,
    marginRight: theme.spacing.xl * 3,

    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      marginRight: 0,
    },
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 44,
    lineHeight: 1.2,
    fontWeight: 900,

    [theme.fn.smallerThan('xs')]: {
      fontSize: 28,
    },
  },

  title_minor: {
    marginBottom: theme.spacing.md,
    paddingLeft: theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  control: {
    [theme.fn.smallerThan('xs')]: {
      flex: 1,
    },
  },

  image: {
    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },

  highlight: {
    position: 'relative',
    backgroundColor: theme.colorScheme === 'dark' ? '#ae3ec933' : '#9c36b533',
    borderRadius: theme.radius.sm,
    padding: '4px 12px',
  },

  wrapper: {
    paddingTop: theme.spacing.xl * 2,
    paddingBottom: theme.spacing.xl * 2,
  },

  item: {
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
  },
  footer: {
    marginTop: 120,
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  innerFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column',
    },
  },

  links: {
    [theme.fn.smallerThan('xs')]: {
      marginTop: theme.spacing.md,
    },
  },
}));

interface FooterSimpleProps {
  links: { link: string; label: string }[];
}

export default function HomePage() {
  const { classes } = useStyles();
  let isMobile = useMediaQuery('(max-width: 768px)');
  const router = useRouter();
  const links = [
    { link: 'privacy', label: 'Privacy' },
    { link: 'terms', label: 'Terms & Conditions' },
  ];

  return (
    <div className='fullscreen'>
    <div>
      <Header/>
      <Container mt={isMobile ? -70 : -30} mb={isMobile ? -80 : -30}> 
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              Your own personal AI <span className={classes.highlight}>Personas</span><br />
            </Title>
            <Text color="dimmed" mt="md">
              Our goal is to employ chatbot AI technology to enable important interactions that encourage introspection and personal development through personalized chat bots.
              We think we can help people become more self-aware and insightful by giving them a secure and encouraging place to explore their thoughts and feelings.
              <br /><br />
              We want to enable individuals to make positive changes in their life and realize their full potential through our ground-breaking approach to discussion powered by AI.
            </Text>

            <List
              mt={30}
              spacing="sm"
              size="sm"
              icon={
                <ThemeIcon size={20} color={'#9C36B5'} radius="xl">
                  <IconCheck size={12} stroke={3}/>
                </ThemeIcon>
              }
            >
              <List.Item>
                <b>Customizable Parameters</b> – add a description & attributes you wish the chat bot to emulate, the more detail the better!
              </List.Item>
              <List.Item>
                <b>Multiple Profiles</b> – create multiple chat bots with different personalities and interests 
              </List.Item>
              <List.Item>
                <b>Profile Sharing</b> – share your chat bot with others and get feedback on your chat bot’s personality
              </List.Item>
              <List.Item>
                <b>Conversation Showcase</b> - share your funniest or most insightful conversations and let others pick up where you left off 
              </List.Item>
              <List.Item>
                <b>Backend API</b> <Badge color="green">Beta</Badge> - use our API to integrate our profiles into your own projects and services
              </List.Item>
              <List.Item>
                <b>Group Conversations</b> <Badge color="grape">In Development</Badge> - chat with multiple chat bots at once and see how they interact with each other
              </List.Item>
            </List>
            <Group mt={30}>
              <Button radius="xl" size="md" className={classes.control} color='grape' onClick={() => {router.push('login')}}>
                Get started
              </Button>
            </Group>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <Image src={imageA.src} className={classes.image} />
          </div>
        </div>
      </Container>
    </div>
    <div className={classes.wrapper}>
      <Container size="lg">
        <Grid id="faq-grid" gutter={50}>
          <Col span={12} md={6}>
            <div style={{display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
              <Image src={imageB.src} style={{maxWidth: '70%'}} alt="Frequently Asked Questions" />
            </div>
          </Col>
          <Col span={12} md={6}>
            <Title order={2} align="left" className={classes.title_minor}>
              Frequently Asked Questions
            </Title>

            <Accordion chevronPosition="right" defaultValue="ai-privacy-security" variant="separated">
              <Accordion.Item className={classes.item} value="reset-password">
                <Accordion.Control>Are AI chatbots secure and private?</Accordion.Control>
                <Accordion.Panel>{'Most AI chatbots are designed with security and privacy in mind, and use encryption and other measures to protect user data. User accounts are provided solely through Google OAuth for strong privacy measures.'}</Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item className={classes.item} value="multiple-profiles">
                <Accordion.Control>Can I create more than one AI to talk to?</Accordion.Control>
                <Accordion.Panel>{'Yes! Ghola is capable of holding any/all chat bot profiles and the conversations with them, make as many as you like and share them with the community by making them public.'}</Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item className={classes.item} value="conversational-data-policy">
                <Accordion.Control>Does Ghola save my conversations?</Accordion.Control>
                <Accordion.Panel>{'Ghola does not store private or public conversational data, except in the case the user chooses to share a private or public conversation with the community through the explore page.'}</Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item className={classes.item} value="ai-understanding">
                <Accordion.Control>Will an AI chatbot be able to understand and respond to my needs and concerns?</Accordion.Control>
                <Accordion.Panel>{"Many AI chatbots are designed to use natural language processing (NLP) and large language models to understand and respond to user input. While there may be some limitations to the chatbot's understanding, in many cases it should be able to provide relevant and useful information or assistance"}</Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item className={classes.item} value="chatbot-reliability">
                <Accordion.Control>Are AI chatbots reliable?</Accordion.Control>
                <Accordion.Panel>{'AI chatbots are generally reliable, but like any technology, they may occasionally experience errors or bugs. However, most chatbots are constantly learning and improving, and they are often monitored by human operators to ensure that they are providing accurate and helpful information.'}</Accordion.Panel>
              </Accordion.Item>

            </Accordion>
          </Col>
        </Grid>
      </Container>
    </div>
    <Footer links={links}/>
    <div style={{position: 'fixed', bottom: 35, right: 35}}>
      <GholaChatButton/>
    </div>
    </div>
  );
}