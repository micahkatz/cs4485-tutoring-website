// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma, subject } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import formidable from 'formidable'
const prisma = new PrismaClient();

const UPLOADS_BASE_DIR = 'src/uploads/'
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Buffer | string>
) {

    switch (req.method) {
        case 'GET':
            const imageBuffer = fs.readFileSync(`${UPLOADS_BASE_DIR}/${'jason-watmore.jpg'}`);
            res.setHeader('Content-Type', 'image/jpeg'); // Set the appropriate content type for your image file
            res.status(200).send(imageBuffer);
            break;
        case 'POST':
            if (req.headers['content-type']?.startsWith('multipart/form-data')) {
                var form = formidable({ multiples: false })
                form.parse(req, (err: any, fields, files) => {
                    if (err) {
                        res.status(400).send('Failed to upload image');
                    }

                    console.log({ fields, files })

                    const imageFile = files.image as formidable.File // 'image' should be the name of the field in the multipart form data that contains the image file
                    // @ts-ignore
                    const oldPath = imageFile.path
                    const newPath = path.join(UPLOADS_BASE_DIR, imageFile.originalFilename || 'unknown.jpg');
                    const imageBuffer = fs.readFileSync(oldPath);
                    fs.writeFileSync(newPath, imageBuffer);
                    res.status(200).send('Image uploaded successfully');
                });
            } else {
                res.status(400).send('Invalid Content-Type');
            }
            break;
        default:
            res.status(405).send('Invalid Request Method');
    }
}
