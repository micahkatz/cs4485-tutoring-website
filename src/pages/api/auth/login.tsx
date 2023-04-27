// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma, tutor, user } from '@prisma/client';
import { UserWithoutPassword } from '@/types/globals';
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient();


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<UserWithoutPassword | string>
) {
    const isPasswordCorrect = async (password: string, storedPassword: string) => {
        const result = await bcrypt.compare(password, storedPassword) as boolean

        return result
    }
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
                    },
                });

                if (!userResult) {
                    res.status(5).send(
                        `Could not  ${email}`
                    );
                } else {
                    console.log('calling isPasswordCorrect', userResult, body)
                    const hasCorrectPassword = await isPasswordCorrect(password, userResult.password,)
                    if (hasCorrectPassword) {
                        const { password: resultPass, ...withoutPassword } = userResult
                        res.status(200).json(withoutPassword);
                    } else {
                        res.status(401).send('Invalid Username or Password')
                    }
                }

            } catch (error) {
                console.error(error);
                res.status(500).send('Server Error');
            }

            break;
        default:
            res.status(405).send('Invalid Request Method');
    }
}
