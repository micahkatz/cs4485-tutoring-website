// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma, tutor, user } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any | string>
) {
    switch (req.method) {
        case 'POST': // to update a user
            const body = req.body as user;

            body.first_name;
            try {
                const updateResponse = await prisma.user.update({
                    where: {
                        userID: body.userID,
                    },
                    data: body,
                });

                res.status(200).json(updateResponse);
            } catch {
                res.status(500).send('Server Error');
            }

            break;
        default:
            res.status(405).send('Invalid Request Method');
    }
}
