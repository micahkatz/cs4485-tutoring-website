import React from 'react'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendarSlotsComponentsProps, DayCalendarSkeleton, LocalizationProvider, PickersDay, PickersDayProps } from '@mui/x-date-pickers'
import { Badge, Modal } from '@mui/material'
import dayjs, { Dayjs } from 'dayjs';
import AppointmentCard from '@/components/AppointmentCard'
import axios from 'axios';
import { appointment } from '@prisma/client';
import { NewAppointmentType } from '@/types/globals';
import { UserContext } from '@/context/userContext';
import { DateTime } from 'luxon';
type Props = {
    tutorId: number
}

type AvailabilityReturnType = {
    startDT: Date;
    endDT: Date;
}

const AppointmentCalendar = (props: Props) => {
    type HighlightedDay = {

    }
    const [highlightedDays, setHighlightedDays] = React.useState<number[]>([]);
    const userContext = React.useContext(UserContext)
    const [isLoading, setIsLoading] = React.useState(false)
    const [currMonth, setCurrMonth] = React.useState<Dayjs | null>(dayjs(new Date()))
    const [currAvailability, setCurrAvailability] = React.useState<AvailabilityReturnType[]>([])
    const [currDayAvailability, setCurrDayAvailability] = React.useState<AvailabilityReturnType[]>([])
    const [selectedDay, setSelectedDay] = React.useState(dayjs(new Date()))
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const [newAppointment, setNewAppointment] = React.useState<appointment | null>(null)
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
                const response = await axios.post(`/api/filteredavailability/${props.tutorId}`, {
                    month: currMonth.month(),
                    year: currMonth.year()
                })
                const availability: { startDT: string; endDT: string }[] = response.data

                const formattedAvailability = availability.map(item => {

                    return {
                        startDT: DateTime.fromISO(item.startDT).toJSDate(),
                        endDT: DateTime.fromISO(item.endDT).toJSDate()
                    }
                })

                console.log({ availability, formattedAvailability })
                setCurrAvailability(formattedAvailability)
                handleUpdateHighlightedDays(formattedAvailability)
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

    const handleNewAppointment = async (times: AvailabilityReturnType) => {
        if (confirm('Are you sure you want to make this appointment?')) {
            const newAppointment: NewAppointmentType = {
                fk_tutorID: props.tutorId,
                fk_userID: userContext.currUser.userID,
                startDT: times.startDT,
                endDT: times.endDT,
            }

            console.log('creating new appointment', { newAppointment })
        }
    }

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
        <div className='flex flex-col items-center'>
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
                        isNewAppointment
                        className='mb-1 mt-0 px-2 py-1 bg-secondary border-none'
                        startDT={item.startDT}
                        endDT={item.endDT}
                        onClick={() => handleNewAppointment(item)}
                    />
                ))
            }

            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                <h1>New Appointment</h1>
            </Modal>
        </div>
    )
}

export default AppointmentCalendar