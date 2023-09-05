import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";

import mongooseConnector from '../../../../lib/db/mongooseConnector';
import User from '../../../../models/user';
import { getToken } from 'next-auth/jwt';
import crypto from 'crypto';

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
            await mongooseConnector();
        }catch(error) {
            console.error('Error connecting to database')
            console.error(error);
            res.status(500).json({
                message: 'Server Error - Please try again later',
            });
            return;
        }

        const user = await User.findOne({ email: token.email, _id: token.uid });
        if(!user) {
            res.status(401).json({
                message: 'Unauthorized'
            });
            return;
        }

        const newToken = crypto.randomUUID().replaceAll('-', '');
        user.token = newToken;

        //Cleanup
        if(!user.emailVerified) {
            user.emailVerified = true;
        }
        if(!user.image) {
            const name = user.name.replace(' ', '+');
            user.image = `https://ui-avatars.com/api/?name=${name}&background=random`;
        }

        const status = await user.save();
        if(!status) {
            res.status(500).json({
                message: 'Server Error - Please try again later',
            });
            return;
        }

        res.status(200).json({
            message: 'API Token generated',
            token: newToken
        });

        return;
}