
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { getToken } from 'next-auth/jwt';

import mongooseConnector from '../../../lib/db/mongooseConnector';
import Profile from '../../../models/profile';
import UsageRecord from '../../../models/usageRecord';
import SharedConversation from '../../../models/sharedConversation';
import ConversationRecord from '../../../models/conversationRecord';
import User from '../../../models/user';

export default async (req: NextApiRequest, res: NextApiResponse) => {

    if(req.method !== 'GET' && req.method !== 'DELETE') {
        res.status(405).json({
            error: 'Invalid request method'
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
        await mongooseConnector();
    }catch(error) {
        console.error('Error connecting to database')
        console.error(error);
        res.status(500).json({
            message: 'Server Error - Please try again later',
        });
        return;
    }

    if(req.method === 'GET') {

        const userData: any = {};
        let userProfiles: any;
        let userUsageRecords: any;
        let userSharedConversations: any;
        let userConversationRecords: any;
        let user: any;

        try {
            user = await User.findById(token.uid);
            userProfiles = await Profile.find({ creator: token.uid });
            userUsageRecords = await UsageRecord.find({ userId: token.uid });
            userSharedConversations = await SharedConversation.find({ creator: token.uid });
            userConversationRecords = await ConversationRecord.find({ userId: token.uid });
        } catch(error) {
            console.error('Error getting user data');
            console.error(error);
            res.status(500).json({
                message: 'Server Error - Please try again later',
            });
            return;
        }

        userData['user'] = user;
        userData['profiles'] = userProfiles;
        userData['sharedConversations'] = userSharedConversations;
        userData['conversationRecords'] = userConversationRecords;
        userData['usageRecords'] = userUsageRecords;

        res.status(200).json(userData);

    } else if(req.method === 'DELETE') {
        
        try {
            await Profile.deleteMany({ creator: token.uid });
            await UsageRecord.deleteMany({ userId: token.uid });
            await SharedConversation.deleteMany({ creator: token.uid });
            await ConversationRecord.deleteMany({ userId: token.uid });
            await User.findByIdAndDelete(token.uid);
        } catch(error) {
            console.error('Error deleting user data');
            console.error(error);
            res.status(500).json({
                message: 'Server Error - Please try again later',
            });
            return;
        }

        res.status(200).json({
            message: 'User data deleted'
        });
        
    }

}