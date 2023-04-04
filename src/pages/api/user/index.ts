// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma, tutor, user } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any | string>
) {
    switch (req.method) {
        case 'PUT': // to update a user
            const body = req.body as user;

            try {
                const { userID, ...withoutId } = body;

                const createResponse = await prisma.user.create({
                    data: withoutId,
                });

                res.status(200).json(createResponse);
            } catch (error) {
                console.error(error);
                res.status(500).send('Server Error');
            }

            break;
        case 'POST': // to update a user
            const partialBody = req.body as Partial<user>;

            if (!partialBody.userID) {
                res.status(400).send('Missing user ID');
                break;
            }

            try {
                const { userID, ...withoutId } = partialBody;

                const updateResponse = await prisma.user.update({
                    where: {
                        userID,
                    },
                    data: withoutId,
                });

                res.status(200).json(updateResponse);
            } catch (error) {
                console.error(error);
                res.status(500).send('Server Error');
            }

            break;
        default:
            res.status(405).send('Invalid Request Method');
    }
}
