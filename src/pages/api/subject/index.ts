// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma, subject } from '@prisma/client';

const prisma = new PrismaClient();


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<subject[] | string>
) {
    switch (req.method) {
        case 'GET':
            const allSubjects = await prisma.subject.findMany();
            res.status(200).json(allSubjects);
            break;
        default:
            res.status(405).send('Invalid Request Method');
    }
}
