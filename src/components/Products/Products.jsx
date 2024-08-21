import './Products.css'
import ProductItem from '../ProductItem/ProductItem';
import { useState } from 'react'
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';
import Banner from '../Banner/Banner.jsx';
import cart from "../../assets/icons/cart.svg"

export var goodsAmount = new Map()

const Products = () => {

    let navigate = useNavigate();

    const {products, categories, banners} = require('../TestData/prod.jsx');

    const [addedItems, setAddedItems] = useState([]);

    const [price, setPrice] = useState();

    let newItems = [];

    let nullPrice = 0;

    let amount = 0;

    let productsByCat = new Map();

    // let hiddenCats = new Map();

    for (let i = 0; i < categories.length; i++) {
        productsByCat.set(categories[i], []);
        // hiddenCats.set(categories[i], 0);
    }

    for (let i = 0; i < Object.keys(products).length; i++) {
        if (products[i].category_name === null) {
            products[i].category_name = 'Без категории'
        }
        let currentProd = productsByCat.get(products[i].category_name);
        if (typeof currentProd != 'undefined' && typeof products[i] != 'undefined') {
            currentProd.push(products[i]);
        }
        productsByCat.set(products[i].category_name, currentProd);
        // if (currentProd.it_hidden) {
        //     let hidden = hiddenCats.get(products[i].categories);
        //     hiddenCats.set(products[i].categories, hidden + 1);
        // }
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

    for (var [key, value] of goodsAmount) {
        let find = false;
        for (let i = 0; i < products.length && !find; i++) {
            if (typeof products[i]?.options !== "undefined" && products[i]?.options.length > 0) {
                if (key.includes("_")) {
                    if (`${products[i].id}` === key.substring(0, key.indexOf("_"))) {
                        find = true;
                        amount += value;
                        var prodKey = key.substring(key.indexOf("_") + 1);
                        var j = 0;
                        var optionPriceBoost = 0;
                        while (prodKey.length > 0) {
                            var index = 0
                            if (prodKey.includes("_")) {
                                index = prodKey.substring(0, prodKey.indexOf("_"));
                            } else {
                                index = prodKey
                            }
                            optionPriceBoost += products[i].options[j].options[index].price;
                            if (prodKey.includes("_")) {
                                prodKey = prodKey.substring(prodKey.indexOf("_") + 1)
                            } else {
                                prodKey = ""
                            }
                            j++;
                        }
                        if (nullPrice === 0) {
                            nullPrice = (products[i].price + optionPriceBoost) * value;
                        } else {
                            nullPrice = nullPrice + (products[i].price + optionPriceBoost) * value;
                        }
                    }
                }
                
            }
            if (`${products[i].id}` === key) {
                find = true;
                amount += value;
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
            <div className='bannerLine'>
                {banners.map(item => (
                    <div className='scroll'>
                        <Banner
                            header={item.header}
                            id={item.id}
                        />
                    </div>
                ))}
            </div>
            <div className='list'>
                {productsByCat.size !== 0 ? 
                [...Array.from(productsByCat.keys())].map(key => (
                    <div>
                        {/* {hiddenCats.get(key) === productsByCat.get(key).length ? (
                            <div></div>
                        ) : (
                            <div> */}
                                <span id={key} className='catName'>{key}</span>
                                <div className='cat'>
                                {typeof productsByCat.get(key) !== 'undefined' ? (
                                    productsByCat.get(key).map(item => (
                                        item.it_hidden ? (
                                            <div></div>
                                        ) : (
                                            <ProductItem 
                                            product={item}
                                            onAdd={onAdd}
                                            className={'item'}
                                            changePrice={changePrice}
                                            link={1}
                                        />
                                        )
                                    ))) : ( 
                                    <div></div>
                                )}
                                </div>
                            {/* </div>
                        )} */}
                    </div>
                )) : (
                    <div className='null'>Владелец магазин пока не добавил ни одного товара</div>
                )}
            </div>
            {
                goodsAmount.size > 0 ? (
                    <div className='space'/>
                ) : (
                    <div></div>
                )
            }            
            <footer>
                {
                    goodsAmount.size > 0 ? (
                        <div className='newCartButton'>
                            <button className='cart-btn-floating' onClick={() => navigate('Cart', { replace: false })}>
                                <div className='amountText'>{amount}</div>
                                <img className='cartIcon' src={cart}></img>
                            </button>
                        </div>
                        // {/* {`Корзина: ${price?.toFixed(2) ?? nullPrice.toFixed(2)} ₽`} */}
                    ) : (
                        <div></div>
                    )
                }                
            </footer>
        </div>
    );
};

export default Products;
