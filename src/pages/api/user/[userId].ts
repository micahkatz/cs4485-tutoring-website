// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma, user } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<user | string | null>
) {
    const userIDString = req.query.userId as string;
    const userID = parseInt(userIDString);
    switch (req.method) {
        case 'GET':  // Get User based on ID
            try {
                const userResult = await prisma.user.findUnique({
                    where: {
                        userID,
                    },
                });
                if (!userResult) {
                    res.status(404).send(
                        `Could not find a user with id ${userID}`
                    );
                }
                res.status(200).json(userResult);
            } catch (err) {
                console.error(err);
                res.status(500).send('Server Error');
            }
            break;
        case 'DELETE': // Delete a User based on given ID
            try {
                const userResult = await prisma.user.findUnique({
                    where: {
                        userID,
                    },
                });
                if (!userResult) {
                    res.status(404).send(
                        `Could not find a user with id ${userID}`
                    );
                }
                await prisma.user.delete({
                    where: {
                        userID,
                    },
                })
                // send success
                res.status(200).end("Success");
            } 
            catch (err) {
                console.error(err);
                res.status(500).send('Server Error');
            }
            break;
        default:
            res.status(405).send('Invalid Request Method');
    }
}
