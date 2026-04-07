import { useFakeAPI } from "../server/utils/prisma";
import { OrgType, Focus, VisitModel, EmployeeRole, Gender, ClientType, ClientStatus, DayOfWeek } from './generated/prisma/db2/client';

const prisma = useFakeAPI();

const makeTime = (hours: number, minutes: number) => {
    const date = new Date(0);
    date.setUTCHours(hours, minutes, 0, 0);
    return date;
};

await prisma.breaks.createMany({
    data: [
        { startTime: makeTime(12, 0), endTime: makeTime(12, 45), },
        { startTime: makeTime(13, 0), endTime: makeTime(14, 0), },
        { startTime: makeTime(13, 0), endTime: makeTime(16, 0), },
        { startTime: makeTime(13, 0), endTime: makeTime(16, 30), },
        { startTime: makeTime(13, 0), endTime: makeTime(13, 30), },
        { startTime: makeTime(13, 30), endTime: makeTime(14, 0), },
        { startTime: makeTime(14, 0), endTime: makeTime(15, 0), },
        { startTime: makeTime(14, 0), endTime: makeTime(14, 30), },
        { startTime: makeTime(14, 0), endTime: makeTime(14, 20), },
        { startTime: makeTime(15, 0), endTime: makeTime(17, 0), },
        { startTime: makeTime(15, 0), endTime: makeTime(15, 30), },
        { startTime: makeTime(15, 0), endTime: makeTime(15, 45), },
        { startTime: makeTime(16, 0), endTime: makeTime(16, 45), },
        { startTime: makeTime(16, 0), endTime: makeTime(18, 0), },
        { startTime: makeTime(16, 30), endTime: makeTime(16, 45), },
        { startTime: makeTime(17, 0), endTime: makeTime(17, 30), },
        { startTime: makeTime(17, 30), endTime: makeTime(18, 0), },
    ]
});

await prisma.city.createMany({
    data: [
        { name: "Ханты-Мансийск", },
        { name: "Сургут", },
        { name: "Тобольск", },
        { name: "Братск", },
        { name: "Тюмень", },
        { name: "Санкт-Петербург", },
    ],
});

await prisma.organization.createMany({
    data: [
        {
            name: "Краски и мелки",
            type: OrgType.CREATIVE_STUDIO,
            focus: Focus.ART,
            visitModel: VisitModel.PAID,
            cityId: 1,
        },
        {
            name: "Кроль",
            type: OrgType.SPORTS_CLUB,
            focus: Focus.SPORTS,
            visitModel: VisitModel.PAID,
            cityId: 1,
        },
        {
            name: "DANCE LAB",
            type: OrgType.SPORTS_CLUB,
            focus: Focus.DANCE,
            visitModel: VisitModel.PAID,
            cityId: 1,
        },
        {
            name: "Этюд",
            type: OrgType.CREATIVE_STUDIO,
            focus: Focus.ART,
            visitModel: VisitModel.PAID,
            cityId: 1,
        },
        {
            name: "Перезагрузка",
            type: OrgType.EDUCATION_CENTER,
            focus: Focus.SCHOOL_PREP,
            visitModel: VisitModel.PAID,
            cityId: 2,
        },
        {
            name: "Лаборатория чудес",
            type: OrgType.SCIENCE_CLUB,
            focus: Focus.SCIENCE,
            visitModel: VisitModel.PAID,
            cityId: 3,
        },
        {
            name: "Hilton",
            type: OrgType.CHILDREN_CAMP,
            focus: Focus.FOREIGN_LANGUAGES,
            visitModel: VisitModel.PAID,
            cityId: 4,
        },
        {
            name: "СК Дружба",
            type: OrgType.SPORTS_CLUB,
            focus: Focus.SPORTS,
            visitModel: VisitModel.FREE,
            cityId: 5,
        },
        {
            name: "Отдыхай",
            type: OrgType.CREATIVE_STUDIO,
            focus: Focus.THEATER,
            visitModel: VisitModel.FREE,
            cityId: 6,
        },
        {
            name: "Кодеры",
            type: OrgType.SCIENCE_CLUB,
            focus: Focus.PROGRAMMING,
            visitModel: VisitModel.PAID,
            cityId: 6,
        },
    ],
});

await prisma.employee.createMany({
    data: [
        {
            firstName: "Владислава",
            lastName: "Попова",
            role: EmployeeRole.MANAGER,
            organizationId: 1,
            accessCode: "K9mP2xQ7vR4nL8jW3zY5",
        },
        {
            firstName: "Иван",
            lastName: "Пластилиновый",
            role: EmployeeRole.INSTRUCTOR,
            organizationId: 1,
            accessCode: "aB5cD1eF9gH3iJ7kL2mN",
        },
        {
            firstName: "Ольга",
            lastName: "Кисточкина",
            role: EmployeeRole.INSTRUCTOR,
            organizationId: 1,
            accessCode: "4tR8uY2oP6aS9dF3gH7j",
        },
        {
            firstName: "Татьяна",
            lastName: "Акварель",
            role: EmployeeRole.INSTRUCTOR,
            organizationId: 1,
            accessCode: "Z1xC6vB9nM5lK8jH3gF2",
        },
        {
            firstName: "Александр",
            lastName: "Глинянный",
            role: EmployeeRole.INSTRUCTOR,
            organizationId: 1,
            accessCode: "7qW4eR9tY1uI5oP0aS3d",
        },
        {
            firstName: "Виталий",
            lastName: "Карандаш",
            role: EmployeeRole.INSTRUCTOR,
            organizationId: 1,
            accessCode: "F8gH2jK6lZ9xC3vB5nM1",
        },
        {
            firstName: "Светлана",
            lastName: "Гуаш",
            role: EmployeeRole.INSTRUCTOR,
            organizationId: 1,
            accessCode: "pO0iU4yT8rE2wQ6aS9dF",
        },
        {
            firstName: "Дарья",
            lastName: "Краска",
            role: EmployeeRole.INSTRUCTOR,
            organizationId: 1,
            accessCode: "3xL7kZ1mV5cN9bJ4hG8q",
        },
    ],
});

await prisma.program.createMany({
    data: [
        {
            name: "Рисование",
            description: "Научим ваших детей рисовать любимых персонажей, природу, небольшие сюжеты и многое другое в графическом стиле от простых фигур к готовому рисунку!",
            organizationId: 1,
        },
        {
            name: "Лепка",
            description: "На занятиях ребята создают сказочных героев, животных и полезные поделки из безопасных материалов. Под чутким руководством педагога дети развивают мелкую моторику, воображение и усидчивость, учатся верить в свои силы и доводить дело до конца. Тёплая атмосфера, игровые задания и свобода творчества делают каждый урок маленьким открытием!",
            organizationId: 1,
        },
        {
            name: "Живопись",
            description: "Ребята осваивают акварель, гуашь и пастель, учатся смешивать цвета, строить композицию и смело переносить фантазии на бумагу. Под руководством педагога развиваются художественный вкус, наблюдательность и уверенность в себе. Каждый урок – яркий эксперимент, а каждая картина – повод для гордости!",
            organizationId: 1,
        },
    ],
});

await prisma.employeeProgram.createMany({
    data: [
        {
            programId: 2,
            employeeId: 2,
        },
        {
            programId: 2,
            employeeId: 5,
        },
        {
            programId: 1,
            employeeId: 3,
        },
        {
            programId: 3,
            employeeId: 3,
        },
        {
            programId: 1,
            employeeId: 4,
        },
        {
            programId: 3,
            employeeId: 4,
        },
        {
            programId: 1,
            employeeId: 6,
        },
        {
            programId: 1,
            employeeId: 7,
        },
        {
            programId: 3,
            employeeId: 8,
        },
        {
            programId: 2,
            employeeId: 8,
        },
    ],
});

await prisma.module.createMany({
    data: [
        {
            programId: 1,
            name: "Основы рисования",
        },
        {
            programId: 1,
            name: "Рисуем любимых персонажей",
        },
        {
            programId: 1,
            name: "Рисуем сюжеты",
        },
        {
            programId: 2,
            name: "Лепка животных",
        },
        {
            programId: 2,
            name: "Лепка узоров и сложных композиций",
        },
        {
            programId: 2,
            name: "Лепка растений и природы",
        },
        {
            programId: 3,
            name: "Основы живописи",
        },
        {
            programId: 3,
            name: "Натюрморты",
        },
        {
            programId: 3,
            name: "Портреты",
        },
    ],
});

await prisma.subscriptionType.createMany({
    data: [
        {
            organizationId: 1,
            typeName: "Лепка для начинабщих",
            visitCount: 8,
            hasExpiry: true,
            expiryDays: 31,
            price: 4000,
        },
        {
            organizationId: 1,
            typeName: "Живопись для опытных",
            visitCount: 4,
            hasExpiry: false,
            price: 5000,
        },
        {
            organizationId: 1,
            typeName: "Живопись для начинающих",
            visitCount: 8,
            hasExpiry: true,
            expiryDays: 31,
            price: 5400,
        },
        {
            organizationId: 1,
            typeName: "Основы рисования",
            visitCount: 6,
            hasExpiry: false,
            price: 3600,
        },
        {
            organizationId: 1,
            typeName: "Рисование",
            visitCount: 8,
            hasExpiry: true,
            expiryDays: 31,
            price: 4800,
        },
        {
            organizationId: 1,
            typeName: "Лепка",
            visitCount: 6,
            hasExpiry: true,
            expiryDays: 31,
            price: 4500,
        },
    ],
});

await prisma.venue.createMany({
    data: [
        {
            name: "Художественный класс 305",
            cityId: 1,
            address: "Чехова 16, каб. 305",
            organizationId: 1,
        },
        {
            name: "Класс лепки 204",
            cityId: 1,
            address: "Чехова 16, каб. 204",
            organizationId: 1,
        },
        {
            name: "Художественный класс 307",
            cityId: 1,
            address: "Чехова 16, каб. 307",
            organizationId: 1,
        },
    ],
});

await prisma.group.createMany({
    data: [
        {
            organizationId: 1,
            name: "ЛепкаН11",
            currentMembers: 9,
            maxMembers: 10,
            instructorId: 2,
            defaultVenueId: 2,
            programId: 2,
            ageCategory: "6-8",
        },
        {
            organizationId: 1,
            name: "ЛепкаН12",
            currentMembers: 9,
            maxMembers: 10,
            instructorId: 2,
            defaultVenueId: 2,
            programId: 2,
            ageCategory: "9-12",
        },
        {
            organizationId: 1,
            name: "Лепка13",
            currentMembers: 11,
            maxMembers: 12,
            instructorId: 5,
            defaultVenueId: 2,
            programId: 2,
            ageCategory: "7-9",
        },
        {
            organizationId: 1,
            name: "Лепка14",
            currentMembers: 11,
            maxMembers: 12,
            instructorId: 5,
            defaultVenueId: 2,
            programId: 2,
            ageCategory: "10-13",
        },
        {
            organizationId: 1,
            name: "Лепка15",
            currentMembers: 10,
            maxMembers: 12,
            instructorId: 2,
            defaultVenueId: 2,
            programId: 2,
            ageCategory: "14-17",
        },
        {
            organizationId: 1,
            name: "РисованиеН21",
            currentMembers: 9,
            maxMembers: 10,
            instructorId: 6,
            defaultVenueId: 3,
            programId: 1,
            ageCategory: "6-8",
        },
        {
            organizationId: 1,
            name: "РисованиеН22",
            currentMembers: 9,
            maxMembers: 10,
            instructorId: 6,
            defaultVenueId: 3,
            programId: 1,
            ageCategory: "9-12",
        },
        {
            organizationId: 1,
            name: "Рисование23",
            currentMembers: 14,
            maxMembers: 15,
            instructorId: 3,
            defaultVenueId: 3,
            programId: 1,
            ageCategory: "10-13",
        },
        {
            organizationId: 1,
            name: "Рисование24",
            currentMembers: 14,
            maxMembers: 15,
            instructorId: 3,
            defaultVenueId: 3,
            programId: 1,
            ageCategory: "7-9",
        },
        {
            organizationId: 1,
            name: "Рисование25",
            currentMembers: 14,
            maxMembers: 15,
            instructorId: 7,
            defaultVenueId: 3,
            programId: 1,
            ageCategory: "14-17",
        },
        {
            organizationId: 1,
            name: "ЖивописьН31",
            currentMembers: 7,
            maxMembers: 8,
            instructorId: 3,
            defaultVenueId: 1,
            programId: 3,
            ageCategory: "6-8",
        },
        {
            organizationId: 1,
            name: "ЖивописьН32",
            currentMembers: 7,
            maxMembers: 8,
            instructorId: 4,
            defaultVenueId: 1,
            programId: 3,
            ageCategory: "9-12",
        },
        {
            organizationId: 1,
            name: "ЖивописьН33",
            currentMembers: 6,
            maxMembers: 8,
            instructorId: 8,
            defaultVenueId: 1,
            programId: 3,
            ageCategory: "13-17",
        },
        {
            organizationId: 1,
            name: "Живопись34",
            currentMembers: 10,
            maxMembers: 12,
            instructorId: 8,
            defaultVenueId: 1,
            programId: 3,
            ageCategory: "11-14",
        },
        {
            organizationId: 1,
            name: "Живопись35",
            currentMembers: 10,
            maxMembers: 12,
            instructorId: 8,
            defaultVenueId: 1,
            programId: 3,
            ageCategory: "15-17",
        },

    ],
});

await prisma.client.createMany({
    data: [
        {
            firstName: "Кирилл",
            lastName: "Алексеев",
            gender: Gender.M,
            birthDate: new Date('2015-09-30'),
            phone: "79261836180",
            email: "alekseev@gmail.com",
            accountType: ClientType.CHILD,
            firstNameParent: "Алексей",
            lastNameParent: "Алексеев",
            groupId: 4,
            accessCode: "7xK9mP2qR5vL8nW3jB6y",
            status: ClientStatus.ASSIGNED,
        },
        {
            firstName: "Михаил",
            lastName: "Максимчук",
            gender: Gender.M,
            birthDate: new Date('2010-09-06'),
            phone: "79028192168",
            email: "lollipop4253@gmail.com",
            accountType: ClientType.CHILD,
            firstNameParent: "Ольга",
            lastNameParent: "Чуракова",
            groupId: 15,
            accessCode: "4tH8uY2oP6aS9dF3gJ7k",
            status: ClientStatus.ASSIGNED,
        },

    ],
});

await prisma.clientSubscription.createMany({
    data: [
        {
            clientId: 1,
            subscriptionTypeId: 6,
            purchaseDate: new Date('2026-04-18'),
            remainingVisits: 3,
        },
        {
            clientId: 2,
            subscriptionTypeId: 2,
            remainingVisits: 5,
        },
    ],
});

await prisma.workSchedule.createMany({
    data: [
        // id 1–7, org 1
        { dayOfWeek: DayOfWeek.MON, isWorkingDay: true, startWork: makeTime(8, 0), endWork: makeTime(20, 0), organizationId: 1, },
        { dayOfWeek: DayOfWeek.TUE, isWorkingDay: true, startWork: makeTime(8, 0), endWork: makeTime(20, 0), organizationId: 1, },
        { dayOfWeek: DayOfWeek.WED, isWorkingDay: true, startWork: makeTime(8, 0), endWork: makeTime(20, 0), organizationId: 1, },
        { dayOfWeek: DayOfWeek.THU, isWorkingDay: true, startWork: makeTime(8, 0), endWork: makeTime(20, 0), organizationId: 1, },
        { dayOfWeek: DayOfWeek.FRI, isWorkingDay: true, startWork: makeTime(8, 0), endWork: makeTime(20, 0), organizationId: 1, },
        { dayOfWeek: DayOfWeek.SAT, isWorkingDay: true, startWork: makeTime(11, 0), endWork: makeTime(20, 0), organizationId: 1, },
        { dayOfWeek: DayOfWeek.SUN, isWorkingDay: false, organizationId: 1, },

        // id 8–14, venue 1
        { dayOfWeek: DayOfWeek.MON, isWorkingDay: true, startWork: makeTime(8, 0), endWork: makeTime(20, 0), venueId: 1, },
        { dayOfWeek: DayOfWeek.TUE, isWorkingDay: true, startWork: makeTime(8, 0), endWork: makeTime(20, 0), venueId: 1, },
        { dayOfWeek: DayOfWeek.WED, isWorkingDay: true, startWork: makeTime(8, 0), endWork: makeTime(20, 0), venueId: 1, },
        { dayOfWeek: DayOfWeek.THU, isWorkingDay: true, startWork: makeTime(8, 0), endWork: makeTime(20, 0), venueId: 1, },
        { dayOfWeek: DayOfWeek.FRI, isWorkingDay: true, startWork: makeTime(8, 0), endWork: makeTime(20, 0), venueId: 1, },
        { dayOfWeek: DayOfWeek.SAT, isWorkingDay: true, startWork: makeTime(11, 0), endWork: makeTime(20, 0), venueId: 1, },
        { dayOfWeek: DayOfWeek.SUN, isWorkingDay: false, venueId: 1, },

        // id 15–21, venue 2
        { dayOfWeek: DayOfWeek.MON, isWorkingDay: true, startWork: makeTime(8, 0), endWork: makeTime(20, 0), venueId: 2, },
        { dayOfWeek: DayOfWeek.TUE, isWorkingDay: true, startWork: makeTime(8, 0), endWork: makeTime(20, 0), venueId: 2, },
        { dayOfWeek: DayOfWeek.WED, isWorkingDay: true, startWork: makeTime(8, 0), endWork: makeTime(20, 0), venueId: 2, },
        { dayOfWeek: DayOfWeek.THU, isWorkingDay: true, startWork: makeTime(8, 0), endWork: makeTime(20, 0), venueId: 2, },
        { dayOfWeek: DayOfWeek.FRI, isWorkingDay: true, startWork: makeTime(8, 0), endWork: makeTime(20, 0), venueId: 2, },
        { dayOfWeek: DayOfWeek.SAT, isWorkingDay: true, startWork: makeTime(11, 0), endWork: makeTime(20, 0), venueId: 2, },
        { dayOfWeek: DayOfWeek.SUN, isWorkingDay: false, venueId: 2, },

        // id 22–28, venue 3
        { dayOfWeek: DayOfWeek.MON, isWorkingDay: true, startWork: makeTime(9, 0), endWork: makeTime(18, 0), venueId: 3, },
        { dayOfWeek: DayOfWeek.TUE, isWorkingDay: true, startWork: makeTime(9, 0), endWork: makeTime(18, 0), venueId: 3, },
        { dayOfWeek: DayOfWeek.WED, isWorkingDay: false, venueId: 3, },
        { dayOfWeek: DayOfWeek.THU, isWorkingDay: true, startWork: makeTime(9, 0), endWork: makeTime(18, 0), venueId: 3, },
        { dayOfWeek: DayOfWeek.FRI, isWorkingDay: true, startWork: makeTime(9, 0), endWork: makeTime(18, 0), venueId: 3, },
        { dayOfWeek: DayOfWeek.SAT, isWorkingDay: true, startWork: makeTime(11, 0), endWork: makeTime(17, 0), venueId: 3, },
        { dayOfWeek: DayOfWeek.SUN, isWorkingDay: false, venueId: 3, },

        // id 29–35, employee 2
        { dayOfWeek: DayOfWeek.MON, isWorkingDay: true, startWork: makeTime(9, 0), endWork: makeTime(18, 0), employeeId: 2, },
        { dayOfWeek: DayOfWeek.TUE, isWorkingDay: true, startWork: makeTime(9, 0), endWork: makeTime(18, 0), employeeId: 2, },
        { dayOfWeek: DayOfWeek.WED, isWorkingDay: true, startWork: makeTime(9, 0), endWork: makeTime(18, 0), employeeId: 2, },
        { dayOfWeek: DayOfWeek.THU, isWorkingDay: true, startWork: makeTime(9, 0), endWork: makeTime(18, 0), employeeId: 2, },
        { dayOfWeek: DayOfWeek.FRI, isWorkingDay: true, startWork: makeTime(9, 0), endWork: makeTime(18, 0), employeeId: 2, },
        { dayOfWeek: DayOfWeek.SAT, isWorkingDay: true, startWork: makeTime(11, 0), endWork: makeTime(17, 0), employeeId: 2, },
        { dayOfWeek: DayOfWeek.SUN, isWorkingDay: false, employeeId: 2, },

        // id 36–42, employee 3
        { dayOfWeek: DayOfWeek.MON, isWorkingDay: true, startWork: makeTime(8, 0), endWork: makeTime(20, 0), employeeId: 3, },
        { dayOfWeek: DayOfWeek.TUE, isWorkingDay: false, employeeId: 3, },
        { dayOfWeek: DayOfWeek.WED, isWorkingDay: true, startWork: makeTime(8, 0), endWork: makeTime(20, 0), employeeId: 3, },
        { dayOfWeek: DayOfWeek.THU, isWorkingDay: false, employeeId: 3, },
        { dayOfWeek: DayOfWeek.FRI, isWorkingDay: true, startWork: makeTime(8, 0), endWork: makeTime(20, 0), employeeId: 3, },
        { dayOfWeek: DayOfWeek.SAT, isWorkingDay: true, startWork: makeTime(11, 0), endWork: makeTime(20, 0), employeeId: 3, },
        { dayOfWeek: DayOfWeek.SUN, isWorkingDay: false, employeeId: 3, },

        // id 43–49, employee 4
        { dayOfWeek: DayOfWeek.MON, isWorkingDay: true, startWork: makeTime(8, 0), endWork: makeTime(12, 0), employeeId: 4, },
        { dayOfWeek: DayOfWeek.TUE, isWorkingDay: true, startWork: makeTime(8, 0), endWork: makeTime(12, 0), employeeId: 4, },
        { dayOfWeek: DayOfWeek.WED, isWorkingDay: false, employeeId: 4, },
        { dayOfWeek: DayOfWeek.THU, isWorkingDay: true, startWork: makeTime(8, 0), endWork: makeTime(12, 0), employeeId: 4, },
        { dayOfWeek: DayOfWeek.FRI, isWorkingDay: true, startWork: makeTime(8, 0), endWork: makeTime(12, 0), employeeId: 4, },
        { dayOfWeek: DayOfWeek.SAT, isWorkingDay: true, startWork: makeTime(11, 0), endWork: makeTime(15, 0), employeeId: 4, },
        { dayOfWeek: DayOfWeek.SUN, isWorkingDay: false, employeeId: 4, },

        // id 50–56, employee 5
        { dayOfWeek: DayOfWeek.MON, isWorkingDay: false, employeeId: 5, },
        { dayOfWeek: DayOfWeek.TUE, isWorkingDay: true, startWork: makeTime(12, 0), endWork: makeTime(20, 0), employeeId: 5, },
        { dayOfWeek: DayOfWeek.WED, isWorkingDay: true, startWork: makeTime(12, 0), endWork: makeTime(20, 0), employeeId: 5, },
        { dayOfWeek: DayOfWeek.THU, isWorkingDay: true, startWork: makeTime(12, 0), endWork: makeTime(20, 0), employeeId: 5, },
        { dayOfWeek: DayOfWeek.FRI, isWorkingDay: false, employeeId: 5, },
        { dayOfWeek: DayOfWeek.SAT, isWorkingDay: true, startWork: makeTime(13, 0), endWork: makeTime(20, 0), employeeId: 5, },
        { dayOfWeek: DayOfWeek.SUN, isWorkingDay: false, employeeId: 5, },

        // id 57–63, employee 6
        { dayOfWeek: DayOfWeek.MON, isWorkingDay: true, startWork: makeTime(9, 30), endWork: makeTime(18, 30), employeeId: 6, },
        { dayOfWeek: DayOfWeek.TUE, isWorkingDay: true, startWork: makeTime(9, 30), endWork: makeTime(18, 30), employeeId: 6, },
        { dayOfWeek: DayOfWeek.WED, isWorkingDay: false, employeeId: 6, },
        { dayOfWeek: DayOfWeek.THU, isWorkingDay: true, startWork: makeTime(9, 30), endWork: makeTime(18, 30), employeeId: 6, },
        { dayOfWeek: DayOfWeek.FRI, isWorkingDay: true, startWork: makeTime(9, 30), endWork: makeTime(18, 30), employeeId: 6, },
        { dayOfWeek: DayOfWeek.SAT, isWorkingDay: true, startWork: makeTime(11, 0), endWork: makeTime(16, 0), employeeId: 6, },
        { dayOfWeek: DayOfWeek.SUN, isWorkingDay: false, employeeId: 6, },

        // id 64–70, employee 7
        { dayOfWeek: DayOfWeek.MON, isWorkingDay: false, employeeId: 7, },
        { dayOfWeek: DayOfWeek.TUE, isWorkingDay: false, employeeId: 7, },
        { dayOfWeek: DayOfWeek.WED, isWorkingDay: true, startWork: makeTime(10, 0), endWork: makeTime(17, 0), employeeId: 7, },
        { dayOfWeek: DayOfWeek.THU, isWorkingDay: true, startWork: makeTime(10, 0), endWork: makeTime(20, 0), employeeId: 7, },
        { dayOfWeek: DayOfWeek.FRI, isWorkingDay: true, startWork: makeTime(10, 0), endWork: makeTime(20, 0), employeeId: 7, },
        { dayOfWeek: DayOfWeek.SAT, isWorkingDay: true, startWork: makeTime(11, 0), endWork: makeTime(19, 0), employeeId: 7, },
        { dayOfWeek: DayOfWeek.SUN, isWorkingDay: false, employeeId: 7, },

        // id 71–77, employee 8
        { dayOfWeek: DayOfWeek.MON, isWorkingDay: true, startWork: makeTime(8, 0), endWork: makeTime(16, 0), employeeId: 8, },
        { dayOfWeek: DayOfWeek.TUE, isWorkingDay: true, startWork: makeTime(8, 0), endWork: makeTime(16, 0), employeeId: 8, },
        { dayOfWeek: DayOfWeek.WED, isWorkingDay: true, startWork: makeTime(8, 0), endWork: makeTime(16, 0), employeeId: 8, },
        { dayOfWeek: DayOfWeek.THU, isWorkingDay: true, startWork: makeTime(8, 0), endWork: makeTime(16, 0), employeeId: 8, },
        { dayOfWeek: DayOfWeek.FRI, isWorkingDay: true, startWork: makeTime(8, 0), endWork: makeTime(16, 0), employeeId: 8, },
        { dayOfWeek: DayOfWeek.SAT, isWorkingDay: false, employeeId: 8, },
        { dayOfWeek: DayOfWeek.SUN, isWorkingDay: false, employeeId: 8, },
    ],
});

await prisma.workScheduleBreaks.createMany({
  data: [
    { workScheduleId: 8, breakId: 7, },
    { workScheduleId: 9, breakId: 7, },
    { workScheduleId: 10, breakId: 7, },
    { workScheduleId: 11, breakId: 7, },
    { workScheduleId: 12, breakId: 7, },
    { workScheduleId: 13, breakId: 12, },
    { workScheduleId: 15, breakId: 4, },
    { workScheduleId: 16, breakId: 4, },
    { workScheduleId: 17, breakId: 4, },
    { workScheduleId: 18, breakId: 4, },
    { workScheduleId: 19, breakId: 4, },
    { workScheduleId: 20, breakId: 14, },
    { workScheduleId: 22, breakId: 5, },
    { workScheduleId: 23, breakId: 5, },
    { workScheduleId: 25, breakId: 5, },
    { workScheduleId: 26, breakId: 5, },
    { workScheduleId: 27, breakId: 9, },
    { workScheduleId: 29, breakId: 2, },
    { workScheduleId: 30, breakId: 2, },
    { workScheduleId: 31, breakId: 2, },
    { workScheduleId: 32, breakId: 2, },
    { workScheduleId: 33, breakId: 2, },
    { workScheduleId: 34, breakId: 7, },
    { workScheduleId: 36, breakId: 3, },
    { workScheduleId: 38, breakId: 3, },
    { workScheduleId: 40, breakId: 3, },
    { workScheduleId: 41, breakId: 10, },
    { workScheduleId: 51, breakId: 13, },
    { workScheduleId: 52, breakId: 13, },
    { workScheduleId: 53, breakId: 13, },
    { workScheduleId: 55, breakId: 16, },
    { workScheduleId: 57, breakId: 6, },
    { workScheduleId: 57, breakId: 13, },
    { workScheduleId: 58, breakId: 6, },
    { workScheduleId: 58, breakId: 13, },
    { workScheduleId: 60, breakId: 6, },
    { workScheduleId: 60, breakId: 13, },
    { workScheduleId: 61, breakId: 6, },
    { workScheduleId: 61, breakId: 13, },
    { workScheduleId: 62, breakId: 6, },
    { workScheduleId: 66, breakId: 8, },
    { workScheduleId: 67, breakId: 8, },
    { workScheduleId: 67, breakId: 17, },
    { workScheduleId: 68, breakId: 8, },
    { workScheduleId: 68, breakId: 17, },
    { workScheduleId: 69, breakId: 11, },
    { workScheduleId: 71, breakId: 1, },
    { workScheduleId: 72, breakId: 1, },
    { workScheduleId: 73, breakId: 1, },
    { workScheduleId: 74, breakId: 1, },
    { workScheduleId: 75, breakId: 1, },
  ],
});