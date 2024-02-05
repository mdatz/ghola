import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";

import mongooseConnector from '../../../../lib/db/mongooseConnector';
import Profile from '../../../../models/profile';
import UsageRecord from '../../../../models/usageRecord';
import { getToken } from 'next-auth/jwt';

export const config = {
    maxDuration: 180
}

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
            res.status(401).send({
              error: "You must be signed in to use this API",
            });
            return;
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

            let srcProfiles = [];
            try{

                srcProfiles = await Profile.find({
                    _id: {
                        $in: profiles
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

            // if(messages.length > 0 && messages[messages.length - 1].role === 'user') {
            //     const moderation = await fetch('https://api.openai.com/v1/moderations', {
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/json',
            //             'Authorization': `Bearer ${process.env.OPEN_AI_KEY}`
            //         },
            //         body: JSON.stringify({
            //             input: messages[messages.length - 1].content,
            //         })
            //     });

            //     const moderationData = await moderation.json();
            //     if(moderationData.results[0].flagged) {
            //         res.status(400).json({
            //             message: 'Message fails moderation checks',
            //             categories: moderationData.results[0].categories,
            //             scores: moderationData.results[0].category_scores
            //         });
            //         return;
            //     }
            // }

            let _profiles = srcProfiles;
            if(messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
                _profiles = _profiles.filter((profile: { _id: string; }) => profile._id.toString() !== messages[messages.length - 1].profileId.toString());
            }
            const profile = _profiles[Math.floor(Math.random() * _profiles.length)];
         
            let systemPreamble = `Please only respond as ${profile.name} and role play as if ${profile.name} was sending a response text message to the following group chat.\n
[CHARACTER DESCRIPTION]
- ${profile.description}\n
[ADDITIONAL CONTEXT]
- Try to vary your responses from any previous messages and avoid repeating the same message or similar phrasing\n
- Make sure to continue the conversation and respond to the previous messages as insightfully as possible\n
- Please do not sign your name at the end of the message\n
- Please start your response with: [[${profile.name}]]`;

            const constrainedMessages = messages.slice(-12);
            for(let i = 0; i < constrainedMessages.length; i++) {
                
                const message = constrainedMessages[i];
                if (message.content.length > 1000 && message.role === 'user') {
                    message.content = message.content.slice(0, 1000);
                }
                
                if(message.role === 'assistant') {
                    message.content = `[[${message.profileName}]] ${message.content}`
                } else {
                    message.content = `[[User]] ${message.content}`
                }
                
                delete message.profileId;
                delete message.profileName;
                delete message.profileImage;
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

            const message = data.choices[0].message.content.replace(/\[\[.*?\]\]/g, '').replace(/^\s+|\s+$/g, '');
            res.status(200).json({
                content: message,
                role: 'assistant',
                profileId: profile._id,
                profileName: profile.name,
                profileImage: profile.imageUrl
            });      

        } catch(error) {
            console.log(error);
            res.status(500).json({
                message: 'Error retrieving response',
            });
        }
}