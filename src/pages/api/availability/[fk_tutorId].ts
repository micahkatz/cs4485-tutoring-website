// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma, availability } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<availability | string | null | availability[]>
) {
    const foreignTutorString = req.query.fk_tutorId as string;

    const foreignTutor = parseInt(foreignTutorString);
    switch (req.method) {
        case 'GET':  // GET an availability given a foreign tutor id
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
        // case 'DELETE': // Delete an availability based on given ID
        //     try {
        //         const availResult = await prisma.availability.findFirst({
        //             where: {
        //                 fk_tutorID: foreignTutor,
        //             },
        //         });
        //         if (!availResult) {
        //             res.status(404).send(
        //                 `Could not find subject with id ${foreignTutor}`
        //             );
        //             return;
        //         }
        //         await prisma.availability.delete({
        //             where: {
        //                 fk_tutorID: foreignTutor,
        //             }
        //         })
        //         // send success
        //         res.status(200).end("Success");
        //     } catch (err) {
        //         console.error(err);
        //         res.status(500).send('Server Error');
        //     }
        //     break;
        default:
            res.status(405).send('Invalid Request Method');
    }
}