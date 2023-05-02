// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma, availability } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<availability | string | null | availability[]>
) {
    const avail_id_string = req.query.avail_id as string;
    const avail_id = parseInt(avail_id_string);
    switch (req.method) {
        case 'DELETE': // Delete an availability based on given ID
            try {
                const availResult = await prisma.availability.findFirst({
                    where: {
                        availID: avail_id,
                    },
                });
                if (!availResult) {
                    res.status(404).send(
                        `Could not find availability with id ${avail_id}`
                    );
                    return;
                }
                await prisma.availability.delete({
                    where: {
                        availID: avail_id,
                    },
                });
                // send success
                res.status(200).end('Success');
            } catch (err) {
                console.error(err);
                res.status(500).send('Server Error');
            }
            break;
        default:
            res.status(405).send('Invalid Request Method');
    }
}
