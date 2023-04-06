import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

import mongooseConnector from '../../../lib/db/mongooseConnector';
import Profile from '../../../models/profile';
import { getToken } from 'next-auth/jwt';

export default async (req: NextApiRequest, res: NextApiResponse) => {

        if(req.method !== 'POST') {
            res.status(405).json({
                message: 'Method not allowed'
            });
            return;
        }

        // @ts-ignore
        const session = await getServerSession(req, res, authOptions)
        if (!session) {
            res.send({
              error: "You must be signed in to use this API",
            });
        }

        const token = await getToken({ req });
        if(!token) {
            res.status(401).json({
                message: 'Unauthorized'
            });
            return;
        }

        try{
            const { messages, profile } = req.body;
            if(!messages || !profile) {
                res.status(400).json({
                    message: 'Missing messages and/or profile'
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

            try{
                const srcProfile = await Profile.findById(profile._id);
                if(!srcProfile) {
                    res.status(400).json({
                        message: 'Profile does not exist'
                    });
                    return;
                }
                if(srcProfile.visibility === 'private' && srcProfile.creator.toString() !== token.uid) {
                    res.status(400).json({
                        message: 'Profile is not public'
                    });
                    return;
                }

            }catch(error) {
                console.error('Error retrieving profile with id: ' + profile._id);
                console.error(error);
                res.status(400).json({
                    message: 'Profile does not exist'
                });
            }

            if(messages.length) {
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
                systemPreamble = `Please only respond as the character ghola and role play as if ghola was sending a text message response to the following conversation, the character description of ghola is a kind and jolly butler.\n
                [ADDITIONAL CONTEXT]\n
                    - Please note that the character description may not be complete, but feel free to use your imagination to play the role.\n
                    - No need for introducing yourself.`;
            } else if(!messages.length) {
                systemPreamble = `Please create a message to start a conversation as ${profile.name} and role play as if ${profile.name} was beginning a text message conversation. The conversation you are having is with the user ${token.name} (or a fun shorthand name/nickname of it) and the detailed character description of ${profile.name} is as follows: ${profile.description}.\n\n
                                  [ADDITIONAL CONTEXT]\n
                                    - Please note that the character description may not be complete, but feel free to use your imagination to play the role.\n
                                    - No need for introducing yourself.\n
                                    - Please DO NOT include any formatting like: ${profile.name}:\n
                                    - If there are no messages in the conversation, please just start the conversation.\n
                                    - Please meet all the previous requirements.`;
            } else {
                systemPreamble = `Please only respond as ${profile.name} and role play as if ${profile.name} was sending a response text message to the following conversation. The conversation you are having is with the user ${token.name} (or a fun shorthand name/nickname of it) and the detailed character description of ${profile.name} is as follows: ${profile.description}.\n\n
                                  [ADDITIONAL CONTEXT]\n
                                    - Please note that the character description may not be complete, but feel free to use your imagination to play the role.\n
                                    - No need for introducing yourself.\n
                                    - Please DO NOT include any formatting like: ${profile.name}:\n
                                    - Don't use the users name too much, it's a bit weird.\n
                                    - Please meet all the previous requirements.`;
            }

            const constrainedMessages = messages.slice(-12);
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
                    ]
                })
            });
            
            try{
                await Profile.findByIdAndUpdate(profile._id, {
                    $inc: { messageCount: 1 }
                });
            }catch(error) {
                console.error('Error updating profile message count')
                console.error(error);
            }

            const data = await response.json();
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