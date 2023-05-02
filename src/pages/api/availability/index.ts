// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma, availability } from '@prisma/client';
import {
    NewAvailabilityType,
    NewAvailabilityWithStrings,
} from '@/types/globals';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any | string>
) {
    switch (req.method) {
        case 'GET': // GET an availability given a foreign tutor id
            const foreignTutorString = req.query.tutorId as string;

            const foreignTutor = parseInt(foreignTutorString);
            try {
                // Grab availability
                const availResult = await prisma.availability.findMany({
                    where: {
                        fk_tutorID: foreignTutor,
                    },
                });
                if (!availResult) {
                    res.status(404).send(
                        `Could not find subject with id ${foreignTutor}`
                    );
                    return;
                }
                res.status(200).json(availResult);
            } catch (err) {
                console.error(err);
                res.status(500).send('Server Error');
            }
            break;
        case 'POST': // POST is create new
            const body = req.body as NewAvailabilityWithStrings;

            try {
                const startSeconds = Date.parse(body.startDT);
                const endSeconds = Date.parse(body.endDT);

                var startDT = new Date(startSeconds);
                var endDT = new Date(endSeconds);
                const createResponse = await prisma.availability.create({
                    data: { ...body, startDT, endDT },
                });

                res.status(200).json(createResponse);
            } catch (error) {
                console.error(error);
                res.status(500).send('Server Error');
            }

            break;
        case 'PUT': // PUT is update
            const partialBody = req.body as Partial<availability>;

            if (!partialBody.fk_tutorID) {
                res.status(400).send('Missing a tutor ID');
                break;
            }

            try {
                const { availID, ...withoutId } = partialBody;

                const updateResponse = await prisma.availability.update({
                    where: {
                        availID,
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
