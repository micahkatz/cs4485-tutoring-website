// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma, tutor, tutors_subjects } from '@prisma/client';
import { TutorWithSubjects } from '@/types/globals';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<TutorWithSubjects | string | null>
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
                        subjects: true,
                    },
                });
                if (!tutorResult) {
                    res.status(404).send(
                        `Could not find tutor with id ${tutorId}`
                    );
                }
                res.status(200).json(tutorResult);
            } catch (err) {
                console.error(err);
                res.status(500).send('Server Error');
            }
            break;
        default:
            res.status(405).send('Invalid Request Method');
    }
}
