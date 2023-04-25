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
        case 'POST':
            type GetReqType = {
                email: string;
                password: string;
            }
            const body = req.body as GetReqType;

            console.log('SERVER /auth/login', body)

            try {
                const { email, password } = body

                const userResult = await prisma.user.findFirst({
                    where: {
                        email,
                        password,
                    },
                });
                if (!userResult) {
                    res.status(404).send(
                        `Could not find a user with email ${email}`
                    );
                }

                const { password: resultPass, ...withoutPassword } = userResult
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
