// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma, tutor, subject, user } from '@prisma/client';

const prisma = new PrismaClient();

export type tutorWithUserInfo = {
    tutorID: number;
    userID: number;
    about_me: string;
    totalTutorHours: number;
    subjects: subject[];
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    totalLearnHours: number;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<tutorWithUserInfo[] | string>
) {
    switch (req.method) {
        case 'GET':
            // Get tutor data 
            const allTutors = await prisma.tutor.findMany({
                include: {
                    subjects: true,
                },
            });

            // Aggregate with user data
            let allTutorsWithUserInfo: tutorWithUserInfo[] = []
            for(let i = 0; i < allTutors.length; i++ ) {
                // Get user data
                const userData = await prisma.user.findUniqueOrThrow({
                    where: {
                        userID: allTutors[i].fk_userID,
                    },
                })

                // Get subject data
                const subjectData = []
                for(let j = 0; j < allTutors[i].subjects.length; j++ ) {
                    subjectData.push(await prisma.subject.findUniqueOrThrow({
                        where: {
                            subjectID: allTutors[i].subjects[j].fk_subjectID
                        },
                    }))
                }
                
                // Push individual tutor with user data to array
                allTutorsWithUserInfo.push({
                    tutorID: allTutors[i].tutorID,
                    userID: allTutors[i].fk_userID,
                    about_me: allTutors[i].about_me,
                    totalTutorHours: allTutors[i].totalTutorHours,
                    subjects: subjectData,
                    email: userData.email,
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    password: userData.password,
                    totalLearnHours: userData.totalLearnHours,

                })
            }
            
            // Respond with json of Tutor with User info data
            res.status(200).json(allTutorsWithUserInfo);
            break;
        default:
            res.status(405).send('Invalid Request Method');
    }
}
