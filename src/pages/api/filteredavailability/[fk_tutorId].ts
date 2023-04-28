// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import {
    PrismaClient,
    Prisma,
    tutor,
    availability,
    appointment,
} from '@prisma/client';
import { TimeFrame } from '@/types/globals';
import { error } from 'console';

const prisma = new PrismaClient();

const FilterAvailability = (
    year: number,
    month: number,
    allAvails: availability[],
    allAppoints: appointment[]
) => {
    // Determine which month to use (Date object)
    let availDict = new Map<number, TimeFrame[]>(); // Key = Day of the month [getDate()], Value = availability timeframe

    // Fill dictionary with all relevant dates & their respective times
    const daysInMonth: number = new Date(year, month, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
        availDict.set(i, []);
        let dayOfTheWeekFiltered = new Date(year, month, i).getDay();
        for (let j = 0; j < allAvails.length; j++) {
            // Pull repeat boolean, declare timeframe
            let repeat = allAvails[j].repeatWeekly;
            let timeframe: TimeFrame = undefined;

            // Check if it's repeating weekly
            if (repeat) {
                // Make sure we're on the same day of the week
                let dayOfTheWeekAvail = allAvails[j].startDT.getDay();
                if (dayOfTheWeekAvail == dayOfTheWeekFiltered) {
                    // Set timeframe
                    timeframe = {
                        startDT: new Date(
                            year,
                            month,
                            i,
                            allAvails[j].startDT.getHours(),
                            allAvails[j].startDT.getMinutes()
                        ),
                        endDT: new Date(
                            year,
                            month,
                            i,
                            allAvails[j].endDT.getHours(),
                            allAvails[j].endDT.getMinutes()
                        ),
                    };
                }
            } else {
                // Make sure we're on the exact date
                let availDay = allAvails[j].startDT.getDate();
                let availMonth = allAvails[j].startDT.getMonth() + 1;
                let availYear = allAvails[j].startDT.getFullYear();
                if (i == availDay && month == availMonth && year == availYear) {
                    // Set timeframe
                    timeframe = {
                        startDT: allAvails[j].startDT,
                        endDT: allAvails[j].endDT,
                    };
                }
            }

            // Push timeframe to dictionary (if exists)
            if (timeframe) {
                availDict.get(i).push(timeframe);
            }
        }
    }

    for (let i = 0; i < allAppoints.length; i++) {
        // Grab info from the appointment
        let appointment = allAppoints[i];

        let dayOfTheMonth = appointment.startDT.getDate();
        let appointStartHour = appointment.startDT.getHours();
        let appointEndHour = appointment.endDT.getHours();

        // Go through each timeframe for the day of the month
        let timeframes: TimeFrame[] = availDict.get(dayOfTheMonth);
        let newTimeFrames: TimeFrame[] = [];
        for (let j = 0; j < timeframes.length; j++) {
            // Grab info from timeframe
            let timeframe = timeframes[j];

            let availStartHour = timeframe.startDT.getHours();
            let availEndHour = timeframe.endDT.getHours();

            // Check the four cases
            if (availStartHour == appointStartHour) {
                // Move start time forward to appointment end time
                timeframe.startDT = allAppoints[j].endDT;
                if (
                    timeframe.startDT.getHours() == timeframe.endDT.getHours()
                ) {
                    // Fully booked, remove from dictionary
                    continue;
                } else {
                    // Not fully booked, place in dictionary
                    newTimeFrames.push(timeframe);
                }
            } else if (availEndHour == appointEndHour) {
                // Move end time backward to appointment start time
                timeframe.endDT = allAppoints[j].startDT;
                if (
                    timeframe.startDT.getHours() == timeframe.endDT.getHours()
                ) {
                    // Fully booked, remove from dictionary
                    continue;
                } else {
                    // Not fully booked, place in dictionary
                    newTimeFrames.push(timeframe);
                }
            } else {
                // Split into two availability times
                let split1_timeframe: TimeFrame = {
                    startDT: timeframe.startDT,
                    endDT: allAppoints[j].startDT,
                };
                let split2_timeframe: TimeFrame = {
                    startDT: allAppoints[j].endDT,
                    endDT: timeframe.endDT,
                };
                newTimeFrames.push(split1_timeframe);
                newTimeFrames.push(split2_timeframe);
            }
        }
        availDict.set(dayOfTheMonth, newTimeFrames);
    }

    return availDict;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<TimeFrame[] | string>
) {
    const foreignTutorString = req.query.fk_tutorId as string;
    const foreignTutor = parseInt(foreignTutorString);

    switch (req.method) {
        case 'POST':
            console.log({ body: req.body });
            const { month, year } = req.body as { month: number; year: number };
            try {
                // Grab availability
                const allAvails = await prisma.availability.findMany({
                    where: {
                        fk_tutorID: foreignTutor,
                    },
                });
                if (!allAvails) {
                    res.status(404).send(
                        `Could not find availability with tutor id ${foreignTutor}`
                    );
                    return;
                }

                // Grab appointments
                const daysInMonth = new Date(
                    Date.UTC(year, month, 0)
                ).getDate();
                const allAppoints = await prisma.appointment.findMany({
                    where: {
                        fk_tutorID: foreignTutor,
                        startDT: {
                            lte: new Date(Date.UTC(year, month, daysInMonth)),
                            gte: new Date(Date.UTC(year, month, 1)),
                        },
                    },
                });
                if (!allAppoints) {
                    res.status(404).send(
                        `Could not find appointment with tutor id ${foreignTutor}`
                    );
                    return;
                }

                // Get filtered availability
                let filteredAvailability = FilterAvailability(
                    year,
                    month,
                    allAvails,
                    allAppoints
                );

                // Stringify the availability for JSON format
                var returnArray: TimeFrame[] = [];
                for (let i = 1; i <= daysInMonth; i++) {
                    let value = filteredAvailability.get(i);
                    returnArray = [...returnArray, ...value];
                }

                res.status(200).json(returnArray);
            } catch (err) {
                console.error(err);
                res.status(500).send('Server Error' + '\n' + error);
            }
            break;
        default:
            res.status(405).send('Invalid Request Method');
    }
}
