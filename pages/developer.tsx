import { useEffect, useState } from 'react';
import { Header } from '../components/General/Header/Header';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Card, Center, Container, Divider, Text, Button, Modal, PasswordInput, Code, Table, Title } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';

export default function Developer() {

    const { data: session, status } = useSession();
    const router = useRouter();

    const [modalOpened, setModalOpened] = useState(false);
    const [apiToken, setApiToken] = useState('');
    const [visible, { toggle }] = useDisclosure(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, session]);

    const handleGenerateToken = async() => {
        const res = await fetch('/api/v1/token/generate', { method: 'POST' });
        if(res.status !== 200) {
            showNotification({
                title: 'Error',
                message: 'An error occurred while generating the API token. Please try again later.',
                color: 'red',
            });
            return;
        }
        const data = await res.json();
        setApiToken(data.token);
        showNotification({
            title: 'Success',
            message: 'The API token has been successfully generated. Please make sure to save it securely as it will only be shown once.',
            color: 'green',
            autoClose: false,
        });
        setModalOpened(false);
    }

    return (
        <>
            <div className='fullscreen'>
                <Header back={true}/>
                <Container>
                    <Center>
                        <Card mt='xl' shadow='sm' p='md' pt={0} radius='md' style={{width: '100%', maxWidth: '600px'}}>
                            <Center>
                                <h2>API Settings</h2>
                            </Center>
                            <Divider/>
                            {
                                apiToken !== '' &&
                                <>
                                    <h3>API Token</h3>
                                    <Text mt={-15}>The following is your API token. Please make sure to save it securely as it will only be shown this one time and you will not be able to see this token again after leaving.</Text>
                                    <PasswordInput visible={visible} onVisibilityChange={toggle} mt='sm' value={apiToken} onChange={() => {}}/>
                                    <Text mt={2} color='dimmed' size='sm'><b>Note:</b> if this is the first api token you've generated, you will need to re-authenticate (sign-out/sign-in) to get access to profile ID's on the platform.</Text>
                                </>
                            }
                            <h3>Generate New API Token</h3>
                            <Text mt={-15}>This will generate a new access token for the ghola API. Please be aware that generating a new API token will overwrite the existing one. Make sure to save the new token securely as it will only be shown once and it will serve as the only means of accessing your API features. In case of loss or misplacement, generating a replacement token will be necessary.</Text>
                            <Button mt='md' color='grape' onClick={() => {setModalOpened(true)}} fullWidth>Generate Token</Button>
                        </Card>
                    </Center>
                    <Center>
                        <Card my='xl' shadow='sm' p='md' pt={0} radius='md' style={{width: '100%', maxWidth: '600px'}}>
                            <Center>
                                <h2>Integration Guide</h2>
                            </Center>
                            <Divider/>
                            <h3>Overview</h3>
                            <Text mt={-15}>Designed to be versatile and user-friendly, the ghola API enables developers to access a wide range of features and capabilities. From initiating conversations with predefined profiles, logging conversations to managing customer chat sessions, the API offers extensive control and flexibility. Leveraging the power of natural language processing, developers can harness the power of ghola chat bot profiles to enhance customer support, streamline communication, and provide personalized user interactions.</Text>
                            <br></br>
                            <Text>The ghola API also provides robust security measures, ensuring the protection of sensitive data and maintaining the privacy of users. With encryption protocols and JWT authentication mechanisms in place, developers can confidently build chat bot applications that adhere to industry standards and safeguard user information.</Text>
                            <h3>Step 1 - Initialize a Conversation</h3>
                            <Text mt={-15}>In order to start a new conversation a chat session must first be initialized. This is done by first sending a POST request to our initialization endpoint <Code color='grape'>https://ghola.ai/api/v1/chat/init</Code> with some info to set up the chat session including:</Text>
                            <Title order={5} mt='md' mb={4} ml={4}>Request</Title>
                            <Table mb='lg' highlightOnHover withBorder withColumnBorders>
                                <thead>
                                    <tr>
                                        <th>Parameter</th>
                                        <th>Type</th>
                                        <th>Description</th>
                                        <th>Required</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>token</td>
                                        <td>string</td>
                                        <td>The API token generated from the developer dashboard</td>
                                        <td>Yes</td>
                                    </tr>
                                    <tr>
                                        <td>email</td>
                                        <td>string</td>
                                        <td>The email for the developer ghola account</td>
                                        <td>Yes</td>
                                    </tr>
                                    <tr>
                                        <td>profileId</td>
                                        <td>string</td>
                                        <td>The ID of the profile to initialize the chat session with</td>
                                        <td>Yes</td>
                                    </tr>
                                    <tr>
                                        <td>enableLogging</td>
                                        <td>boolean</td>
                                        <td>Whether or not to enable logging for the chat session</td>
                                        <td>No</td>
                                    </tr>
                                    <tr>
                                        <td>customerId</td>
                                        <td>string</td>
                                        <td>A customer ID to initialize the chat session with</td>
                                        <td>No</td>
                                    </tr>
                                </tbody>
                            </Table>
                            <Text>The response will contain a JWT token <strong>in the response payload</strong>, which will be used by the client side application to send chat messages securely. The chat session will be valid for 1 hour after which a new chat session will need to be initialized.</Text>
                            <Title order={5} mt='md' mb={4} ml={4}>Response</Title>
                            <Table mb='lg' highlightOnHover withBorder withColumnBorders>
                                <thead>
                                    <tr>
                                        <th>Parameter</th>
                                        <th>Type</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>jwt</td>
                                        <td>string</td>
                                        <td>The JWT token to be passed back to the client side application as a cookie</td>
                                    </tr>
                                </tbody>
                            </Table>
                            <Text><strong>Important: </strong> In order to protect your ghola API token and email, it is recommended that you set up your own initialization endpoint to call the ghola initialization endpoint. This endpoint should be responsible for initiating a conversation with your desired chat bot profile ID, enabling conversation logging, and/or specifying a customerId to initialize the chat session with. Once it has properly initialized the chat session through the ghola api, it's final job is to pass this token back to the user using the HTTP <Code color='grape'>Set-Cookie</Code> header, and specifying a cookie name of <Code color='grape'>gholaJwt</Code>.</Text>
                            <br></br>
                            <Text>Doing this will ensure your email/API token is only available on the back-end and will avoid having to store it in any client side front end code. Despite that, we still support users who wish to hit the ghola initialization endpoint directly from their front end client application, however it is strongly discouraged since your API token will then be exposed publicly.</Text>
                            <h3>Step 2 - Sending Messages</h3>
                            <Text mt={-15}>Once a chat session has been initialized and the client side JWT cookie has been set, the application can send messages to the ghola API to be processed by the chat bot. This is done by sending a POST request to our message endpoint <Code color='grape'>https://ghola.ai/api/v1/chat</Code> with the conversation messages:</Text>
                            <Title order={5} mt='md' mb={4} ml={4}>Request</Title>
                            <Table mb='lg' highlightOnHover withBorder withColumnBorders>
                                <thead>
                                    <tr>
                                        <th>Parameter</th>
                                        <th>Type</th>
                                        <th>Description</th>
                                        <th>Required</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>messages</td>
                                        <td>array</td>
                                        <td>An array of message objects representing the conversation</td>
                                        <td>Yes</td>
                                    </tr>
                                </tbody>
                            </Table>
                            <Text mb='xs'>An example message object looks like:</Text>
                            <Code block>
                                {`{
    "role": "user",
    "content": "Hello there!"
}`}
                            </Code>
                            <Text mt='lg' mb='xs'>And an example request conversation with multiple messages will look like:</Text>
                            <Code block>
                                {`[{
    "role": "assistant",
    "content": "Hello there! How may I help you today?"
}, {
    "role": "user",
    "content": "I need help with my order"
}, {
    "role": "assistant",
    "content": "Sure thing! What is your order number?"
}]`}
                            </Code>
                            <Text mt='lg' mb='xs'>The response will contain the chat bot's response to the messages sent in the request:</Text>
                            <Title order={5} mt='md' mb={4} ml={4}>Response</Title>
                            <Table mb='lg' highlightOnHover withBorder withColumnBorders>
                                <thead>
                                    <tr>
                                        <th>Parameter</th>
                                        <th>Type</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>message</td>
                                        <td>string</td>
                                        <td>The chat bots generated message</td>
                                    </tr>
                                </tbody>
                            </Table>
                            <Text mt='lg' mb='xs'><strong>Pro Tip:</strong> Sending a chat request with an empty array of messages will cause the chat bot to initiate the conversation, leveraging this is a great way to kick off the conversation in a seamless and organic way!</Text>
                        </Card>
                    </Center>
                </Container>
                <Modal opened={modalOpened} onClose={() => setModalOpened(false)} centered>
                    <Center mt={-50}><h2>Warning</h2></Center>
                    <Text align='center' mt={-10}>The following action will generate a fresh access token for the ghola API, replacing the existing API token. It is essential to update all instances that utilize the API token to prevent any disruptions to your services caused by this action.</Text>
                    <Button mt='md' color='grape' onClick={() => {handleGenerateToken()}} fullWidth>Confirm</Button>
                </Modal>
            </div>
        </>
    );
}