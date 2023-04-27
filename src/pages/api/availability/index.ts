// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma, availability } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any | string>
) {
    switch (req.method) {
        case 'POST': // POST is create new
            const body = req.body as availability;

            try {
                const createResponse = await prisma.availability.create({
                    data: body,
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