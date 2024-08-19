import React, { useState } from 'react';
import { goodsAmount } from '../Products/Products.jsx';
import ProductItem from '../ProductItem/ProductItem.jsx';
import Button from '../Button/Button.jsx';
import { useNavigate } from 'react-router-dom';
import search from "../../assets/icons/search.svg"
import "../Header/Header.css"

let goods = [];

const SearchPage = () => {
    const {products} = require('../TestData/prod.jsx');
    let navigate = useNavigate();

    const [appState, setAppState] = useState(0)

    let newItems = [];

    let nullPrice = 0;

    const [addedItems, setAddedItems] = useState([]);

    const [price, setPrice] = useState();

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

    if (document.getElementById("search") === null) {
        goods = [];
    } else if (document.getElementById("search").value === '') {
        goods = [];
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

    const request = () => {
        var prodName = document.getElementById("search").value
        goods = []
        if (prodName !== "") {
            for (let i = 0; i < Object.keys(products).length; i++) {
                var name = products[i].name.toLowerCase()
                if (name.includes(prodName.toLowerCase())) {
                    goods.push(products[i]);
                }
            }
        }

        setAppState(appState + 1)
    }
    
    return (
        <div>
            <div className='searchHeader'>
                <div className='firstLine'>
                    <Button className='backButton' onClick={() => navigate(-1)}><b className='cancel'>Назад</b></Button>
                </div>
                <div className='searchLine'>
                    <img className='searchIcon' src={search}></img>
                    <input className='searchField' type="text" id='search' placeholder='Поиск товаров' autoFocus onChange={() => request()}></input>
                </div>
            </div>
            <div>
                {
                    goods.length === 0 ?
                        document.getElementById("search") === null ? (
                            <div className='blocks'>
                                <div className='nullEdited'>Введите запрос</div>
                            </div>
                        ) : document.getElementById('search').value.length === 0 ? (
                                <div className='blocks'>
                                    <div className='nullEdited'>Введите запрос</div>
                                </div>
                            ) : (
                                <div className='blocks'>
                                    <div className='nullEdited'>Ничего не найдено</div>
                                </div>
                            )
                    : (
                        <div className='list'>
                            <div className='cat'>
                                {goods.map(item => (
                                    item.it_hidden ? (
                                        <div></div>
                                    ) : (
                                        <ProductItem
                                            product={item}
                                            onAdd={onAdd}
                                            className={'item'}
                                            changePrice={changePrice}
                                            link={2}
                                        />
                                    )
                                ))}
                            </div>
                        </div>
                    )
                }
                        
            </div>
        </div>
    );
};

export default SearchPage;