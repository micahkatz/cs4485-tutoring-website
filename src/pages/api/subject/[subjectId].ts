// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma, subject } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<subject | string | null>
) {
    const subjectIdString = req.query.subjectId as string;

    const subjectId = parseInt(subjectIdString);
    switch (req.method) {
        case 'GET':
            try {
                const subjectResult = await prisma.subject.findUnique({
                    where: {
                        subjectID: subjectId,
                    },
                });
                if (!subjectResult) {
                    res.status(404).send(
                        `Could not find subject with id ${subjectId}`
                    );
                    return;
                }
                res.status(200).json(subjectResult);
            } catch (err) {
                console.error(err);
                res.status(500).send('Server Error');
            }
            break;
        default:
            res.status(405).send('Invalid Request Method');
    }
}
