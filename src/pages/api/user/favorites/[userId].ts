// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma, user_favorites } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<user_favorites[] | string | null>
) {
    const userIDString = req.query.userId as string;
    const userID = parseInt(userIDString);
    switch (req.method) {
        case 'GET':  // Get User based on ID
            try {
                const favoritesResult = await prisma.user_favorites.findMany({
                    where: {
                        fk_userID: userID,
                    },
                });
                if (!favoritesResult) {
                    res.status(404).send(
                        `Could not find any user favorites with id ${userID}`
                    );
                }
                res.status(200).json(favoritesResult);
            } catch (err) {
                console.error(err);
                res.status(500).send('Server Error');
            }
            break;
        default:
            res.status(405).send('Invalid Request Method');
    }
}
