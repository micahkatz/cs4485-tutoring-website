import React from 'react'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendarSlotsComponentsProps, DayCalendarSkeleton, LocalizationProvider, PickersDay, PickersDayProps } from '@mui/x-date-pickers'
import { Badge } from '@mui/material'
import dayjs, { Dayjs } from 'dayjs';
import AppointmentCard from '@/components/AppointmentCard'
type Props = {}

const AppointmentCalendar = (props: Props) => {
    type HighlightedDay = {

    }
    const [highlightedDays, setHighlightedDays] = React.useState<number[]>([]);

    const [isLoading, setIsLoading] = React.useState(false)
    const [currMonth, setCurrMonth] = React.useState<Dayjs | null>(dayjs(new Date()))

    const getAvailabilityForMonth = () => {
        if (currMonth !== null) {
            if (currMonth.month() === 3 && currMonth.year() === 2023) {
                setHighlightedDays([3, 4, 5, 6])
            } else {
                setHighlightedDays([20, 21])
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
            <AppointmentCard
                isOnlyDateTime
                className='mb-1 mt-0 px-2 py-1 bg-secondary border-none'
                startDT={new Date('3:00 PM 3/27/2023')}
                endDT={new Date('4:00 PM 3/27/2023')}
            />
            <AppointmentCard
                isOnlyDateTime
                className='mb-1 mt-0 px-2 py-1 bg-secondary border-none'
                startDT={new Date('3:00 PM 3/27/2023')}
                endDT={new Date('4:00 PM 3/27/2023')}
            />
            <AppointmentCard
                isOnlyDateTime
                className='mb-1 mt-0 px-2 py-1 bg-secondary border-none'
                startDT={new Date('3:00 PM 3/27/2023')}
                endDT={new Date('4:00 PM 3/27/2023')}
            />
        </div>
    )
}

export default AppointmentCalendar