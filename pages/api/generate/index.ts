import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

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
            res.send({
              error: "You must be signed in to use this API",
            });
        }

        try{
            const { messages, profile } = req.body;
            if(!messages || !profile) {
                res.status(400).json({
                    message: 'Missing messages and/or profile'
                });
                return;
            }

            const moderation = await fetch('https://api.openai.com/v1/moderations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPEN_AI_KEY}`
                },
                body: JSON.stringify({
                    input: messages[messages.length - 1].content,
                })
            });

            const moderationData = await moderation.json();
            if(moderationData.results[0].flagged) {
                res.status(400).json({
                    message: 'Message fails moderation checks',
                    categories: moderationData.results[0].categories,
                    scores: moderationData.results[0].category_scores
                });
                return;
            }
            
            let systemPreamble = '';
            if(!profile.description) {
                systemPreamble = `Please only respond as the character ghola and role play as if you were sending a text message response to the following conversation, the character description to role play as is a kind and jolly butler.\n
                [ADDITIONAL CONTEXT]\n
                    - Please note that the character description is not complete, please use your imagination to role play as the character to give it additional depth.\n
                    - Please keep your introduction of yourself short and sweet if you choose to do so.`;
            } else {
                systemPreamble = `Please only respond as the character ${profile.name} and role play as if you were sending a text message response to continue the following conversation. The character description to role play as is as follows: ${profile.description}.\n
                                  [ADDITIONAL CONTEXT]\n
                                    - Please note that the character description is not complete, you may use your imagination to role play as the character to give it additional depth or desires.\n
                                    - Please do not include any pre formatted intro tags like [name]:`;
            }

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPEN_AI_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages:
                    [
                        {
                            "role": "system",
                            "content": systemPreamble
                        },
                        ...messages
                    ]
                })
            });
            
            const data = await response.json();
            res.status(200).json({
                message: data.choices[0].message.content
            });

        } catch(error) {
            console.log(error);
            res.status(500).json({
                message: 'Error retrieving response',
            });
        }
}