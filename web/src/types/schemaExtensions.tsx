import { User, Baby, Plan, Reminder } from '@prisma/client';

export interface UserWithBabies extends User {
  babies: Baby[];
}

export interface PlanWithReminders extends Plan {
  reminders: Reminder[];
}
