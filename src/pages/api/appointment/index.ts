// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma, appointment } from '@prisma/client';

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
            if (req.query?.tutorId) {
                const tutorIdString = req.query.tutorId as string;
                const tutorId = parseInt(tutorIdString);
                const allAppoints = await prisma.appointment.findMany({
                    where: {
                        fk_tutorID: tutorId,
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
