import { VK, Keyboard } from 'vk-io';

const vk = new VK({ token: useRuntimeConfig().vkToken });
const prisma = usePrisma();

async function sendStartMessage(peerId: number) {
    const keyboard = Keyboard.builder()
        .textButton({ label: 'Хочу записаться', color: Keyboard.POSITIVE_COLOR, payload: { cmd: 'signup' } })
        .row()
        .textButton({ label: 'Уже занимаюсь', color: Keyboard.PRIMARY_COLOR, payload: { cmd: 'login' } })
        .oneTime();

    await vk.api.messages.send({
        peer_id: peerId,
        message: 'Привет! Я умею много крутого и т. д. ... Нажми кнопку ниже 👇',
        keyboard,
        random_id: Math.floor(Math.random() * 1000000)
    });
    return 'ok';
}

async function sendChooseCityMessage(peerId: number) {
    const keyboard = Keyboard.builder()
        .textButton({ label: 'Назад', color: Keyboard.POSITIVE_COLOR, payload: { cmd: 'back' } });

    await vk.api.messages.send({
        peer_id: peerId,
        message: 'В каком городе находится секция? Напишите город или его часть',
        keyboard,
        random_id: Math.floor(Math.random() * 1000000)
    });
    return 'ok';
}

async function sendLoginMessage(peerId: number) {
    const keyboard = Keyboard.builder()
        .textButton({ label: 'Назад', color: Keyboard.POSITIVE_COLOR, payload: { cmd: 'back' } });

    await vk.api.messages.send({
        peer_id: peerId,
        message: 'Введите како1-то там ключ из личного кабинета',
        keyboard,
        random_id: Math.floor(Math.random() * 1000000)
    });
    return 'ok';
}

async function sendChooseOrganizationMessage(peerId: number) {
    const keyboard = Keyboard.builder()
        .textButton({ label: 'Назад', color: Keyboard.POSITIVE_COLOR, payload: { cmd: 'backToChooseCity' } });

    await vk.api.messages.send({
        peer_id: peerId,
        message: 'Как называется секция?',
        keyboard,
        random_id: Math.floor(Math.random() * 1000000)
    });
    return 'ok';
}

async function fakeAPI() {
    return {
        'Брянск': ['Краски и мелки', 'Краски и кисточки', 'ПроТанцы'],
        'Екатеринбург': ['Авиомоделирование66', 'ЧемпионыБорьбы', 'Палки-Вязалки'],
        'Москва': ['Гитарная аккадемия', 'Спортивная гимнастика', 'Лучше всех'],
        'Ханты-Мансийск': ['Лингвомир', 'Кроль', 'Дружба'],
        'Тюмень': [],
        'Братск': [],
        'Иркутск': [],
        'Владивосток': [],
        'Санкт-Петербург': [],
        'Мурманск': [],
        'Якутск': [],
        'Омск': [],
        'Новосибирск': [],
        'Кемерово': [],
    };
}

function findCities(data: Record<string, string[]>, query: string) {
    const q = query.toLowerCase();

    return Object.keys(data)
        .filter(city => city.toLowerCase().includes(q))
}

const MAX_PAGE_SIZE = 3;

function getCitiesPage(cities: string[], page: number) {
    const totalPages = Math.max(1, Math.ceil(cities.length / MAX_PAGE_SIZE));
    const currentPage = Math.min(Math.max(1, page), totalPages);

    const start = (currentPage - 1) * MAX_PAGE_SIZE;
    const end = start + MAX_PAGE_SIZE;
    const slice = cities.slice(start, end);

    return { slice, currentPage, totalPages };
}

function buildCitiesKeyboard(cities: string[], page: number) {
    const { slice, currentPage, totalPages } = getCitiesPage(cities, page);
    const keyboard = Keyboard.builder().inline();

    for (const city of slice) {
        keyboard
            .callbackButton({
                label: city,
                payload: { cmd: 'choose_city', city }
            })
            .row();
    }

    if (totalPages > 1) {
        if (currentPage > 1) {
            keyboard.callbackButton({
                label: '⬅️',
                payload: { cmd: 'cities_page', page: currentPage - 1 }
            });
        }

        keyboard.callbackButton({
            label: `${currentPage}/${totalPages}`,
            payload: { cmd: 'noop' }
        });

        if (currentPage < totalPages) {
            keyboard.callbackButton({
                label: '➡️',
                payload: { cmd: 'cities_page', page: currentPage + 1 }
            });
        }

        keyboard.row();
    }

    keyboard.callbackButton({
        label: 'Вернуться',
        payload: { cmd: 'backToChooseCity' }
    });

    return keyboard;
}

type SaveUserStateParams = {
    peerId: number;
    state?: string | null;
    city?: string | null;
    citiesList?: unknown;
    citiesPage?: number;
};

async function saveUserState(params: SaveUserStateParams) {
    const { peerId, state, city, citiesList, citiesPage } = params;

    const updateData: any = {};

    if (state !== undefined) {
        updateData.state = state;
    }
    if (city !== undefined) {
        updateData.city = city;
    }
    if (citiesList !== undefined) {
        updateData.citiesList = citiesList;
    }
    if (citiesPage !== undefined) {
        updateData.citiesPage = citiesPage;
    }

    return prisma.users.upsert({
        where: { peerId },
        update: updateData,
        create: {
            peerId,
            state: state ?? null,
            city: city ?? null,
            citiesList: citiesList ?? [],
            citiesPage: citiesPage ?? 1
        }
    });
}

async function getUserState(peerId: number) {
    const user = await prisma.users.findUnique({
        where: { peerId },
        select: { state: true }
    });

    return user?.state || '';
}

async function getUserCityList(peerId: number): Promise<string[]> {
    const user = await prisma.users.findUnique({
        where: { peerId },
        select: { citiesList: true }
    });

    const list = user?.citiesList ?? [];

    return Array.isArray(list) ? (list as string[]) : [];
}

async function getUserPage(peerId: number) {
    const user = await prisma.users.findUnique({
        where: { peerId },
        select: { citiesPage: true }
    });

    return user?.citiesPage || 1;
}

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    if (body.type === 'confirmation') {
        return '2b7e895d';
    }

    if (body.type === 'message_new') {
        const message = body.object;
        const peerId = message.peer_id;
        const text = message.text?.toLowerCase() || '';

        let payload: any = {};
        try {
            payload = message.payload ? JSON.parse(message.payload) : {};
        } catch {
            payload = {};
        }

        const currentState = await getUserState(peerId);

        if (text === 'начать') {
            await sendStartMessage(peerId);
            await saveUserState({ peerId: peerId, state: 'start' });
            return 'ok';
        }

        if (text === 'хочу записаться' && currentState === 'start') {
            await sendChooseCityMessage(peerId);
            await saveUserState({ peerId: peerId, state: 'choose_city' });
            return 'ok';
        }

        if (text === 'уже занимаюсь') {
            await sendLoginMessage(peerId);
            await saveUserState({ peerId: peerId, state: 'login' });
            return 'ok';
        }

        if (payload.cmd === 'back' && (currentState === 'choose_city' || currentState === 'login')) {
            await sendStartMessage(peerId);
            await saveUserState({ peerId: peerId, state: 'start' });
            return 'ok';
        }

        if (currentState === 'choose_city') {
            const apiResponse = await fakeAPI();
            const findResult = findCities(apiResponse, text);

            if (findResult.length === 0) {
                await vk.api.messages.send({
                    peer_id: peerId,
                    message: 'Город не найден, попробуйте еще раз',
                    random_id: Math.floor(Math.random() * 1000000)
                });
            } else if (findResult.length === 1) {
                await vk.api.messages.send({
                    peer_id: peerId,
                    message: `Ваш город: ${findResult[0]}`,
                    random_id: Math.floor(Math.random() * 1000000)
                });
                await saveUserState({ peerId: peerId, state: 'choose_organization', city: findResult[0] });
                await sendChooseOrganizationMessage(peerId);
            } else {
                const keyboard = buildCitiesKeyboard(findResult, 1);

                const msgId = await vk.api.messages.send({
                    peer_id: peerId,
                    message: 'Выбери город:',
                    keyboard,
                    random_id: Date.now()
                });

                await saveUserState({ peerId: peerId, state: 'cities_page', citiesList: findResult, citiesPage: 1 });
            }

            return 'ok';
        }

        if (payload.cmd === 'backToChooseCity' && (currentState === 'choose_organization')) {
            await sendChooseCityMessage(peerId);
            await saveUserState({ peerId: peerId, state: 'choose_city' });
            return 'ok';
        }
    }

    if (body.type === 'message_event') {
        const obj = body.object;
        const peerId: number = obj.peer_id || obj.user_id;
        const eventId: string = obj.event_id;
        const msgId: number = obj.conversation_message_id;
        const payload = obj.payload || {};

        const citiesList = await getUserCityList(peerId);
        const currentPage = await getUserPage(peerId);

        await vk.api.messages.sendMessageEventAnswer({
            event_id: eventId,
            user_id: peerId,
            peer_id: peerId,
        });

        if (payload.cmd === 'cities_page' && citiesList) {
            const page = Number(payload.page) || 1;
            const keyboard = buildCitiesKeyboard(citiesList, page);

            await vk.api.messages.edit({
                peer_id: peerId,
                conversation_message_id: msgId,
                message: 'Выбери город:',
                keyboard
            });

            await saveUserState({ peerId: peerId, state: 'cities_page', citiesPage: page });

            return 'ok';
        }

        if (payload.cmd === 'choose_city' && payload.city) {
            await vk.api.messages.edit({
                peer_id: peerId,
                conversation_message_id: msgId,
                message: `Вы выбрали город: ${payload.city}`,
                keyboard: Keyboard.builder().inline()
            });

            await saveUserState({ peerId: peerId, state: 'choose_organization', city: payload.city });

            await sendChooseOrganizationMessage(peerId);
            return 'ok';
        }

        if (payload.cmd === 'backToChooseCity') {
            await vk.api.messages.delete({
                peer_id: peerId,
                conversation_message_ids: [msgId],
                delete_for_all: 1
            });

            await sendChooseCityMessage(peerId);
            await saveUserState({ peerId: peerId, state: 'choose_city' });

            return 'ok';
        }

        return 'ok';
    }

    return 'ok';
});