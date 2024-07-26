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

    const [price, setPrice] = useState();

    const {tg, queryId} = useTelegram();

    const data = {}

    let newItems = [];

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

        let addPrice = price ?? 0;

        if (added) {
            newItems = addedItems;
            addPrice += parseFloat(product.price.substring(0, product.price.indexOf(' ')));
        } else {
            newItems = [...addedItems, product];
            addPrice += parseFloat(product.price.substring(0, product.price.indexOf(' ')));
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
                <button className='cart-btn' onClick={() => navigate('Cart', { replace: false })}>{`Корзина: ${price?.toFixed(2) ?? 0} ₽`}</button>
            </footer>
        </div>
    );
};

export default Products;
