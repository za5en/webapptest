import React, { useState } from 'react';
import './BannerPage.css'
import {useLocation, useNavigate} from 'react-router-dom';
import OtherHeader from '../OtherHeader/OtherHeader.jsx';
import { goodsAmount } from '../Products/Products.jsx';
import ProductItem from '../ProductItem/ProductItem.jsx';
import cart from "../../assets/icons/cart.svg"

const BannerPage = () => {
    const {products, banners} = require('../TestData/prod.jsx');
    
    const location = useLocation();

    const navigate = useNavigate();

    let banner = {};

    let goods = [];

    let newItems = [];

    let nullPrice = 0;

    let amount = 0;

    const [addedItems, setAddedItems] = useState([]);

    const [price, setPrice] = useState();

    let find = false;
    for (let i = 0; i < Object.keys(banners).length && !find; i++) {
        if (banners[i].banner_id === location.state.id) {
            banner = banners[i];
            find = true;
        }
    }

    if (typeof banner.products !== "undefined") {
        for (let i = 0; i < banner.products.length; i++) {
            find = false;
            for (let j = 0; j < Object.keys(products).length && !find; j++) {
                if (products[j].id === banner.products[i]) {
                    goods.push(products[j]);
                    find = true;
                }
            }
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
            <OtherHeader />
            <div className='bannerPage'>
                <div>
                    <img
			    		src={banner.photoFile}
			    		alt={banner.title}
			    		className='productIconBanner'
			    	/>
                </div>
                <div className='prodBlock'>
                    <div className={'titleBanner'}>{banner.title}</div>
                    <div className={'descriptionBanner'}>{banner.text}</div>
                </div>
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
            </div>
            <footer>
                {
                    goodsAmount.size > 0 ? (
                        <div className='newCartButton'>
                            <button className='cart-btn-floating' onClick={() => navigate('../../Cart', { replace: false })}>
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

export default BannerPage;