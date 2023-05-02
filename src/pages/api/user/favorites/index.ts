// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma, user_favorites } from '@prisma/client';
import { UserWithoutPassword } from '@/types/globals';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<user_favorites | string>
) {
    const body = req.body as user_favorites;
    switch (req.method) {
        case 'POST': // POST is create new

            try {
                const foundFavorite = await prisma.user_favorites.findFirst({
                    where: {
                        fk_userID: body.fk_userID,
                        fk_tutorID: body.fk_tutorID
                    },
                });

                if (!foundFavorite) {
                    const createResponse = await prisma.user_favorites.create({
                        data: body,
                    });

                    if (!createResponse) {
                        res.status(500).send(`Failed to add user favorite`);
                    } else {
                        res.status(200).json(createResponse);
                    }
                } else {
                    res.status(409).send('User favorite already exists');
                }
            } catch (error) {
                console.error(error);
                res.status(500).send('Server Error');
            }

            break;
        case 'DELETE': // PUT is update
            try {
                const result = await prisma.user_favorites.findUnique({
                    where: {
                        fk_userID_fk_tutorID: body
                    },
                });
                if (!result) {
                    res.status(404).send(
                        `Could not find a user favorite for user with id ${body.fk_userID} and tutor with id ${body.fk_tutorID}`
                    );
                }
                await prisma.user_favorites.delete({
                    where: {
                        fk_userID_fk_tutorID: body
                    },
                })
                // send success
                res.status(200).end("Success");
            } 
            catch (err) {
                console.error(err);
                res.status(500).send('Server Error');
            }
            break;

            break;
        default:
            res.status(405).send('Invalid Request Method');
    }
}
