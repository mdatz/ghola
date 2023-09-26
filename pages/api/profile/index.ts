import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { getToken } from 'next-auth/jwt';
import { authOptions } from "../auth/[...nextauth]";
import { BLACKLISTED_USER_IDS } from '../../../constants/PUBLIC_BLACKLIST';

import isURL from 'validator/lib/isURL';
import xss from 'xss';

import mongooseConnector from '../../../lib/db/mongooseConnector';
import Profile from '../../../models/profile';

export default async (req: NextApiRequest, res: NextApiResponse) => {

        if(req.method !== 'POST' && req.method !== 'GET' && req.method !== 'PUT' && req.method !== 'DELETE') {
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

                const profiles = await Profile.find({ creator: token.uid });
                res.status(200).json({
                    message: 'Profiles fetched successfully',
                    data: profiles,
                });

                return;

            } catch(error) {
                console.log(error);
                res.status(500).json({
                    message: 'Error fetching profiles',
                });
                return;
            }

        }else if(req.method === 'POST') {

            const { name, description, imageUrl, visibility }: { name: string, description: string, imageUrl: string, visibility: string } = req.body;
            if(!name || !description || !imageUrl || !visibility) {
                res.status(400).json({
                    message: 'Missing profile data'
                });
                return;
            }
    
            if(!isURL(imageUrl)) {
                res.status(400).json({
                    message: 'Invalid image url'
                });
                return;
            }

            try{
                await mongooseConnector();
            }catch(error) {
                console.log(error);
                res.status(500).json({
                    message: 'Error connecting to database',
                });
                return;
            }

            if(description.length > 2500) {
                res.status(400).json({
                    message: 'Description too long'
                });
                return;
            }

            try{
                const cleanedName = xss(name);
                const cleanedDescription = xss(description);

                const profilePreamble = `Please only respond as ${cleanedName} and role play as if ${cleanedName} was sending a response text message to the following conversation. The detailed character description of ${cleanedName} is as follows: ${cleanedDescription}.`;

                const moderation = await fetch('https://api.openai.com/v1/moderations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.OPEN_AI_KEY}`
                    },
                    body: JSON.stringify({
                        input: profilePreamble,
                    })
                });

                const moderationData = await moderation.json();
                if(moderationData.results[0].flagged) {
                    res.status(400).json({
                        message: 'Profile description or name fails moderation checks',
                        categories: moderationData.results[0].categories,
                        scores: moderationData.results[0].category_scores
                    });
                    return;
                }

                const profile = new Profile({
                    name: cleanedName,
                    description: cleanedDescription,
                    imageUrl: imageUrl,
                    visibility: visibility,
                    creator: token.uid,
                    messageCount: 0,
                    favouriteCount: 0
                });

                await profile.save();

                res.status(201).json({
                    message: 'Profile created successfully',
                });
                
                return;
            } catch(error) {
                console.log(error);
                res.status(500).json({
                    message: 'Error creating profile',
                });
                return;
            }

        } else if(req.method === 'PUT') {

            const { _id, name, description, imageUrl, visibility, creator }: { _id: string, name: string, description: string, imageUrl: string, visibility: string, creator: string } = req.body;
            if(!name || !description || !imageUrl || !visibility || !_id || !creator) {
                res.status(400).json({
                    message: 'Missing profile data'
                });
                return;
            }
    
            if(!isURL(imageUrl)) {
                res.status(400).json({
                    message: 'Invalid image url'
                });
                return;
            }

            if(creator !== token.uid) {
                res.status(401).json({
                    message: 'Unauthorized'
                });
                return;
            }
    
            try{
                await mongooseConnector();
            }catch(error) {
                console.log(error);
                res.status(500).json({
                    message: 'Error connecting to database',
                });
                return;
            }

            if(description.length > 2500) {
                res.status(400).json({
                    message: 'Description too long'
                });
                return;
            }
    
            try{
                
                const cleanedName = xss(name);
                const cleanedDescription = xss(description);

                const profilePreamble = `Please only respond as ${cleanedName} and role play as if ${cleanedName} was sending a response text message to the following conversation. The detailed character description of ${cleanedName} is as follows: ${cleanedDescription}.`;

                const moderation = await fetch('https://api.openai.com/v1/moderations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.OPEN_AI_KEY}`
                    },
                    body: JSON.stringify({
                        input: profilePreamble,
                    })
                });

                const moderationData = await moderation.json();
                if(moderationData.results[0].flagged) {
                    res.status(400).json({
                        message: 'Profile description or name fails moderation checks',
                        categories: moderationData.results[0].categories,
                        scores: moderationData.results[0].category_scores
                    });
                    return;
                }

                // BLACKLISTED USER CHECK
                if(visibility === 'public') {
                    if(BLACKLISTED_USER_IDS.includes(creator)) {
                        res.status(401).json({
                            message: 'You are not allowed to create public profiles'
                        });
                        return;
                    }
                }
    
                const profile = await Profile.where({ _id: _id, creator: creator }).updateOne({
                    name: cleanedName,
                    description: cleanedDescription,
                    imageUrl: imageUrl,
                    visibility: visibility
                });

                if(profile.modifiedCount === 0) {
                    res.status(500).json({
                        message: 'Error updating profile',
                    });
                    return;
                }
    
                res.status(201).json({
                    message: 'Profile created successfully',
                });
                
                return;
            } catch(error) {
                console.log(error);
                res.status(500).json({
                    message: 'Error creating profile',
                });
                return;
            }
        } else if(req.method === 'DELETE') {
                
                const { _id, creator }: { _id: string, creator: string } = req.body;
                if(!_id || !creator) {
                    res.status(400).json({
                        message: 'Missing profile data'
                    });
                    return;
                }
    
                if(creator !== token.uid) {
                    res.status(401).json({
                        message: 'Unauthorized'
                    });
                    return;
                }
        
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
        
                    const profile = await Profile.where({ _id: _id, creator: creator }).deleteOne();
    
                    if(profile.deletedCount === 0) {
                        console.log(profile.deletedCount);
                        res.status(500).json({
                            message: 'Error deleting profile',
                        });
                        return;
                    }
        
                    res.status(201).json({
                        message: 'Profile deleted successfully',
                    });
                    
                    return;
                    
                } catch(error) {
                    console.log(error);
                    res.status(500).json({
                        message: 'Error deleting profile',
                    });
                    return;
                }
        }
}