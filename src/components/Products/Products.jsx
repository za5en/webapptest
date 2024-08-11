import './Products.css'
import ProductItem from '../ProductItem/ProductItem';
import { useTelegram } from '../../hooks/useTelegram';
import {useCallback, useEffect, useState} from 'react'
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';

const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => {
        return acc += 1
    }, 0)
}

export var goodsAmount = new Map()

const Products = () => {

    let navigate = useNavigate();

    const {products, categories} = require('../TestData/prod.jsx');

    const [addedItems, setAddedItems] = useState([]);

    const [price, setPrice] = useState();

    const {tg, queryId} = useTelegram();

    const data = {}

    let newItems = [];

    let nullPrice = 0;

    let productsByCat = new Map();

    for (let i = 0; i < categories.length; i++) {
        productsByCat.set(categories[i], []);
    }

    for (let i = 0; i < Object.keys(products).length; i++) {
        let currentProd = productsByCat.get(products[i].category);
        currentProd.push(products[i]);
        productsByCat.set(products[i].category, currentProd);
    }

    const onSendData = useCallback(() => {
        data = {
            product: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId
        }
        fetch('http://localhost:8000', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    }, [data])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    const onAdd = (product) => {
        let added = addedItems.find(item => item.id === product.id);

        let addPrice = price ?? nullPrice;

        if (added) {
            newItems = addedItems;
            addPrice += product.price;
        } else {
            newItems = [...addedItems, product];
            addPrice += product.price;
            goodsAmount.set(product.id, 1);
        }

        setPrice(addPrice)
        setAddedItems(newItems)

        // if (newItems.length === 0) {
        //     tg.MainButton.hide();
        // } else {
        //     tg.MainButton.show();
        //     tg.MainButton.setParams({
        //         text: `Корзина: ${price.toFixed(2)}₽`
        //     })
        // }
    }

    for (var [key, value] of goodsAmount) {
        let find = false;
        for (let i = 0; i < products.length && !find; i++) {
            if (products[i].id === key) {
                find = true;
                if (nullPrice === 0) {
                    nullPrice = products[i].price * value;
                } else {
                    nullPrice = nullPrice + products[i].price * value;
                }
            }
        }
    }

    const changePrice = (edit, prodPrice) => {
        if (edit === '+') {
            if (typeof price === "undefined" && nullPrice != 0) {
                setPrice(nullPrice + Number(prodPrice));
            } else {
                setPrice(price + Number(prodPrice));
            }
        } else {
            if (typeof price === "undefined" && nullPrice != 0) {
                if (nullPrice - Number(prodPrice) >= 0) { 
                    setPrice(nullPrice - Number(prodPrice));
                } else {
                    setPrice(0);
                }
            } else {
                if (price - Number(prodPrice) >= 0) { 
                    setPrice(price - Number(prodPrice));
                } else {
                    setPrice(0);
                }
            }
        }
    }

    return (
        <div>
            <Header />
            <div className='list'>
                {productsByCat.size !== 0 ? 
                [...Array.from(productsByCat.keys())].map(key => (
                    <div>
                        <span id={key} className='catName'>{key}</span>
                        <div className='cat'>
                        {productsByCat.get(key).map(item => (
                            <ProductItem 
                                product={item}
                                onAdd={onAdd}
                                className={'item'}
                                changePrice={changePrice}
                            />
                        ))}
                        </div>
                    </div>
                )) : (
                    <div className='null'>Владелец магазин пока не добавил ни одного товара</div>
                )}
            </div>
            <div className='space'/>
            <footer>
                <button className='cart-btn' onClick={() => navigate('Cart', { replace: false })}>{`Корзина: ${price?.toFixed(2) ?? nullPrice.toFixed(2)} ₽`}</button>
            </footer>
        </div>
    );
};

export default Products;
