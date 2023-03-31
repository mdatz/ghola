import {
    Paper,
    createStyles,
    Text,
    Title,
    ActionIcon,
    ScrollArea,
  } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons';
import { useRouter } from 'next/router';
  
  const useStyles = createStyles((theme) => ({
    wrapperImage: {
      minHeight: '100vh',
      backgroundSize: 'cover',
      backgroundImage:
        'url(https://images.unsplash.com/photo-1669790232714-ed58d3e45316?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2232&q=80)',
    },
  
    form: {
      borderRight: `1px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
      }`,
      minHeight: '100vh',
      maxWidth: 650,
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

    const { classes } = useStyles();
    const router = useRouter();

    return (
      <div className={classes.wrapperImage}>
        <div style={{position: 'absolute', top: 25, left: 25}}>
            <ActionIcon size="xl" radius="xl" onClick={() => {router.push('/')}}>
                <IconArrowLeft size={24} stroke={1.5} />
            </ActionIcon>
        </div>
        <Paper className={classes.form} radius={0} p={30}>
        <ScrollArea style={{height: '90vh'}}>
                <img src="/logo_dark.png" alt="logo" className={classes.logo} />
                <Title order={2} className={classes.title} align="center" mt="md" mb="xl">
                    Privacy Policy
                </Title>
                <Text align='left' mb='sm'><b>Effective date:</b> May 30, 2023</Text>
                <Text align='justify'>Ghola ("us", "we", or "our") operates the Ghola.ai (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data. We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy.</Text>
                <Title order={3} align='left' mt='md'>
                    Information Collection and Use
                </Title>
                <Text align="justify">We collect several different types of information for various purposes to provide and improve our Service to you.</Text>
                <Title order={4} align='left' mt='xs'>
                    Types of Data Collected
                </Title>
                <Title order={5} align='left' mt='xs'>
                    Personal Data
                </Title>
                <Text align="justify">While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:</Text>
                <ul>
                    <li>Email address</li>
                    <li>First name and last name</li>
                    <li>Cookies and Usage Data</li>
                </ul>
                <Title order={5} align='left'>
                    Usage Data
                </Title>
                <Text align="justify">We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers, and other diagnostic data.</Text>
                <Title order={5} align='left' mt='xs'>
                    Tracking & Cookies Data
                </Title>
                <Text align="justify">We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with small amounts of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device. Tracking technologies also used are beacons, tags, and scripts to collect and track information and to improve and analyze our Service. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.</Text>
                <Title order={4} align='left' mt='xs'>
                    Use of Data
                </Title>
                <Text align="justify">Ghola uses the collected data for various purposes:</Text>
                <ul>
                    <li>To provide and maintain the Service</li>
                    <li>To notify you about changes to our Service</li>
                    <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
                    <li>To provide customer care and support</li>
                    <li>To provide analysis or valuable information so that we can improve the Service</li>
                    <li>To monitor the usage of the Service</li>
                    <li>To detect, prevent and address technical issues</li>
                </ul>
                <Title order={4} align='left' mt='xs'>
                    Transfer of Data
                </Title>
                <Text align="justify">Your information, including Personal Data, may be transferred to - and maintained on - computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction. If you are located outside [insert country where the Service is provided] and choose to provide information to us, please note that we transfer the data, including Personal Data, to [insert country where the Service is provided] and process it there. Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer. We will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy and no transfer of your Personal Data will take place to an organization or a country unless there are adequate controls in place, including the security of your data and other personal information.</Text>
                <Title order={4} align='left' mt='xs'>
                    Disclosure of Data
                </Title>
                <Title order={5} align='left' mt='xs'>
                    Business Transaction
                </Title>
                <Text align="justify">If Ghola is involved in a merger, acquisition, or asset sale, your Personal Data may be transferred. We will provide notice before your Personal Data is transferred and becomes subject to a different Privacy Policy.</Text>
                <Title order={5} align='left' mt='xs'>
                    Disclosure for Law Enforcement
                </Title>
                <Text align="justify">Under certain circumstances, Ghola may be required to disclose your Personal Data if required to do so by law or in response to valid requests by public authorities (e.g. a court or a government agency).</Text>
                <Title order={5} align='left' mt='xs'>
                    Legal Requirements
                </Title>
                <Text align="justify">Ghola may disclose your Personal Data in the good faith belief that such action is necessary to:</Text>
                <ul>
                    <li>To comply with a legal obligation</li>
                    <li>To protect and defend the rights or property of Ghola</li>
                    <li>To prevent or investigate possible wrongdoing in connection with the Service</li>
                    <li>To protect the personal safety of users of the Service or the public</li>
                    <li>To protect against legal liability</li>
                </ul>
                <Title order={4} align='left' mt='xs'>
                    Security of Data
                </Title>
                <Text align="justify">The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</Text>
                <Title order={4} align='left' mt='xs'>
                    Service Providers
                </Title>
                <Text align="justify">We may employ third party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used. These third parties have access to your message body only to perform these tasks on our behalf.</Text>
                <Title order={4} align='left' mt='xs'>
                    Links to Other Sites
                </Title>
                <Text align="justify">Our Service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.</Text>
                <Title order={4} align='left' mt='xs'>
                    Children's Privacy
                </Title>
                <Text align="justify">Our Service does not address anyone under the age of 13 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.</Text>
                <Title order={4} align='left' mt='xs'>
                    Changes to This Privacy Policy
                </Title>
                <Text align="justify">We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the "effective date" at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</Text>
                <Title order={4} align='left' mt='xs'>
                    Contact Us
                </Title>
                <Text align="justify">If you have any questions about this Privacy Policy, please contact us:</Text>
                <ul>
                    <li>By email: <a style={{textDecoration: 'none'}} href="mailto: kadatzmatthew@gmail.com">Matthew Kadatz</a></li>
                </ul>
            </ScrollArea>
        </Paper>
      </div>
    );
  }