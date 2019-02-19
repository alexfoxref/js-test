window.addEventListener('DOMContentLoaded', () => { // скрипт выполняется после того, 
                                                    // как будет построена структура страницы

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

    goodsBtn.forEach(function(btn, i) {
        btn.addEventListener('click', () => {
            let item = products[i].cloneNode(true), // клонирует i-ую карточку в переменную item
                                                    // true значит, что копируем все внутри элемента products[i]
                trigger = item.querySelector('button'),
                removeBtn = document.createElement('div'),
                empty = cartWrapper.querySelector('.empty');

            trigger.remove();

            removeBtn.classList.add('goods__item-remove');
            removeBtn.innerHTML = '&times'; // добавляет в кнопку removeBtn крестик
            item.appendChild(removeBtn); // помещает кнопку removeBtn в конец item

            cartWrapper.appendChild(item); // добавляет карточку item в корзину
            if (empty) {
                empty.remove(); // если элемент существует, то удалить его
            }
        });
    });

});