import { user } from '@prisma/client';

type UserWithoutPassword = Omit<user, 'password'>;
