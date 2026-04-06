import { useFakeAPI } from "../server/utils/prisma";

const prisma = useFakeAPI();

const makeTime = (hours: number, minutes: number) => {
    const date = new Date(0);
    date.setUTCHours(hours, minutes, 0, 0);
    return date;
};

await prisma.breaks.createMany({
    data: [
        {
            startTime: makeTime(12, 0),
            endTime: makeTime(13, 0),
        },
        {
            startTime: makeTime(9, 45),
            endTime: makeTime(10, 0),
        },
    ],
})