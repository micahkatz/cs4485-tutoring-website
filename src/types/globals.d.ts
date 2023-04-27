import { user, tutor, tutors_subjects } from '@prisma/client';

type UserWithoutPassword = Omit<user, 'password'>;
type NewUserType = Omit<user, 'userID'>;
type TutorWithSubjects = tutor & {
    subjects: tutors_subjects[];
};