// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma, tutor } from '@prisma/client';
import { tutorWithUserInfo } from '.';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<tutorWithUserInfo | string | null>
) {
    const tutorIdString = req.query.tutorId as string;

    const tutorId = parseInt(tutorIdString);
    switch (req.method) {
        case 'GET':
            try {
                const tutorResult = await prisma.tutor.findUnique({
                    where: {
                        tutorID: tutorId,
                    },
                    include: {
                        subjects: true,
                    },
                });
                if (!tutorResult) {
                    res.status(404).send(
                        `Could not find tutor with id ${tutorId}`
                    );
                    return
                }

                // Get user data
                const userData = await prisma.user.findUniqueOrThrow({
                    where: {
                        userID: tutorResult.fk_userID,
                    },
                })

                // Get subject data
                const subjectData = []
                for(let j = 0; j < tutorResult.subjects.length; j++ ) {
                    subjectData.push(await prisma.subject.findUniqueOrThrow({
                        where: {
                            subjectID: tutorResult.subjects[j].fk_subjectID
                        },
                    }))
                }
                
                // Push individual tutor with user data to array
                const fullTutor: tutorWithUserInfo = {
                    tutorID: tutorResult.tutorID,
                    userID: tutorResult.fk_userID,
                    about_me: tutorResult.about_me,
                    totalTutorHours: tutorResult.totalTutorHours,
                    subjects: subjectData,
                    email: userData.email,
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    password: userData.password,
                    totalLearnHours: userData.totalLearnHours,

                }
                res.status(200).json(fullTutor);
            } catch (err) {
                res.status(500).send('Server Error');
            }
            break;
        default:
            res.status(405).send('Invalid Request Method');
    }
}
