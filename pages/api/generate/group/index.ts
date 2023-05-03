import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";

import mongooseConnector from '../../../../lib/db/mongooseConnector';
import Profile from '../../../../models/profile';
import UsageRecord from '../../../../models/usageRecord';
import { getToken } from 'next-auth/jwt';

export default async (req: NextApiRequest, res: NextApiResponse) => {

        if(req.method !== 'POST') {
            res.status(405).json({
                message: 'Method not allowed'
            });
            return;
        }

        // @ts-ignore
        const session = await getServerSession(req, res)
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
            const { messages, profiles } = req.body;
            if(!messages || !profiles) {
                res.status(400).json({
                    message: 'Missing messages and/or profiles'
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

                const srcProfiles = await Profile.find({
                    _id: {
                        $in: profiles.map((profile: { _id: string; }) => profile._id)
                    }
                });

                if(srcProfiles.length !== profiles.length) {
                    res.status(400).json({
                        message: 'One or more of the profiles do not exist!'
                    });
                    return;
                }

                srcProfiles.forEach((srcProfile: { visibility: string; creator: string; }) => {
                    if(srcProfile.visibility === 'private' && srcProfile.creator.toString() !== token.uid) {
                        res.status(400).json({
                            message: 'One or more of the profiles is not public'
                        });
                        return;
                    }
                });

            }catch(error) {
                console.error('Error retrieving profiles!');
                console.error(error);
                res.status(400).json({
                    message: 'Profile does not exist'
                });
            }

            if(messages.length > 0 && messages[messages.length - 1].role === 'user') {
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

            let _profiles = profiles;
            if(messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
                _profiles = _profiles.filter((profile: { _id: string; }) => profile._id !== messages[messages.length - 1].profileId);
            }
            const profile = _profiles[Math.floor(Math.random() * _profiles.length)];
            
            let systemPreamble = '';
            if(!profile.description) {
                systemPreamble = `Please role play as the character ghola and role play as if ghola was sending a text message response to the following fictional conversation.\n
                                  [ADDITIONAL CONTEXT]\n
                                    - Please DO NOT include any formatting like: ${profile.name}:\n
                                    - Please DO NOT wrap your response with quotation marks\n
                                  [CHARACTER DESCRIPTION]\n
                                    - ghola is a kind and jolly fellow, but also a bit of a trickster. He would be considered chaotic good and is always looking for a good time.`;
            } else if(!messages.length) {
                systemPreamble = `Please role play and respond with a conversation starter role playing as if ${profile.name} was beginning a fictional group text message conversation on a random subject or topic of your choice.\n
                                  [ADDITIONAL CONTEXT]\n
                                    - Please DO NOT include any formatting like: ${profile.name}:\n
                                    - Please DO NOT wrap your response with quotation marks\n
                                  [CHARACTER DESCRIPTION]\n
                                    - ${profile.description}`;
            } else {
                systemPreamble = `Please only respond as ${profile.name} and role play as if ${profile.name} was sending a response text message to the following fictional group conversation.\n
                                  [ADDITIONAL CONTEXT]\n
                                    - Please include this exact formatting: ${profile.name}:\n
                                    - You are ALLOWED to call ${token.name} by a nickname or shortened name\n
                                    - DO NOT RESPOND as ${token.name}, only as if you were ${profile.name}\n
                                  [CHARACTER DESCRIPTION]\n
                                    - ${profile.description}`;
            }

            const constrainedMessages = messages.slice(-12);
            for(let i = 0; i < constrainedMessages.length; i++) {
                const message = constrainedMessages[i];
                if (message.content.length > 1000 && message.role === 'user') {
                    message.content = message.content.slice(0, 1000);
                }
                if (message.role === 'user') {
                    message.content = `${token.name}: ` + message.content;
                }
                delete message.profileId;
            }

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
                    user: token.uid,
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
                await Profile.findByIdAndUpdate(profile._id, {
                    $inc: { messageCount: 1 }
                });
            }catch(error) {
                console.error('Error updating profile message & token count')
                console.error(error);
            }

            try{
                const usageRecord = await UsageRecord.findOne({ userId: token.uid, date: new Date().setHours(0,0,0,0) });
                if(usageRecord) {
                    await UsageRecord.findByIdAndUpdate(usageRecord._id, {
                        $inc: { messageCount: 1, tokenCount: data.usage.total_tokens }
                    });
                }else{
                    await UsageRecord.create({
                        userId: token.uid,
                        date: new Date().setHours(0,0,0,0),
                        messageCount: 1,
                        tokenCount: data.usage.total_tokens
                    });
                }
            }catch(error) {
                console.error('Error updating usage record')
                console.error(error);
            }

            res.status(200).json({
                message: !messages.length ? `${profile.name}: ` + data.choices[0].message.content : data.choices[0].message.content,
                profileId: profile._id,
            });

        } catch(error) {
            console.log(error);
            res.status(500).json({
                message: 'Error retrieving response',
            });
        }
}