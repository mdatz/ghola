import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

import mongooseConnector from '../../../../lib/db/mongooseConnector';
import SharedConversation from '../../../../models/sharedConversation';
import Profile from '../../../../models/profile';
import { getToken } from 'next-auth/jwt';

// import WeaviateClient from 'weaviate-ts-client';

export default async (req: NextApiRequest, res: NextApiResponse) => {

        if(req.method !== 'POST' && req.method !== 'GET') {
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
                const { messages, highlightedMessages, profile } = req.body;
                console.log(profile);
                if(!messages || !profile || !highlightedMessages) {
                    res.status(400).json({
                        message: 'Missing highlighted messages and/or profile'
                    });
                    return;
                }
    
                if(messages.length < 3 || highlightedMessages.length < 3) {
                    res.status(400).json({
                        message: 'Highlighted conversation is too short'
                    });
                    return;
                }
    
                if(highlightedMessages.length > 40) {
                    res.status(400).json({
                        message: 'Highlighted conversation is too long'
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
                    return;
                }
                
                try{
                    const sharedConversation = new SharedConversation({
                        profile: profile,
                        rawMessages: messages,
                        messages: highlightedMessages,
                        creator: token.uid,
                    });
                    await sharedConversation.save();
                    res.status(200).json({
                        message: 'Conversation shared successfully'
                    });
                }catch(error) {
                    console.error('Error creating shared conversation');
                    console.error(error);
                    res.status(500).json({
                        message: 'Error creating profile, please try again later'
                    });
                    return;
                }

                //Send conversation data to weaviate
                // const client = WeaviateClient.client({
                //     scheme: 'https',
                //     host: process.env.WEAVIATE_URL ?? '',
                //     apiKey: new WeaviateClient.ApiKey(process.env.WEAVIATE_KEY ?? ''),
                //     headers: {'X-OpenAI-Api-Key': process.env.OPEN_AI_KEY ?? ''},
                // });

                // let classObj = {
                //     'class': 'Conversation4',
                //     'description': 'A conversation between two individuals, 1 message each back and forth',
                //     'vectorizeClassName': true,
                //     'properties': [
                //         {
                //         'dataType': [
                //             'string'
                //         ],
                //         'description': JSON.stringify(messages),
                //         'name': 'messages',
                //         'vectorizePropertyName': true,
                //         'index': true
                //         },
                //         {
                //         'dataType': [
                //             'text'
                //         ],
                //         'description': JSON.stringify(profile),
                //         'name': 'profileName'
                //         }
                //     ]
                // }

                // client
                // .schema
                // .classCreator()
                // .withClass(classObj)
                // .do()
                // .then(res => {
                //     client.graphql
                //         .get()
                //         .withClassName('Conversation4')
                //         .withFields('profileName messages')
                //         .do()
                //         .then(res => {
                //             console.log(res)
                //         })
                //         .catch(err => {
                //             console.error(err)
                //         });
                // })
                // .catch(err => {
                //     console.error(err)
                // });

            } catch(error) {
                console.log(error);
                res.status(500).json({
                    message: 'Error retrieving response',
                });
                return;
            }
        } else if (req.method === 'GET') {
            const page = req.query.page ? parseInt(req.query.page.toString()) : 1;
            const limit = 2;
            let isEnd = false;
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
                const totalCount = await SharedConversation.countDocuments({});
                const sharedConversation = await SharedConversation.find({}).select("-rawMessages").sort({likeCount: -1}).skip(page-1).limit(limit).populate('profile');
                if(sharedConversation.length < 2) {isEnd = true;}
                res.status(200).json({
                    sharedConversation: sharedConversation[0],
                    totalCount
                });
            }catch(error) {
                console.error('Error retrieving shared conversations');
                console.error(error);
                res.status(500).json({
                    message: 'Server Error - Please try again later',
                });
            }
        }
}