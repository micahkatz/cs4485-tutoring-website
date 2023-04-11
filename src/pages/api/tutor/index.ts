// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma, tutor, tutors_subjects } from '@prisma/client';

const prisma = new PrismaClient();

type TutorWithSubjects = tutor & {
    subjects: tutors_subjects[];
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<TutorWithSubjects[] | string>
) {
    switch (req.method) {
        case 'GET':
            const allTutors = await prisma.tutor.findMany({
                include: {
                    subjects: true,
                },
            });
            res.status(200).json(allTutors);
            break;
        default:
            res.status(405).send('Invalid Request Method');
    }
}
