import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

import mongooseConnector from '../../../../lib/db/mongooseConnector';
import SharedConversation from '../../../../models/sharedConversation';
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

        if(req.method === 'POST') {
            try{
                const { conversationId, count } = req.body;
                if(!conversationId || !count) {
                    res.status(400).json({
                        message: 'Bad request missing conversation id and/or count'
                    });
                    return;
                }
    
                if(count < -1 || count > 1) {
                    res.status(400).json({
                        message: 'Count must be either -1 or 1'
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
                    const sharedConversation = await SharedConversation.findById(conversationId);
                    if(!sharedConversation) {
                        res.status(404).json({
                            message: 'Conversation not found'
                        });
                        return;
                    }

                    sharedConversation.likeCount += count;
                    await sharedConversation.save();

                    res.status(200).json({
                        message: 'Conversation liked successfully'
                    });
                }catch(error) {
                    console.error('Error updating shared conversation');
                    console.error(error);
                    res.status(500).json({
                        message: 'Error updating conversation, please try again later'
                    });
                    return;
                }

            } catch(error) {
                console.log(error);
                res.status(500).json({
                    message: 'Error retrieving response',
                });
                return;
            }
        } else {
            
        }
}