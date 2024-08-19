import React, { useState } from 'react'
import '../Blocks.css'
import OtherHeader from '../../../OtherHeader/OtherHeader';
import { useNavigate } from 'react-router-dom';
import ProductItem from '../../../ProductItem/ProductItem.jsx';

const Favorites = () => {
    let navigate = useNavigate();

    const {products} = require('../../../TestData/prod.jsx');

    const [appState, setAppState] = useState(0)

    let newItems = [];

    let goods = [];

    let nullPrice = 0;

    const [addedItems, setAddedItems] = useState([]);

    const [price, setPrice] = useState();

    for (let i = 0; i < Object.keys(products).length; i++) {
        if (products[i].like) {
            goods.push(products[i]);
        }
    }

    const onAdd = (product) => {
        let added = addedItems.find(item => item.id === product.id);

        let addPrice = price ?? nullPrice;

        if (added) {
            newItems = addedItems;
            addPrice += product.price;
        } else {
            newItems = [...addedItems, product];
            addPrice += product.price;
            goodsAmount.set(`${product.id}`, 1);
        }

        setPrice(addPrice)
        setAddedItems(newItems)
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

    function FavList() {
        if (goods.length !== 0) {
            return  <div className='list'>
                        <div className='cat'>
                        {goods.map(item => (
                            <ProductItem 
                                product={item}
                                onAdd={onAdd}
                                className={'item'}
                                changePrice={changePrice}
                                link={3}
                            />
                        ))}
                        </div>
                    </div>
        } else {
            return  <div>
                    <div className='nullEdited'>Избранных товаров пока нет</div>
                    <button className='shop-btn' onClick={() => navigate(-2)}>К списку товаров</button>
                    </div>
        }
    }

    return (
        <div>
            <OtherHeader />
            <div className='blocks'>
                <p className='name'>Избранное</p>
                <FavList />
            </div>
        </div>
    )
}

export default Favorites;