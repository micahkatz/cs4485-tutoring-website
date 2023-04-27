import { appointment, user, tutor, tutors_subjects } from '@prisma/client';

type TutorWithSubjects = tutor & {
    subjects: tutors_subjects[];
};

type UserWithoutPassword = Omit<user, 'password'>;
type NewUserType = Omit<user, 'userID'>;
type TutorWithSubjects = tutor & {
    subjects: tutors_subjects[];
};
type TimeFrame = {
    startDT: Date;
    endDT: Date;
};
type RealAvailability = {
    0: TimeFrame[];
    1: TimeFrame[];
    2: TimeFrame[];
    3: TimeFrame[];
    4: TimeFrame[];
    5: TimeFrame[];
    6: TimeFrame[];
    7: TimeFrame[];
    8: TimeFrame[];
    9: TimeFrame[];
    10: TimeFrame[];
    11: TimeFrame[];
    12: TimeFrame[];
    13: TimeFrame[];
    14: TimeFrame[];
    15: TimeFrame[];
    16: TimeFrame[];
    17: TimeFrame[];
    18: TimeFrame[];
    19: TimeFrame[];
    20: TimeFrame[];
    21: TimeFrame[];
    22: TimeFrame[];
    23: TimeFrame[];
    24: TimeFrame[];
    25: TimeFrame[];
    26: TimeFrame[];
    27: TimeFrame[];
    28: TimeFrame[];
    29: TimeFrame[];
    30: TimeFrame[];
    31: TimeFrame[];
};

type NewAppointmentType = Omit<appointment, 'appointID'>;
