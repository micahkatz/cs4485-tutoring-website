// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma, tutor } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<tutor[] | string>
) {
    switch (req.method) {
        case 'GET':
            const allTutors = await prisma.tutor.findMany();
            res.status(200).json(allTutors);
            break;
        default:
            res.status(405).send('Invalid Request Method');
    }
}
