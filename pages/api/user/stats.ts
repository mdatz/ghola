
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { getToken } from 'next-auth/jwt';
import mongoose from 'mongoose';

import mongooseConnector from '../../../lib/db/mongooseConnector';
import Profile from '../../../models/profile';
import UsageRecord from '../../../models/usageRecord';

export default async (req: NextApiRequest, res: NextApiResponse) => {

    if(req.method !== 'GET') {
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

    try{
        const profileCount = await Profile.countDocuments({ creator: token.uid }) ?? 0;
        const publicProfileCount = await Profile.countDocuments({ creator: token.uid, visibility: 'public' }) ?? 0;
        const privateProfileCount = await Profile.countDocuments({ creator: token.uid, visibility: 'private' }) ?? 0;
        const daysActiveCount = await UsageRecord.countDocuments({ userId: token.uid}) ?? 0;
        
        // Message count where the messageCount of each user record is added up for the user
        const messageCount = await UsageRecord.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(String(token.uid)) } },
            { $group: { _id: null, total: { $sum: "$messageCount" } } }
        ]);

        res.status(200).json({
            profileCount,
            publicProfileCount,
            privateProfileCount,
            daysActive: daysActiveCount,
            messageCount: messageCount[0]?.total ?? 0,
        });
        return;

    }catch(error) {
        console.error('Error getting stats');
        console.error(error);
        res.status(500).json({
            message: 'Server Error - Please try again later',
        });
        return;
    }
}