import { useFakeAPI } from "../server/utils/prisma";
import {
  OrgType,
  Focus,
  VisitModel,
  EmployeeRole,
  Gender,
  ClientType,
  ClientStatus,
} from "./generated/prisma/db2/client";

const prisma = useFakeAPI();

async function main() {
  await prisma.city.createMany({
    data: [
      { name: "Ханты-Мансийск" },
      { name: "Сургут" },
      { name: "Тобольск" },
      { name: "Братск" },
      { name: "Тюмень" },
      { name: "Санкт-Петербург" },
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
        description:
          "Научим ваших детей рисовать любимых персонажей, природу, небольшие сюжеты и многое другое в графическом стиле от простых фигур к готовому рисунку!",
        organizationId: 1,
      },
      {
        name: "Лепка",
        description:
          "На занятиях ребята создают сказочных героев, животных и полезные поделки из безопасных материалов. Под чутким руководством педагога дети развивают мелкую моторику, воображение и усидчивость, учатся верить в свои силы и доводить дело до конца. Тёплая атмосфера, игровые задания и свобода творчества делают каждый урок маленьким открытием!",
        organizationId: 1,
      },
      {
        name: "Живопись",
        description:
          "Ребята осваивают акварель, гуашь и пастель, учатся смешивать цвета, строить композицию и смело переносить фантазии на бумагу. Под руководством педагога развиваются художественный вкус, наблюдательность и уверенность в себе. Каждый урок – яркий эксперимент, а каждая картина – повод для гордости!",
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
        instructorId: 7,
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

  await prisma.programVenue.createMany({
    data: [
      {
        programId: 1,
        venueId: 1,
      },
      {
        programId: 1,
        venueId: 3,
      },
      {
        programId: 2,
        venueId: 2,
      },
      {
        programId: 3,
        venueId: 1,
      },
      {
        programId: 3,
        venueId: 3,
      },
    ],
  });

  await prisma.client.createMany({
    data: [
      {
        firstName: "Кирилл",
        lastName: "Алексеев",
        gender: Gender.M,
        birthDate: new Date("2015-09-30"),
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
        birthDate: new Date("2010-09-06"),
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
        purchaseDate: new Date("2026-04-18"),
        remainingVisits: 3,
      },
      {
        clientId: 2,
        subscriptionTypeId: 2,
        remainingVisits: 5,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
