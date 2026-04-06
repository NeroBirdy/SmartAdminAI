import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../prisma/generated/prisma/db1/client";
import { PrismaClient as FakeAPIClient } from "../../prisma/generated/prisma/db2/client";

export { usePrisma };

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME_1,
  connectionLimit: 5,
});

const adapterFakeAPI = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME_2,
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

const prismaFakeAPI = new FakeAPIClient({ adapter: adapterFakeAPI });

const usePrisma = () => {
  return prisma;
};

const useFakeAPI = () => {
  return prismaFakeAPI;
};