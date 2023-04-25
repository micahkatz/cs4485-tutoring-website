import { user } from '@prisma/client';

type UserWithoutPassword = Omit<user, 'password'>;
type NewUserType = Omit<user, 'userID'>;
