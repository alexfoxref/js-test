window.addEventListener('DOMContentLoaded', () => { // скрипт выполняется после того, 
                                                    // как будет построена структура страницы

    //день третий (закомментировали карточки товаров в index)

    //функция загрузки контента через фетч
    const loadContent = async (url, callback) => { //добавили callback функцию для отработки всех остальных функций, колбэк только после того, как выполнится эвейт
        await fetch(url)
            .then(response => response.json())
            .then(json => createElement(json.goods)); //обработка сразу goods

        callback();
    }

    function createElement(arr) { //не функция стандартная из js
        const goodsWrapper = document.querySelector('.goods__wrapper');

        arr.forEach(function(item) {
            let card = document.createElement('div');
            card.classList.add('goods__item');
            card.innerHTML = `
                <img class="goods__img" src="${item.url}" alt="phone">
                <div class="goods__colors">Доступно цветов: 4</div>
                <div class="goods__title">
                    ${item.title}
                </div>
                <div class="goods__price">
                    <span>${item.price}</span> руб/шт
                </div>
                <button class="goods__btn">Добавить в корзину</button>
            `;
            goodsWrapper.appendChild(card); //интерполяция
        });
    }

    loadContent('js/db.json', () => {

            //день первый

            const cartWrapper = document.querySelector('.cart__wrapper' ),
                cart = document.querySelector('.cart'),
                close = document.querySelector('.cart__close'),
                open = document.querySelector('#cart'),
                goodsBtn = document.querySelectorAll('.goods__btn'),
                products = document.querySelectorAll('.goods__item'),
                confirm = document.querySelector('.confirm'),
                badge = document.querySelector('.nav__badge'),
                totalCost = document.querySelector('.cart__total > span'),
                titles = document.querySelectorAll('.goods__title');
            
            function openCart() {
                cart.style.display = 'block';
                document.body.style.overflow = 'hidden'; // блокируем скроллинг body
            }

            function closeCart() {
                cart.style.display = 'none';
                document.body.style.overflow = ''; // возвращаем скроллинг body в начальное положение
            }

            open.addEventListener('click', openCart);
            close.addEventListener('click', closeCart);

            //кладем товар в корзину
            goodsBtn.forEach(function(btn, i) {
                btn.addEventListener('click', () => {
                    let item = products[i].cloneNode(true), // клонирует i-ую карточку в переменную item
                                                            // true значит, что копируем все внутри элемента products[i]
                        trigger = item.querySelector('button'),
                        removeBtn = document.createElement('div'),
                        empty = cartWrapper.querySelector('.empty');

                    trigger.remove();

                    showConfirm(); // показываем анимацию корзины
                    calcGoods(1); // добавляет товар

                    removeBtn.classList.add('goods__item-remove');
                    removeBtn.innerHTML = '&times'; // добавляет в кнопку removeBtn крестик
                    item.appendChild(removeBtn); // помещает кнопку removeBtn в конец item

                    cartWrapper.appendChild(item); // добавляет карточку item в корзину
                    if (empty) {
                        empty.remove(); // если элемент существует, то удалить его
                    }

                    calcTotal(); //считаем сумму в корзине
                    removeFromCart(); //навешиваем обработчик событий на крестик
                });
            });

            //день второй

            //обрежем описание каждого товара по одному образцу
            function sliceTitle() {
                titles.forEach(function(item) {
                    if (item.textContent.length < 70) { //если количество символов описания каждого товара меньше 70
                        return;
                    } else {
                        const str = item.textContent.slice(0, 70) + '...'; //отрежем первые 70 символов от описания в str и добавим троеточие
                        //const str = `${item.textContent.slice(0, 71)}...`; //в ES6
                        item.textContent = str;
                    }
                });
            }

            sliceTitle();

            function showConfirm() { //анимация на js, сейчас пишут все на css3 - проще
                                    // еще нужно избавлять от дерганий при многократном быстром нажатии (условие: закончилась анимация или нет)
                confirm.style.display = 'block';
                let counter = 100;
                const id = setInterval(frame, 10); //анимация через каждые 10 мс
                function frame() { //функция анимации корзины
                    if (counter == 10) {
                        clearInterval(id); //остановить анимацию
                        confirm.style.display = 'none';
                    } else {
                        counter--;
                        confirm.style.transform = `translateY(-${counter}px)`;
                        confirm.style.opacity = '.' + counter;
                    }
                }
            }

            // setInterval(sliceTitle, 100)
            // setTimeout(sliceTitle, 100)

            // изменяем число на бэдже при добавлении товара в корзину
            function calcGoods(i) { //подсчитаем сколько элементов в корзине
                const items = cartWrapper.querySelectorAll('.goods__item');
                badge.textContent = items.length + i; // аргумент i = 1 - добавление товара, i = 0 - вычитание товара
            }

            //подсчитаем суммарную стоимость товаров в корзине
            function calcTotal() {
                const prices = document.querySelectorAll('.cart__wrapper > .goods__item > .goods__price > span'); //пример сложной кострукции внутри querySelector
                let total = 0; //начальная сумма
                prices.forEach(function(item) {
                    total += +item.textContent; //увеличить тотал на число, переведенное из стринга знаком +
                });
                totalCost.textContent = total;
            }

            //удаление товара из корзины по клику на крестик
            function removeFromCart() {
                const removeBtn = cartWrapper.querySelectorAll('.goods__item-remove');
                let length = removeBtn.length;
                removeBtn.forEach(function(btn) {
                    btn.addEventListener('click', () => {
                        btn.parentElement.remove(); //удаление родительского элемента кнопки-крестика
                        calcGoods(0); //удаляем товар в бэдже
                        calcTotal(); //пересчитываем сумму

                        if ((cartWrapper.querySelectorAll('.goods__item').length == 0) && (cartWrapper.querySelectorAll('.empty').length == 0)) {
                            //если после удаления товаров в корзине нет товаров и нет надписи пустой корзины, то добавить эту надпись
                            returnEmpty();
                        }
                    });
                });
            }

            // функция возврата надписи пустой корзины
            function returnEmpty() {
                const empty = document.createElement('div'); //создадим div
                cartWrapper.appendChild(empty); //поместим его в корзину
                empty.classList.add('empty'); //добавим ему класс
                empty.textContent = 'Ваша корзина пока пуста'; // и содержимое
            }
    }); //обращение к локальному серверу

});



//нужно выполнить код асинхронно, чтобы все, что было раньше отработало
//будем пользоваться callback'ом



// const example = {username: "Ivan"};

// fetch('https://jsonplaceholder.typicode.com/posts', //постим данные на сервер
//         {
//             method: "POST",
//             body: JSON, stringify(example)
//         }) //это промисы, доступ к серверу по адресу, команда отдает обещание того, что это либо выполнится, либо не выполнится
//   .then(response => response.json()) //ответ от сервера в положительном исходе
//   .then(json => console.log(json))

// fetch('https://jsonplaceholder.typicode.com/todos/1') //это промисы, доступ к серверу по адресу, команда отдает обещание того, что это либо выполнится, либо не выполнится
//   .then(response => response.json()) //ответ от сервера в положительном исходе
//   .then(json => console.log(json)) // ответ от сервера response превращает в обьект js, ответ выводим в консоль