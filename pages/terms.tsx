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
        'url(https://images.unsplash.com/photo-1571033246195-6633d62ae2c1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80)',
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
        <Paper className={classes.form} radius={0} p={30} pt={50}>
            <ScrollArea style={{height: '90vh'}}>
                <img src="/logo_dark.png" alt="logo" className={classes.logo} />
                <Title order={2} className={classes.title} align="center" mt="md" mb="xl">
                    Terms & Conditions
                </Title>
                <Text align='justify'>These Terms and Conditions ("Terms") constitute a legally binding agreement between you ("User" or "you") and Ghola ("Company" or "we" or "us"), governing your use of our web application that allows users to create chat bot personas of various characters or people and engage in conversation with them (the "Service"). By using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, you must not use the Service.</Text>
                <Title order={3} align='left' mt='md'>
                    User Accounts
                </Title>
                <Text align="justify">In order to use the Service, you may be required to create an account. You agree to provide accurate and complete information when creating your account and to keep your account information up-to-date. You are responsible for maintaining the confidentiality and security of your account, including your password, and for all activities that occur under your account. You agree to notify us immediately if you become aware of any unauthorized use of your account.</Text>
                <Title order={3} align='left' mt='md'>
                    User Content
                </Title>
                <Text align="justify">Our Service allows you to create chat bot personas of various characters or people, and engage in conversation with them. You are solely responsible for the content you create and the conversations you engage in using the Service. You agree not to create content or engage in conversations that are unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable. In particular, you agree not to create content that infringes upon the rights of any third party, including but not limited to trademarks, copyrights, privacy, and publicity rights. You acknowledge and agree that the Company does not endorse any User Content, and that User Content does not reflect the views of the Company.</Text>
                <Title order={3} align='left' mt='md'>
                    User Generated Brand or Individual Personas
                </Title>
                <Text align="justify">The Service allows users to create chat bot personas of various characters or people, including brand or individual personas. You acknowledge and agree that such personas are created by users, not by the Company, and that the Company does not endorse, control, or monitor such content. You agree to comply with all applicable laws and regulations regarding the creation of brand or individual personas, and you further agree to indemnify and hold harmless the Company from any claims, damages, or losses arising from the creation of such personas.</Text>
                <Title order={3} align='left' mt='md'>
                    Monitoring and Enforcement
                </Title>
                <Text align="justify">The Company reserves the right to monitor User Content and to remove or modify any User Content that, in our sole discretion, violates these Terms or is otherwise objectionable. We may also suspend or terminate your access to the Service if you violate these Terms or for any other reason in our sole discretion.</Text>
                <Title order={3} align='left' mt='md'>
                    Privacy
                </Title>
                <Text align="justify">Our <a style={{textDecoration: 'none'}} href="/privacy">Privacy Policy</a> explains how we collect, use, and disclose information about our users. By using our Service, you agree to our Privacy Policy.</Text>
                <Title order={3} align='left' mt='md'>
                    Disclaimer of Warranties
                </Title>
                <Text align="justify">The Service is provided "as is" and without warranties of any kind, either express or implied. The Company does not warrant that the Service will be uninterrupted or error-free, or that any defects will be corrected. You use the Service at your own risk.</Text>
                <Title order={3} align='left' mt='md'>
                    Limitation of Liability
                </Title>
                <Text align="justify">In no event shall the Company or its affiliates, officers, directors, employees, agents, or licensors be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation lost profits, data loss, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; or (iv) unauthorized access, use, or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.</Text>
                <Title order={3} align='left' mt='md'>
                    Indemnification
                </Title>
                <Text align="justify">You agree to indemnify, defend, and hold harmless the Company and its affiliates, officers, directors, employees, agents, and licensors from and against any and all claims, damages, obligations, losses, liabilities, costs, and expenses (including attorneys' fees) arising from or in connection with (i) your use of the Service; (ii) your User Content; (iii) your violation of these Terms; (iv) your violation of any rights of another; or (v) any claim that your User Content infringes upon or misappropriates the intellectual property rights or other proprietary rights of a third party.</Text>
                <Title order={3} align='left' mt='md'>
                    Termination
                </Title>
                <Text align="justify">We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms. Upon termination, your right to use the Service will immediately cease. All provisions of these Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.</Text>
                <Title order={3} align='left' mt='md'>
                    Governing Law and Jurisdiction
                </Title>
                <Text align="justify">These Terms and your use of the Service shall be governed by and construed in accordance with the laws of [insert governing law jurisdiction], without regard to its conflict of law provisions. Any legal action or proceeding arising out of or relating to these Terms or the Service shall be brought exclusively in [insert jurisdiction of exclusive venue], and you hereby consent to the exclusive jurisdiction of such courts.</Text>
                <Title order={3} align='left' mt='md'>
                    Changes to Terms
                </Title>
                <Text align="justify">We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least [insert notice period] days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</Text>
                <Title order={3} align='left' mt='xs'>
                    Contact Us
                </Title>
                <Text align="justify">If you have any questions about these Terms & Conditions, please contact us:</Text>
                <ul>
                    <li>By email: <a style={{textDecoration: 'none'}} href="mailto: kadatzmatthew@gmail.com">Matt Kadatz</a></li>
                </ul>
            </ScrollArea>
        </Paper>
      </div>
    );
  }