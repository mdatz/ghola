import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

import mongooseConnector from '../../../../lib/db/mongooseConnector';
import SharedConversation from '../../../../models/sharedConversation';
import Profile from '../../../../models/profile';
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
            res.status(401).send({
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
            const { messages, highlightedMessages, profile } = req.body;
            if(!messages || !profile || !highlightedMessages) {
                res.status(400).json({
                    message: 'Missing highlighted messages and/or profile'
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
                        message: 'Profile is not available for this user'
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
            
            try{
                const sharedConversation = new SharedConversation({
                    profile: profile,
                    rawMessages: messages,
                    messages: highlightedMessages,
                    creator: token.uid,
                });
                await sharedConversation.save();
            }catch(error) {
                console.error('Error creating shared conversation');
                console.error(error);
            }

            res.status(200).json({
                message: 'Conversation shared successfully'
            });

        } catch(error) {
            console.log(error);
            res.status(500).json({
                message: 'Error retrieving response',
            });
        }
}