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

const Products = () => {

    let navigate = useNavigate();

    const {products, categories} = require('../TestData/prod.jsx');

    const [addedItems, setAddedItems] = useState([]);

    const {tg, queryId} = useTelegram();

    const data = {}

    let newItems = [];

    let price = [0];

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
        const added = addedItems.find(item => item.id === product.id);

        if (added) {
            newItems = Object.values(added).filter(item => item.id !== product.id);
            price[0] += parseFloat(product.price.substring(0, product.price.indexOf(' ')))
            console.log(price[0])
        } else {
            newItems = [...addedItems, product];
            price[0] += parseFloat(product.price.substring(0, product.price.indexOf(' ')))
            console.log(price[0])
        }

        setAddedItems(newItems)

        if (newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)}`
            })
        }
    }

    return (
        <div>
            <Header />
            <div className='list'>
                {[...Array.from(productsByCat.keys())].map(key => (
                    <div>
                        <span id={key} className='catName'>{key}</span>
                        <div className='cat'>
                        {productsByCat.get(key).map(item => (
                            <ProductItem 
                                product={item}
                                onAdd={onAdd}
                                className={'item'}
                            />
                        ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className='space'/>
            <footer>
                <button className='cart-btn' onClick={() => navigate('Cart', { replace: false })}>{`Корзина: ${price}₽`}</button>
            </footer>
        </div>
    );
};

export default Products;
