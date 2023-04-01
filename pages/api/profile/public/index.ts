import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { getToken } from 'next-auth/jwt';
import { authOptions } from "../../auth/[...nextauth]";

import mongooseConnector from '../../../../lib/db/mongooseConnector';
import Profile from '../../../../models/profile';

export default async (req: NextApiRequest, res: NextApiResponse) => {

        if(req.method !== 'GET') {
            res.status(405).json({
                message: 'Method not allowed'
            });
            return;
        }

        // @ts-ignore
        const session = await getServerSession(req, res, authOptions)

        if (!session) {
            res.status(401).json({
                message: 'Unauthorized'
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

        if(req.method === 'GET') {
                
            try{
                await mongooseConnector();
            }catch(error) {
                console.log(error);
                res.status(500).json({
                    message: 'Error connecting to database',
                });
                return;
            }

            try{

                const profiles = await Profile.find({ visibility: 'public' }).sort({ messageCount: -1 }).limit(16);

                //return profiles as an array of json objects
                res.status(200).json({
                    message: 'Profiles fetched successfully',
                    data: profiles,
                });

                return;

            }catch(error) {
                console.log(error);
                res.status(500).json({
                    message: 'Error fetching profiles',
                });
                return;
            }
    
        }

}