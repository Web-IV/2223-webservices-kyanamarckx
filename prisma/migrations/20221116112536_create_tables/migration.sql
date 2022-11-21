-- CreateTable
CREATE TABLE `Reiziger` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `voornaam` VARCHAR(255) NOT NULL,
    `naam` VARCHAR(255) NOT NULL,
    `geboortedatum` VARCHAR(10) NOT NULL,
    `stad` VARCHAR(255) NOT NULL,
    `straat` VARCHAR(255) NOT NULL,
    `huisnummer` VARCHAR(5) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bestemming` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `land` VARCHAR(255) NOT NULL,
    `stad` VARCHAR(255) NOT NULL,
    `postcode` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Verplaatsing` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `vervoersmiddelId` INTEGER NOT NULL,
    `bestemmingId` INTEGER NOT NULL,
    `reizigerId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vervoersmiddel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Verplaatsing` ADD CONSTRAINT `Verplaatsing_vervoersmiddelId_fkey` FOREIGN KEY (`vervoersmiddelId`) REFERENCES `Vervoersmiddel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Verplaatsing` ADD CONSTRAINT `Verplaatsing_bestemmingId_fkey` FOREIGN KEY (`bestemmingId`) REFERENCES `Bestemming`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Verplaatsing` ADD CONSTRAINT `Verplaatsing_reizigerId_fkey` FOREIGN KEY (`reizigerId`) REFERENCES `Reiziger`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
