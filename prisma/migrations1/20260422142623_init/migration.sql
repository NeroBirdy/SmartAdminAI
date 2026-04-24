-- CreateTable
CREATE TABLE `Breaks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `startTime` TIME(0) NOT NULL,
    `endTime` TIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prompts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `text` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recommendations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `text` TEXT NOT NULL,
    `complete` BOOLEAN NOT NULL DEFAULT false,
    `sectionId` INTEGER NOT NULL,
    `done` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `risks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `text` TEXT NOT NULL,
    `sectionId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sections` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SectionAISetting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sectionId` INTEGER NOT NULL,
    `settingAIId` INTEGER NOT NULL,
    `enable` BOOLEAN NOT NULL DEFAULT false,

    INDEX `SectionAISetting_sectionId_idx`(`sectionId`),
    INDEX `SectionAISetting_settingAIId_idx`(`settingAIId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SectionSetting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sectionId` INTEGER NOT NULL,
    `settingDefinitionId` INTEGER NOT NULL,
    `settingOptionId` INTEGER NOT NULL,

    INDEX `SectionSetting_sectionId_idx`(`sectionId`),
    INDEX `SectionSetting_settingOptionId_idx`(`settingOptionId`),
    INDEX `SectionSetting_settingDefinitionId_idx`(`settingDefinitionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SettingAI` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SettingDefinition` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `settingTypeId` INTEGER NOT NULL,
    `maxValues` INTEGER NOT NULL DEFAULT 1,

    UNIQUE INDEX `SettingDefinition_key_key`(`key`),
    INDEX `SettingDefinition_key_idx`(`key`),
    INDEX `SettingDefinition_settingTypeId_idx`(`settingTypeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SettingOption` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `settingDefinitionId` INTEGER NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL,

    INDEX `SettingOption_settingDefinitionId_idx`(`settingDefinitionId`),
    UNIQUE INDEX `SettingOption_settingDefinitionId_key_key`(`settingDefinitionId`, `key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SettingType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SettingType_key_key`(`key`),
    INDEX `SettingType_key_idx`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `peerId` INTEGER NOT NULL,
    `state` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `citiesList` JSON NOT NULL,
    `organization` VARCHAR(191) NULL,
    `organizationsList` JSON NOT NULL,
    `venueList` JSON NOT NULL,
    `dateList` JSON NOT NULL,
    `page` INTEGER NOT NULL DEFAULT 1,
    `key` VARCHAR(191) NULL,
    `role` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_peerId_key`(`peerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkSchedule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dayOfWeek` ENUM('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN') NOT NULL,
    `isWorkingDay` BOOLEAN NOT NULL DEFAULT true,
    `startWork` TIME(0) NULL,
    `endWork` TIME(0) NULL,
    `organizationId` INTEGER NULL,
    `employeeId` INTEGER NULL,
    `venueId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkScheduleBreaks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `workScheduleId` INTEGER NOT NULL,
    `breakId` INTEGER NOT NULL,

    UNIQUE INDEX `WorkScheduleBreaks_workScheduleId_breakId_key`(`workScheduleId`, `breakId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `recommendations` ADD CONSTRAINT `recommendations_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `sections`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `risks` ADD CONSTRAINT `risks_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `sections`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SectionAISetting` ADD CONSTRAINT `SectionAISetting_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `sections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SectionAISetting` ADD CONSTRAINT `SectionAISetting_settingAIId_fkey` FOREIGN KEY (`settingAIId`) REFERENCES `SettingAI`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SectionSetting` ADD CONSTRAINT `SectionSetting_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `sections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SectionSetting` ADD CONSTRAINT `SectionSetting_settingOptionId_fkey` FOREIGN KEY (`settingOptionId`) REFERENCES `SettingOption`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SectionSetting` ADD CONSTRAINT `SectionSetting_settingDefinitionId_fkey` FOREIGN KEY (`settingDefinitionId`) REFERENCES `SettingDefinition`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SettingDefinition` ADD CONSTRAINT `SettingDefinition_settingTypeId_fkey` FOREIGN KEY (`settingTypeId`) REFERENCES `SettingType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SettingOption` ADD CONSTRAINT `SettingOption_settingDefinitionId_fkey` FOREIGN KEY (`settingDefinitionId`) REFERENCES `SettingDefinition`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkScheduleBreaks` ADD CONSTRAINT `WorkScheduleBreaks_workScheduleId_fkey` FOREIGN KEY (`workScheduleId`) REFERENCES `WorkSchedule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkScheduleBreaks` ADD CONSTRAINT `WorkScheduleBreaks_breakId_fkey` FOREIGN KEY (`breakId`) REFERENCES `Breaks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
