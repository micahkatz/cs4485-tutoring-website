// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma, tutor, user } from '@prisma/client';
import { UserWithoutPassword } from '@/types/globals';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<UserWithoutPassword | string>
) {
    switch (req.method) {
        case 'POST': // POST is create new
            const body = req.body as user;

            try {
                const { userID, ...withoutId } = body;

                const foundUser = await prisma.user.findFirst({
                    where: {
                        email: body.email,
                    },
                });

                if (!foundUser) {
                    const createResponse = await prisma.user.create({
                        data: withoutId,
                    });

                    if (!createResponse) {
                        res.status(500).send(`Could not sign up`);
                    } else {
                        const { password: resultPass, ...withoutPassword } =
                            createResponse;

                        res.status(200).json(withoutPassword);
                    }
                } else {
                    res.status(409).send('User already exists');
                }
            } catch (error) {
                console.error(error);
                res.status(500).send('Server Error');
            }

            break;
        case 'PUT': // PUT is update
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

                const { password: resultPass, ...withoutPassword } =
                    updateResponse;

                res.status(200).json(withoutPassword);
            } catch (error) {
                console.error(error);
                res.status(500).send('Server Error');
            }

            break;
        default:
            res.status(405).send('Invalid Request Method');
    }
}
