import { NextApiRequest, NextApiResponse } from 'next';

import mongooseConnector from '../../../../lib/db/mongooseConnector';
import Profile from '../../../../models/profile';
import ConversationRecord from '../../../../models/conversationRecord';
import User from '../../../../models/user';

const DEFAULT_QUERY_LIMIT = 1000;
const DEFAULT_QUERY_PAGE = 0;

export default async (req: NextApiRequest, res: NextApiResponse) => {

    if(req.method !== 'POST') {
        res.status(405).json({
            message: 'Method not allowed'
        });
        return;
    }

    const { token, email } = req.body;
    const { conversationId, customerId, profileId, startDate, endDate, loggingEnabled, includeSubobjects, limit, page } = req.query;

    if(!token || !email) {
        res.status(400).json({
            message: 'Missing token, email and/or profileId in request'
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
        const user = await User.findOne({ email, token });

        if(!user) {
            console.log('No user found, please check email and api token in request body');
            res.status(400).json({
                message: 'No user found, please check email and api token in request body'
            });
            return;
        }

        const query:any = {
          'userId': user._id,
        }; 

        const queryLimit = limit ? +limit : DEFAULT_QUERY_LIMIT;
        const queryPage = page ? +page : DEFAULT_QUERY_PAGE;
        
        if(conversationId) {
            query['_id'] = conversationId;
        }

        if(customerId) {
            query['customerId'] = customerId;
        }
        
        if(profileId) {
            query['profileId'] = profileId;
        }
        
        //@ts-ignore
        if(loggingEnabled && loggingEnabled.toLowerCase() === 'true') {
            query['loggingEnabled'] = true;
        }

        if(startDate) {
            query['createdAt'] = {"$gte" : startDate};
        }

        if(endDate) {
            query['createdAt'] = {...query['createdAt'], "$lte" : endDate}
        }
        
        let conversationRecords:any = null;
        try{
            //@ts-ignore
            if(includeSubobjects && includeSubobjects.toLowerCase() === 'true') {
                await Profile.init();
                conversationRecords = await ConversationRecord.find(query).limit(queryLimit).skip(queryPage * queryLimit).populate('profileId', 'name description imageUrl messageCount').select('-userId -usageId -__v');
            } else {
                conversationRecords = await ConversationRecord.find(query).limit(queryLimit).skip(queryPage * queryLimit).select('-userId -usageId -__v');
            }

        } catch(e) {
            console.log(e);
            res.status(500).json({
                message: 'Error - Unable to retrieve conversation records, please try again later'
            });
            return;
        }

        res.status(200).json({
            message: 'Successfully retrieved conversation records',
            page: queryPage,
            limit: queryLimit,
            records: conversationRecords,
        });
        return;

    } catch(error) {
        console.error(error);
        res.status(500).json({
            message: 'Server Error - Please try again later',
        });
        return;
    }
            
}

