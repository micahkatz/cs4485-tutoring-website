-- CreateTable
CREATE TABLE `user` (
    `userID` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `totalLearnHours` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `user_userID_key`(`userID`),
    PRIMARY KEY (`userID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tutor` (
    `fk_userID` INTEGER NOT NULL,
    `about_me` VARCHAR(191) NOT NULL,
    `totalTutorHours` INTEGER NOT NULL DEFAULT 0,
    `profile_picture` VARCHAR(191) NULL,

    UNIQUE INDEX `tutor_fk_userID_key`(`fk_userID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subject` (
    `subjectID` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`subjectID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `availability` (
    `availID` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_tutorID` INTEGER NOT NULL,
    `startDT` DATETIME(3) NOT NULL,
    `endDT` DATETIME(3) NOT NULL,
    `repeatWeekly` BOOLEAN NOT NULL,

    PRIMARY KEY (`availID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `appointment` (
    `appointID` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_tutorID` INTEGER NOT NULL,
    `fk_userID` INTEGER NOT NULL,
    `startDT` DATETIME(3) NOT NULL,
    `endDT` DATETIME(3) NOT NULL,

    UNIQUE INDEX `appointment_appointID_key`(`appointID`),
    PRIMARY KEY (`appointID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tutors_subjects` (
    `fk_tutorID` INTEGER NOT NULL,
    `fk_subjectID` INTEGER NOT NULL,

    PRIMARY KEY (`fk_tutorID`, `fk_subjectID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_favorites` (
    `fk_userID` INTEGER NOT NULL,
    `fk_tutorID` INTEGER NOT NULL,

    PRIMARY KEY (`fk_userID`, `fk_tutorID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tutor` ADD CONSTRAINT `tutor_fk_userID_fkey` FOREIGN KEY (`fk_userID`) REFERENCES `user`(`userID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `availability` ADD CONSTRAINT `availability_fk_tutorID_fkey` FOREIGN KEY (`fk_tutorID`) REFERENCES `tutor`(`fk_userID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointment` ADD CONSTRAINT `appointment_fk_tutorID_fkey` FOREIGN KEY (`fk_tutorID`) REFERENCES `tutor`(`fk_userID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointment` ADD CONSTRAINT `appointment_fk_userID_fkey` FOREIGN KEY (`fk_userID`) REFERENCES `user`(`userID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tutors_subjects` ADD CONSTRAINT `tutors_subjects_fk_tutorID_fkey` FOREIGN KEY (`fk_tutorID`) REFERENCES `tutor`(`fk_userID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tutors_subjects` ADD CONSTRAINT `tutors_subjects_fk_subjectID_fkey` FOREIGN KEY (`fk_subjectID`) REFERENCES `subject`(`subjectID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_favorites` ADD CONSTRAINT `user_favorites_fk_userID_fkey` FOREIGN KEY (`fk_userID`) REFERENCES `user`(`userID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_favorites` ADD CONSTRAINT `user_favorites_fk_tutorID_fkey` FOREIGN KEY (`fk_tutorID`) REFERENCES `tutor`(`fk_userID`) ON DELETE RESTRICT ON UPDATE CASCADE;
