// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma, tutor, tutors_subjects } from '@prisma/client';

const prisma = new PrismaClient();

type TutorWithSubjects = tutor & {
    subjects: tutors_subjects[];
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<TutorWithSubjects[] | string | tutor>
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
        case 'POST': // POST is create new
            const body = req.body as tutor;

            try {

                const createResponse = await prisma.tutor.create({
                    data: body
                });

                res.status(200).json(createResponse);
            } catch (error) {
                console.error(error);
                res.status(500).send('Server Error');
            }

            break;
        case 'PUT': // PUT is update
            const partialBody = req.body as Partial<tutor>;

            if (!partialBody.fk_userID) {
                res.status(400).send('Missing foreign user ID');
                break;
            }

            try {
                const { fk_userID, ...withoutId } = partialBody;

                const updateResponse = await prisma.tutor.update({
                    where: {
                        fk_userID,
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
