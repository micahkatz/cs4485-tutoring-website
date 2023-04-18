// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma, appointment } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<appointment | string | null>
) {
    const appointIdString = req.query.appointId as string;

    const appointmentId = parseInt(appointIdString);
    switch (req.method) {
        case 'GET':
            try {
                const appointResult = await prisma.appointment.findUnique({
                    where: {
                        appointID: appointmentId,
                    },
                });
                if (!appointResult) {
                    res.status(404).send(
                        `Could not find subject with id ${appointmentId}`
                    );
                    return;
                }
                res.status(200).json(appointResult);
            } catch (err) {
                console.error(err);
                res.status(500).send('Server Error');
            }
            break;
        case 'DELETE': // Delete an appointment based on given ID
            try {
                const appointResult = await prisma.appointment.findUnique({
                    where: {
                        appointID: appointmentId,
                    },
                });
                if (!appointResult) {
                    res.status(404).send(
                        `Could not find subject with id ${appointmentId}`
                    );
                    return;
                }
                await prisma.appointment.delete({
                    where: {
                        appointID: appointmentId,
                    }
                })
                // send success
                res.status(200).end("Success");
            } catch (err) {
                console.error(err);
                res.status(500).send('Server Error');
            }
            break;
        default:
            res.status(405).send('Invalid Request Method');
    }
}
