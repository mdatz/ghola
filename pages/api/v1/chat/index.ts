import { NextApiRequest, NextApiResponse } from 'next';

import mongooseConnector from '../../../../lib/db/mongooseConnector';
import Profile from '../../../../models/profile';
import UsageRecord from '../../../../models/usageRecord';
import ConversationRecord from '../../../../models/conversationRecord';
import jwt from 'jsonwebtoken';

export default async (req: NextApiRequest, res: NextApiResponse) => {

        if(req.method !== 'POST') {
            res.status(405).json({
                message: 'Method not allowed'
            });
            return;
        }

        if(!req.headers.cookie) {
            res.status(401).json({
                message: 'Unauthorized'
            });
            return;
        }

        const token = ('; '+req.headers.cookie).split(`; gholaJwt=`).pop()?.split(';')[0];
        if(!token) {
            res.status(401).json({
                message: 'Unauthorized'
            });
            return;
        }

        let conversationId = null;
        try{
            const claims = jwt.verify(token, process.env.JWT_SECRET ?? '');
            if(!claims) {
                res.status(401).json({
                    message: 'Unauthorized'
                });
                return;
            }
            // @ts-ignore
            conversationId = claims.conversationId;
        }catch(error: any) {
            console.log(error);
            if(error.name === 'TokenExpiredError') {
                res.status(400).json({
                    message: 'Token expired, please start a new chat session'
                });
                return;
            } else {
                res.status(401).json({
                    message: 'Unauthorized'
                });
                return;
            }
        }

        try{
            const { messages } = req.body;
            if(!messages) {
                res.status(400).json({
                    message: 'Missing messages in request body'
                });
                return;
            }

            try{
                await mongooseConnector();
            }catch(error) {
                console.error('Error connecting to database')
                console.error(error);
                res.status(500).json({
                    message: 'Server Error - Please try again later',
                });
                return;
            }

            let conversation = null;
            try{
                conversation = await ConversationRecord.findById(conversationId);
                if(!conversation) {
                    res.status(400).json({
                        message: 'Conversation does not exist, please init a new chat session'
                    });
                    return;
                }
            }catch(error) {
                console.error('Error retrieving conversation with id: ' + conversationId);
                console.error(error);
                res.status(400).json({
                    message: 'Conversation does not exist, please init a new chat session'
                });
                return;
            }

            let usageRecord = null;
            try{
                usageRecord = await UsageRecord.findById(conversation.usageId);
                if(!usageRecord) {
                    res.status(400).json({
                        message: 'Usage record does not exist, please init a new chat session'
                    });
                    return;
                }
            }catch(error) {
                console.error('Error retrieving usage record with id: ' + conversation.usageId);
                console.error(error);
                res.status(400).json({
                    message: 'Usage record does not exist, please init a new chat session'
                });
                return;
            }

            let profile = null;
            try{
                profile = await Profile.findById(conversation.profileId);
                if(!profile) {
                    res.status(400).json({
                        message: 'Profile does not exist'
                    });
                    return;
                }
            }catch(error) {
                console.error('Error retrieving profile with id: ' + conversation.profileId);
                console.error(error);
                res.status(400).json({
                    message: 'Profile does not exist'
                });
                return;
            }

            if(conversation.loggingEnabled && messages.length) {
                conversation.messages.push(messages[messages.length - 1]);
            }

            try{
                conversation.messageCount++;
                await conversation.save();
            }catch(error) {
                console.error('Error updating conversation message count')
                console.error(error);
            }

            try{
                usageRecord.messageCount++;
                await usageRecord.save();
            }catch(error) {
                console.error('Error updating usageRecord message count')
                console.error(error);
            }
            
            if(messages.length) {
                
                if(!messages[messages.length - 1].content || !messages[messages.length - 1].role) {
                    res.status(400).json({
                        message: 'Missing content or role in last message'
                    });
                    return;
                }

                const moderation = await fetch('https://api.openai.com/v1/moderations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.OPEN_AI_KEY}`
                    },
                    body: JSON.stringify({
                        input: messages[messages.length - 1].content,
                    })
                });

                const moderationData = await moderation.json();
                if(moderationData.results[0].flagged) {
                    res.status(400).json({
                        message: 'Message fails moderation checks',
                        categories: moderationData.results[0].categories,
                        scores: moderationData.results[0].category_scores
                    });
                    return;
                }
            }
            
            let systemPreamble = '';
            if(!profile.description) {
                systemPreamble = `Please role play as the character ghola and role play as if ghola was sending a text message response to the following fictional conversation.\n
[CHARACTER DESCRIPTION]
- ghola is a kind and jolly fellow, but also a bit of a trickster. He would be considered chaotic good and is always looking for a good time.\n
[ADDITIONAL CONTEXT]
- Please DO NOT include any formatting like: ${profile.name}:
- Please DO NOT wrap your response with quotation marks`;
            } else if(!messages.length) {
                systemPreamble = `Please role play and respond with a conversation starter role playing as if ${profile.name} was beginning a fictional text message conversation.\n
[CHARACTER DESCRIPTION]
- ${profile.description}\n
[ADDITIONAL CONTEXT]
- Please DO NOT include any formatting like: ${profile.name}:
- Please DO NOT wrap your response with quotation marks`;
            } else {
systemPreamble = `Please only respond as ${profile.name} and role play as if ${profile.name} was sending a response text message to the following fictional conversation.\n
[CHARACTER DESCRIPTION]
- ${profile.description}\n
[ADDITIONAL CONTEXT]
- Please DO NOT include any formatting like: ${profile.name}:
- Please DO NOT wrap your response with quotation marks`;
            }

            const constrainedMessages = messages.slice(-12);
            constrainedMessages.forEach((message: {role: string, content: string}) => {
                if (message.content.length > 1000 && message.role === 'user') {
                    message.content = message.content.slice(0, 1000);
                }
            });

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPEN_AI_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages:
                    [
                        {
                            "role": "system",
                            "content": systemPreamble
                        },
                        ...constrainedMessages
                    ],
                    user: `${conversation.userId}:${conversation.customerId ?? 0}`,
                })
            });

            if(response.status !== 200) {
                res.status(500).json({
                    message: 'Error with chatGPT API request',
                });
                return;
            }

            const data = await response.json();
            
            try{
                profile.messageCount++;
                await profile.save();
            }catch(error) {
                console.error('Error updating profile message & token count')
                console.error(error);
            }

            try{
                usageRecord.messageCount++;
                usageRecord.tokenCount += data.usage.total_tokens;
                await usageRecord.save();

                if(conversation.loggingEnabled) {
                    conversation.messages.push(data.choices[0].message);
                }

                conversation.messageCount++;
                conversation.tokenCount += data.usage.total_tokens;
                await conversation.save();

            }catch(error) {
                console.error('Error updating usage/conversation record')
                console.error(error);
            }

            res.status(200).json({
                message: data.choices[0].message.content
            });

        } catch(error) {
            console.log(error);
            res.status(500).json({
                message: 'Error retrieving response',
            });
        }
}