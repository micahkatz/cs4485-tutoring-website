// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma, tutors_subjects } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<tutors_subjects[] | string | null>
) {
    const tutorIdString = req.query.tutorId as string;

    const tutorId = parseInt(tutorIdString);
    switch (req.method) {
        case 'GET':
            try {
                const tutorResult = await prisma.tutor.findUnique({
                    where: {
                        fk_userID: tutorId,
                    },
                    include: {
                        subjects: true
                    }
                });
                if (!tutorResult) {
                    res.status(404).send(
                        `Could not find tutor with id ${tutorId}`
                    );
                    return
                }
                let subjects = tutorResult.subjects
                res.status(200).json(subjects);
            } catch (err) {
                res.status(500).send('Server Error');
            }
            break;
        default:
            res.status(405).send('Invalid Request Method');
    }
}
