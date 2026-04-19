export {
    findCities,
    findOrganizations,
    getPage,
    getCityOrganizationList,
}


function findCities(data: Record<string, string[]>, query: string) {
    const q = query.toLowerCase();

    return Object.keys(data)
        .filter(city => city.toLowerCase().includes(q))
}


function findOrganizations(data: Record<string, string[]>, query: string) {
    return data[query];
}

const MAX_PAGE_SIZE = 3;

function getPage(array: string[], page: number) {
    const totalPages = Math.max(1, Math.ceil(array.length / MAX_PAGE_SIZE));
    const currentPage = Math.min(Math.max(1, page), totalPages);

    const start = (currentPage - 1) * MAX_PAGE_SIZE;
    const end = start + MAX_PAGE_SIZE;
    const slice = array.slice(start, end);

    return { slice, currentPage, totalPages };
}


async function getCityOrganizationList() {
    return {
        'Брянск': ['Краски и мелки', 'Краски и кисточки', 'ПроТанцы'],
        'Екатеринбург': ['Авиомоделирование66', 'ЧемпионыБорьбы', 'Палки-Вязалки'],
        'Москва': ['Гитарная аккадемия', 'Спортивная гимнастика', 'Лучше всех', 'Гитарная аккадемия', 'Спортивная гимнастика', 'Лучше всех', 'Гитарная аккадемия', 'Спортивная гимнастика', 'Лучше всех'],
        'Ханты-Мансийск': ['Лингвомир', 'Кроль', 'Дружба'],
        'Тюмень': ['Лингвомир', 'Кроль', 'Дружба'],
        'Братск': ['Лингвомир', 'Кроль', 'Дружба'],
        'Иркутск': ['Лингвомир', 'Кроль', 'Дружба'],
        'Владивосток': ['Лингвомир', 'Кроль', 'Дружба'],
        'Санкт-Петербург': ['Лингвомир', 'Кроль', 'Дружба'],
        'Мурманск': ['Лингвомир', 'Кроль', 'Дружба'],
        'Якутск': ['Лингвомир', 'Кроль', 'Дружба'],
        'Омск': ['Лингвомир', 'Кроль', 'Дружба'],
        'Новосибирск': ['Лингвомир', 'Кроль', 'Дружба'],
        'Кемерово': ['Лингвомир', 'Кроль', 'Дружба'],
    };
}