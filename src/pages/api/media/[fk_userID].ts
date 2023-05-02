// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma, tutor } from '@prisma/client';
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient();
const Busboy = require('busboy')

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

async function uploadHandler(req: NextApiRequest, res: NextApiResponse<any | string>, fileName: string) {
    return new Promise(() => {
        const bb = Busboy({headers: req.headers})
        let p: string = ''
        bb.on('file', (_, file, info) => {
            const filePath = `./public/uploads/${fileName}${path.extname(info.filename)}`
            p = filePath.substring(filePath.indexOf('/uploads'))
            const stream = fs.createWriteStream(filePath)
            file.pipe(stream)
        })
        
        bb.on('close', () => {
            res.status(200).send(p)
        })

        req.pipe(bb)
        return
    })
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any | string>
) {
    const tutorIdString = req.query.fk_userID as string;

    switch (req.method) {
        case 'POST': // POST is create new
            return uploadHandler(req, res, `tutor_picture_${tutorIdString}`)
        default:
            res.status(405).send('Invalid Request Method');
    }
}