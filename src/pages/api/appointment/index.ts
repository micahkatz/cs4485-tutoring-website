// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma, appointment, tutor, user } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any | string>
) {
    switch (req.method) {
        case 'POST': // POST is create new
            const body = req.body as appointment;

            try {
                const { appointID, ...withoutId } = body;

                const createResponse = await prisma.appointment.create({
                    data: withoutId,
                });

                // Update tutor's tutor hours
                const tut = await prisma.tutor.findFirst({
                    where: {
                        fk_userID: body.fk_tutorID,
                    }
                })
                .catch((error) => {
                    console.log("Error grabbing tutor to update tutor hours")
                    console.error(error)
                })
                
                const endDT = new Date(body.endDT), startDT = new Date(body.startDT)
                let appointmentHours = endDT.getHours() - startDT.getHours()
                if(appointmentHours == 0) appointmentHours = 1;
                if(tut) {
                    const newHours = tut.totalTutorHours + appointmentHours
                    await prisma.tutor.update({
                        where: {
                            fk_userID: body.fk_tutorID,
                        },
                        data: {
                            totalTutorHours: newHours,
                        },
                    })
                    .catch((error) => {
                        console.log("Error updating tutor hours")
                        console.error(error)
                    })
                }
                else {
                    console.log("Error: Tutor ID returned undefined tutor")
                }

                // Update user's learn hours
                const u = await prisma.user.findFirst({
                    where: {
                        userID: body.fk_userID,
                    }
                })
                .catch((error) => {
                    console.log("Error grabbing user to update learn hours")
                    console.error(error)
                })
                
                if(u) {
                    const newHours = u.totalLearnHours + appointmentHours
                    await prisma.user.update({
                        where: {
                            userID: body.fk_userID,
                        },
                        data: {
                            totalLearnHours: newHours,
                        },
                    })
                    .catch((error) => {
                        console.log("Error updating learn hours")
                        console.error(error)
                    })
                }
                else {
                    console.log("Error: User ID returned undefined user")
                }

                res.status(200).json(createResponse);
            } catch (error) {
                console.error(error);
                res.status(500).send('Server Error');
            }

            break;
        case 'PUT': // PUT is update
            const partialBody = req.body as Partial<appointment>;

            if (!partialBody.appointID) {
                res.status(400).send('Missing appointment ID');
                break;
            }

            try {
                const { appointID, ...withoutId } = partialBody;

                const updateResponse = await prisma.appointment.update({
                    where: {
                        appointID,
                    },
                    data: withoutId,
                });

                res.status(200).json(updateResponse);
            } catch (error) {
                console.error(error);
                res.status(500).send('Server Error');
            }

            break;
        case 'GET': // Getting all appointments
            if (req.query?.tutorId && req.query?.userId) {
                const tutorIdString = req.query.tutorId as string;
                const tutorId = parseInt(tutorIdString);

                const userIdString = req.query.userId as string;
                const userId = parseInt(userIdString);

                const allAppoints = await prisma.appointment.findMany({
                    where: {
                        OR: [{ fk_tutorID: tutorId }, { fk_userID: userId }],
                        startDT: {
                            gte: new Date().toISOString(),
                        },
                    },
                    orderBy: {
                        startDT: 'asc',
                    },
                });
                res.status(200).json(allAppoints);
            } else if (req.query?.userId) {
                const userIdString = req.query.userId as string;
                const userId = parseInt(userIdString);

                const allAppoints = await prisma.appointment.findMany({
                    where: {
                        fk_userID: userId,
                        startDT: {
                            gte: new Date().toISOString(),
                        },
                    },
                    orderBy: {
                        startDT: 'asc',
                    },
                });
                res.status(200).json(allAppoints);
            } else {
                res.status(403).send('Invalid parameters');
            }
            break;
        default:
            res.status(405).send('Invalid Request Method');
    }
}
