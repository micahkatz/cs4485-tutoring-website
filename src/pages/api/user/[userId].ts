// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma, user } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<user | string | null>
) {
    const userIdString = req.query.userId as string;

    const userId = parseInt(userIdString);
    switch (req.method) {
        case 'GET':
            try {
                const userResult = await prisma.user.findUnique({
                    where: {
                        userID: userId,
                    },
                });
                if (!userResult) {
                    res.status(404).send(
                        `Could not find tutor with id ${userId}`
                    );
                }
                res.status(200).json(userResult);
            } catch (err) {
                res.status(500).send('Server Error');
            }
            break;
        default:
            res.status(405).send('Invalid Request Method');
    }
}
