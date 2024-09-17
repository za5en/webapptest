// let products = []
let categories = ['Основные блюда', 'Бургеры', 'Салаты', 'Десерты', 'Напитки']
let banners = []
let reviews = []
let reviewsId = []
let myReviews = []
let products = [{id: 1, name: 'Бургер', price: 99, category_name: 'Основные блюда', oldPrice: "129.10 ₽", weight: 250, variants: ['вариант 1', 'вариант 2'], options: ['опция 1', 'опция 2'], description: 'Еда вкусная и съедобная Еда вкусная и съедобная Еда вкусная и съедобная'},
{id: 2, name: 'Бургер', price: 99, category_name: 'Основные блюда', oldPrice: "129.00 ₽", weight: 250, description: 'Еда вкусная и съедобная', photoFile: [""], stickers: ["123"]},
{id: 3, name: 'Очень-очень длинное название продукта, который мог бы называться просто очень вкусным чаем', price: 99, category_name: 'Основные блюда', weight: 250, description: 'Еда вкусная и съедобная', photoFile: [""], stickers: ["123", "1243213", "new"]},
{id: 4, name: 'Бургер', price: 99, category_name: 'Основные блюда', weight: 250, description: 'Еда вкусная и съедобная', photoFile: ["", "", ""], stickers: ["123"]},
{id: 5, name: 'Бургер', price: 99, category_name: 'Основные блюда', weight: 250, description: 'Еда вкусная и съедобная', photoFile: [""]},
{id: 6, name: 'Бургер', price: 99, category_name: 'Основные блюда', weight: 250, description: 'Еда вкусная и съедобная', photoFile: [""]},
{id: 7, name: 'Бургер', price: 99, category_name: 'Бургеры', weight: 250, description: 'Еда вкусная и съедобная', photoFile: [""]},
{id: 8, name: 'Бургер', price: 99, category_name: 'Салаты', weight: 250, description: 'Еда вкусная и съедобная', photoFile: [""]},
{id: 9, name: 'Бургер', price: 99, category_name: 'Десерты', weight: 250, description: 'Еда вкусная и съедобная', photoFile: [""]},
{id: 10, name: 'Бургер', price: 99, category_name: 'Напитки', weight: 250, description: 'Еда вкусная и съедобная', photoFile: [""]}]
// let banners = [{id: 1, image: '', header: "Пример баннера демонстрирует работу баннеров", description: "Демонстрация баннера. Хотите такой магазин? Напишите нам в Телеграм.", goods: [88, 89, 86]},
// {id: 2, image: '', header: "Пример баннера #2 находится здесь", description: "Демонстрация баннера. Хотите такой магазин? Не пишите нам в Телеграм."},
// {id: 3, image: '', header: "Пример баннера #3 находится здесь", description: "Демонстрация баннера. Хотите такой магазин? Не пишите нам в Телеграм."}]
module.exports = {products, categories, banners, reviews, reviewsId, myReviews};