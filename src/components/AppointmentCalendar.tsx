import React from 'react'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendarSlotsComponentsProps, DayCalendarSkeleton, LocalizationProvider, PickersDay, PickersDayProps } from '@mui/x-date-pickers'
import { Badge } from '@mui/material'
import dayjs, { Dayjs } from 'dayjs';
import AppointmentCard from '@/components/AppointmentCard'
import axios from 'axios';
type Props = {
    tutorId: string
}

type AvailabilityReturnType = {
    startDT: Date;
    endDT: Date;
}

const AppointmentCalendar = (props: Props) => {
    type HighlightedDay = {

    }
    const [highlightedDays, setHighlightedDays] = React.useState<number[]>([]);

    const [isLoading, setIsLoading] = React.useState(false)
    const [currMonth, setCurrMonth] = React.useState<Dayjs | null>(dayjs(new Date()))
    const [currAvailability, setCurrAvailability] = React.useState<AvailabilityReturnType[]>([])
    const [currDayAvailability, setCurrDayAvailability] = React.useState<AvailabilityReturnType[]>([])
    const [selectedDay, setSelectedDay] = React.useState(dayjs(new Date()))

    const handleUpdateHighlightedDays = (availability: AvailabilityReturnType[]) => {
        var newHighlightedDays: number[] = []
        availability.forEach((item, index) => {
            newHighlightedDays.push(item.startDT.getDate())
        })

        setHighlightedDays(newHighlightedDays)
    }

    const getAvailabilityForMonth = async () => {
        if (currMonth !== null) {
            try {
                // const response = await axios.get('/api/filteredappointments', {
                //     params: {
                //         fk_tutorID: props.tutorId
                //     },
                //     data: {
                //         month: currMonth.month(),
                //         year: currMonth.year()
                //     }
                // })
                // const availability: AvailabilityReturnType[] = response.data
                if (currMonth.month() === 3 && currMonth.year() === 2023) {

                    const availability: AvailabilityReturnType[] = [
                        {
                            startDT: new Date('1:00 PM 3/27/2023'),
                            endDT: new Date('2:00 PM 3/27/2023'),
                        },
                        {
                            startDT: new Date('3:00 PM 3/29/2023'),
                            endDT: new Date('4:00 PM 3/29/2023'),
                        },
                    ]
                    setCurrAvailability(availability)
                    handleUpdateHighlightedDays(availability)
                } else {
                    setHighlightedDays([1, 2])

                }
            } catch (err) {
                console.error(err)
            }
        }
    }

    const handleMonthChange = (date: Dayjs) => {

        setIsLoading(true);
        // setHighlightedDays([1, 2, 3]);
        setIsLoading(false);
        setCurrMonth(date)
        getAvailabilityForMonth()
    };

    React.useEffect(() => {
        getAvailabilityForMonth()
    }, [currMonth])

    function ServerDay(props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }) {
        const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

        const isSelected =
            !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) !== -1;

        return (
            <Badge
                key={props.day.toString()}
                overlap="circular"
                badgeContent={isSelected ? <div className='h-2 w-2 bg-primary rounded-full' /> : undefined}
            >
                <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
            </Badge>
        );
    }

    return (
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>

                <DateCalendar
                    // defaultValue={initialValue}
                    onMonthChange={handleMonthChange}
                    renderLoading={() => <DayCalendarSkeleton />}
                    loading={isLoading}
                    value={selectedDay}
                    onChange={(value) => setSelectedDay(value)}
                    slots={{
                        day: ServerDay,
                    }}
                    slotProps={{
                        day: {
                            highlightedDays,
                        } as any,
                    }}
                />
            </LocalizationProvider>
            {
                currAvailability.filter(item => {
                    const startDay = item.startDT.getDate()
                    const currDay = selectedDay.date()
                    return startDay === currDay
                }
                    // item.startDT.getMonth() === selectedDay.month() &&
                ).map(item => (

                    <AppointmentCard
                        isOnlyDateTime
                        className='mb-1 mt-0 px-2 py-1 bg-secondary border-none'
                        startDT={item.startDT}
                        endDT={item.endDT}
                    />
                ))
            }
        </div>
    )
}

export default AppointmentCalendar