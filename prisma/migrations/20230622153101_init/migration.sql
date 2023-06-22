-- CreateTable
CREATE TABLE "user" (
    "userID" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "totalLearnHours" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_pkey" PRIMARY KEY ("userID")
);

-- CreateTable
CREATE TABLE "tutor" (
    "fk_userID" INTEGER NOT NULL,
    "about_me" TEXT NOT NULL,
    "totalTutorHours" INTEGER NOT NULL DEFAULT 0,
    "profile_picture" TEXT
);

-- CreateTable
CREATE TABLE "subject" (
    "subjectID" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "subject_pkey" PRIMARY KEY ("subjectID")
);

-- CreateTable
CREATE TABLE "availability" (
    "availID" SERIAL NOT NULL,
    "fk_tutorID" INTEGER NOT NULL,
    "startDT" TIMESTAMP(3) NOT NULL,
    "endDT" TIMESTAMP(3) NOT NULL,
    "repeatWeekly" BOOLEAN NOT NULL,

    CONSTRAINT "availability_pkey" PRIMARY KEY ("availID")
);

-- CreateTable
CREATE TABLE "appointment" (
    "appointID" SERIAL NOT NULL,
    "fk_tutorID" INTEGER NOT NULL,
    "fk_userID" INTEGER NOT NULL,
    "startDT" TIMESTAMP(3) NOT NULL,
    "endDT" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointment_pkey" PRIMARY KEY ("appointID")
);

-- CreateTable
CREATE TABLE "tutors_subjects" (
    "fk_tutorID" INTEGER NOT NULL,
    "fk_subjectID" INTEGER NOT NULL,

    CONSTRAINT "tutors_subjects_pkey" PRIMARY KEY ("fk_tutorID","fk_subjectID")
);

-- CreateTable
CREATE TABLE "user_favorites" (
    "fk_userID" INTEGER NOT NULL,
    "fk_tutorID" INTEGER NOT NULL,

    CONSTRAINT "user_favorites_pkey" PRIMARY KEY ("fk_userID","fk_tutorID")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_userID_key" ON "user"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "tutor_fk_userID_key" ON "tutor"("fk_userID");

-- CreateIndex
CREATE UNIQUE INDEX "appointment_appointID_key" ON "appointment"("appointID");

-- AddForeignKey
ALTER TABLE "tutor" ADD CONSTRAINT "tutor_fk_userID_fkey" FOREIGN KEY ("fk_userID") REFERENCES "user"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availability" ADD CONSTRAINT "availability_fk_tutorID_fkey" FOREIGN KEY ("fk_tutorID") REFERENCES "tutor"("fk_userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_fk_tutorID_fkey" FOREIGN KEY ("fk_tutorID") REFERENCES "tutor"("fk_userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_fk_userID_fkey" FOREIGN KEY ("fk_userID") REFERENCES "user"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutors_subjects" ADD CONSTRAINT "tutors_subjects_fk_tutorID_fkey" FOREIGN KEY ("fk_tutorID") REFERENCES "tutor"("fk_userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutors_subjects" ADD CONSTRAINT "tutors_subjects_fk_subjectID_fkey" FOREIGN KEY ("fk_subjectID") REFERENCES "subject"("subjectID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_fk_userID_fkey" FOREIGN KEY ("fk_userID") REFERENCES "user"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_fk_tutorID_fkey" FOREIGN KEY ("fk_tutorID") REFERENCES "tutor"("fk_userID") ON DELETE RESTRICT ON UPDATE CASCADE;
