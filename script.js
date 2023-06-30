const wrapper = document.querySelector('wrapper');                                  // получаю элементы
const input = document.querySelector('input');
const autodop = document.querySelector('.autodop');
const autodopElement = document.getElementsByTagName('li');
const nodeRepo = document.querySelector('.nodeRepo');

function debounce(fn) {                                                             // debounce - чтобы запросы шли не чаще чем...
    let timeOut;                                                                    // в аргументах - функция, которую нужно откладывать и время - на которое
    return function (...args) {
        clearTimeout(timeOut);
        timeOut = setTimeout(() => {
            fn.apply(this, args)
        }, 450);
    }
};

let debouncedSearch = debounce(startSearch, 450);

input.addEventListener('keyup', debouncedSearch);

async function startSearch(e) {                                                     // вводные данные в поиск
    try {
        let userInput = e.target.value;
        let repo = await poiskRepo(userInput);
        let showRepoArr = await showRepo(repo);
        addCard(showRepoArr);

    } catch (error) {
        console.log(error);
        autodop.classList.remove('vision');
    }
};


async function poiskRepo(repoName) {                                                // функция поиска репозитория через API GitHub
    return fetch(
        `https://api.github.com/search/repositories?q=${repoName}&per_page=5`       // вводится название репо в поиск и оно отправляется на сервер
    ).then(response => response.json());
}

async function showRepo(repo) {                                                     // функция создания / добавления элементов в выпадающий список
    try {
        let names = repo.items.map(({ name }) => {
            return name
        });
        let listNames = names.map(name => {
            return `<li>${name}</li>`;
        })
        let listNamesChunk;

        if (listNames.length < 5 || listNames === undefined) {
            autodop.classList.add('vision');
            listNamesChunk = 'Repositories not found';
        } else {
            listNamesChunk = listNames.join('');
            autodop.classList.add('vision');
        }
        autodop.innerHTML = listNamesChunk;

    } catch (error) {
        autodop.classList.remove('vision');
    }

    return repo.items;
}


function addCard(repo) {                                                            // функция создания и добавления элементов в нодлист
    let arr = Array.from(autodopElement);
    arr.forEach((item) => {
        item.addEventListener('click', addRepoCard);                                // на каждый элемент повешу по слушателю
    });

    async function addRepoCard(e) {
        input.value = '';                                                           // с новой введённой буквой - результат подсказок обновляется
        autodop.classList.remove('vision');

        const newCard = document.createElement('div');                              // создам карточку и её элементы наполнения
        newCard.classList.add('card');

        const cardName = document.createElement('span');
        cardName.textContent = `Name: ${repo[arr.indexOf(e.target)].name}`;

        const cardOwner = document.createElement('span');
        cardOwner.textContent = `Owner: ${repo[arr.indexOf(e.target)].owner.login}`;

        const cardStars = document.createElement('span');
        cardStars.textContent = `Stars: ${repo[arr.indexOf(e.target)].stargazers_count}`;

        const card = document.createElement('div');
        card.classList.add('card');
        const cardInfo = document.createElement('div');
        cardInfo.classList.add('card__info');

        const closeButton = document.createElement('button');
        closeButton.classList.add('close-button');
        const oneLine = document.createElement('span');
        const twoLine = document.createElement('span');
        oneLine.classList.add('close-button__part-one');
        twoLine.classList.add('close-button__part-two');

        cardInfo.appendChild(cardName);                                             // вложу элементы друг в друга
        cardInfo.appendChild(cardOwner);
        cardInfo.appendChild(cardStars);

        closeButton.appendChild(oneLine);
        closeButton.appendChild(twoLine);

        card.appendChild(cardInfo);
        card.appendChild(closeButton);

        nodeRepo.appendChild(card);                                                 // добавлю в разметку

        closeButton.addEventListener('click', () => {
            card.remove();
        })
    }
}


