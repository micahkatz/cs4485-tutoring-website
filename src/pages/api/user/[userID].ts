// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma, user } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<user | string | null>
) {
    const userIDString = req.query.userID as string;

    const userID = parseInt(userIDString);
    switch (req.method) {
        case 'GET':
            try {
                const userResult = await prisma.user.findUnique({
                    where: {
                        userID
                    },
                });
                if (!userResult) {
                    res.status(404).send(
                        `Could not find a user with id ${userID}`
                    );
                }
                res.status(200).json(userResult);
            } catch (err) {
                res.status(500).send('Server Error');
            }
            break;
        // case '':
        default:
            res.status(405).send('Invalid Request Method');
    }
}
