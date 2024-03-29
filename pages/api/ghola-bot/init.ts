import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {

        if(req.method !== 'POST') {
            res.status(405).json({
                message: 'Method not allowed'
            });
            return;
        }

        const { customerId, profileId } = req.body;

        try{
            const response = await axios.post(`${process.env.GHOLA_API_URL}/api/v1/chat/init`, {
                token: process.env.GHOLA_API_TOKEN,
                email: process.env.GHOLA_API_EMAIL,
                profileId: profileId ?? process.env.GHOLA_API_PROFILE_ID,
                enableLogging: false,
                customerId
            });

            if(response.status !== 200) {
                res.status(500).json({
                    message: 'Server Error - Please try again later',
                });
                return;
            }

            const jwt = response.data.jwt;
            if(!jwt) {
                res.status(500).json({
                    message: 'Server Error - Please try again later',
                });
                return;
            }

            res.setHeader('Set-Cookie', `gholaJwt=${jwt}; Path=/; HttpOnly`);
            res.status(200).json({
                message: 'Conversation initialized, valid for 1 hours',
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