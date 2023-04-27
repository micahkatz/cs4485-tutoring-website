// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma, tutor, tutors_subjects } from '@prisma/client';
import { TutorWithSubjects } from '@/types/globals';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<tutors_subjects | string | tutor>
) {
    const body = req.body as tutors_subjects;
    switch (req.method) {
        case 'POST': // POST is create new
            try {
                const createResponse = await prisma.tutors_subjects.create({
                    data: {
                        fk_subjectID: body.fk_subjectID,
                        fk_tutorID: body.fk_tutorID
                    }
                });

                res.status(200).json(createResponse);
            } catch (error) {
                console.error(error);
                res.status(500).send('Server Error');
            }

            break;
        case 'DELETE': // Delete a tutors subject relation based on given ID
            try {
                const result = await prisma.tutors_subjects.findUnique({
                    where: {
                        fk_tutorID_fk_subjectID: body
                    },
                });
                if (!result) {
                    res.status(404).send(
                        `Could not find a subject with id ${body.fk_subjectID}`
                    );
                }
                await prisma.tutors_subjects.delete({
                    where: {
                        fk_tutorID_fk_subjectID: body
                    },
                })
                // send success
                res.status(200).end("Success");
            } 
            catch (err) {
                console.error(err);
                res.status(500).send('Server Error');
            }
            break;
        default:
            res.status(405).send('Invalid Request Method');
    }
}
