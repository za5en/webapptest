import React, { useState } from 'react'
import './Cart.css'
import OtherHeader from '../OtherHeader/OtherHeader';
import { useNavigate } from 'react-router-dom';
import { goodsAmount } from '../Products/Products';
import { selection } from './ConfirmOrder/ConfirmOrder.jsx';
// import axios from 'axios';
// import { userInfo } from '../TestData/user.jsx';

const Cart = () => {
    let navigate = useNavigate();
    let goods = []
    let price = 0
    // const [delivery, setDelivery] = useState(200)

    const {products} = require('../TestData/prod.jsx');

    let find = false;
    for (let i = 0; i < Object.keys(products).length && !find; i++) {
        if (typeof products[i]?.options !== "undefined" && products[i]?.options.length > 0) {
            for (var [key, value] of goodsAmount) {
                if (key.includes(`${products[i].id}`)) {
                    goods.push(JSON.parse(JSON.stringify(products[i])));
                    var prodKey = key.substring(key.indexOf("_") + 1);
                    var j = 0;
                    var optionPriceBoost = 0;
                    var optionNames = []
                    while (prodKey.length > 0) {
                        var index = 0
                        if (prodKey.includes("_")) {
                            index = prodKey.substring(0, prodKey.indexOf("_"));
                        } else {
                            index = prodKey
                        }
                        optionPriceBoost += products[i].options[j].options[index].price;
                        optionNames.push(products[i].options[j].options[index].name);
                        if (prodKey.includes("_")) {
                            prodKey = prodKey.substring(prodKey.indexOf("_") + 1)
                        } else {
                            prodKey = ""
                        }
                        j++;
                    }
                    goods[goods.length - 1].id = key;
                    goods[goods.length - 1].names = optionNames;
                    goods[goods.length - 1].price = products[i].price + optionPriceBoost;
                    price += (products[i].price + optionPriceBoost) * value;
                }
            }            
        }
        if (goodsAmount.has(`${products[i].id}`)) {
            goods.push(products[i])
            price += products[i].price * goodsAmount.get(`${products[i].id}`)
        }
    }

    const [finalPrice, setFinalPrice] = useState(price);

    // if (price < 999) {
    //     delivery = 200
    // }

    // const onAdd = (product) => {
    //     let added = addedItems.find(item => item.id === product.id);

    //     let addPrice = price ?? nullPrice;

    //     if (added) {
    //         newItems = addedItems;
    //         addPrice += product.price;
    //     } else {
    //         newItems = [...addedItems, product];
    //         addPrice += product.price;
    //         goodsAmount.set(`${product.id}`, 1);
    //     }

    //     setPrice(addPrice)
    //     setAddedItems(newItems)
    // }

    const changePrice = (edit, prodPrice) => {
        if (edit === '+') {
            if (typeof finalPrice === "undefined" && price != 0) {
                setFinalPrice(price + Number(prodPrice));
            } else {
                setFinalPrice(price + Number(prodPrice));
            }
        } else {
            if (typeof finalPrice === "undefined" && price != 0) {
                if (price - Number(prodPrice) >= 0) { 
                    setFinalPrice(price - Number(prodPrice));
                } else {
                    setFinalPrice(0);
                }
            } else {
                if (finalPrice - Number(prodPrice) >= 0) { 
                    setFinalPrice(price - Number(prodPrice));
                } else {
                    setFinalPrice(0);
                }
            }
        }
    }

    const onChange = (edit, price, id) => {
        if (edit === '-') {
            if (goodsAmount.has(`${id}`)) {
                changePrice(edit, price);
                if (goodsAmount.get(`${id}`) == 1) {
                    goodsAmount.delete(`${id}`);
                }
                else {
                    goodsAmount.set(`${id}`, goodsAmount.get(`${id}`) - 1)
                }
            }
        } else {
            if (goodsAmount.has(`${id}`)) {
                changePrice(edit, price);
                goodsAmount.set(`${id}`, goodsAmount.get(`${id}`) + 1)
            } else {                
                changePrice(edit, price);
                goodsAmount.set(`${id}`, 2)
            }
        }
    }

    const toConfirm = () => {
        selection.set('delivery', 0);
        selection.set('payment', 0);
        selection.set('bonuses', 0);
        navigate('ConfirmOrder', { replace: false })
    }

    function Goods() {
        if (goods.length === 0) {
            return  <div>
                        <div className='null'>Ваша корзина пока пуста</div>
                        <button className='shop-btn' onClick={() => navigate(-1)}>К списку товаров</button>
                    </div>
        } else {
            return  <div>
                        {[...Array.from(goods)].map(item => {
                            return <div className='goods'>
                                <img
			    		            src={item.photoFile[0]}
                                    alt={item.name}
                                    className='prodImg'
                                />
                                <div className='prodText'>
                                    <div className='prodName'>{item.name}</div>
                                    {
                                        typeof item.weigth !== "undefined" ? (
                                            <div className='prodParam'>{item.weight} гр</div>
                                        ) : (
                                            <div></div>
                                        )
                                    }
                                    {typeof item?.options !== "undefined" && item?.options.length > 0 ? (
                                        item.names.map(option => (
                                            <div className='prodOption'>{option}</div>
                                        ))
                                    ) : (
                                        <div></div>
                                    )}
                                    {/* <div className='prodParam'>{goodsAmount.get(`${item.id}`)} шт.</div> */}
                                    <div className='addToCartButtonsCart'>
                                        <button className='minus-cart-btn' onClick={() => onChange('-', item.price, item.id)}>–</button>
                                        <div className='amountCart'>{goodsAmount.get(`${item.id}`) ?? 1} шт</div>
                                        <button className='plus-cart-btn' onClick={() => onChange('+', item.price, item.id)}>+</button>
                                    </div>
                                    <div className='prodPrice'>{(item.price * goodsAmount.get(`${item.id}`)).toFixed(2)} ₽</div>
                                </div>
                            </div>
                        })}
                        <div className='moneyBlock'>
                            {/* <PaidDelivery /> */}
                            <div className='cartLine'>
                                <div className='cartName'>Сумма заказа</div>
                                <div className='cartPrice'>{finalPrice.toFixed(2)} ₽</div>
                            </div>
                            {/* <div className='cartLine'>
                                <div className='cartName'>Стоимость доставки</div>
                                <div className='cartPrice'>{userInfo[0].delivery_cost ?? 0} ₽</div>
                            </div>                            
                            <div className='cartLine'>
                                <div className='cartName'>Общая сумма</div>
                                <div className='cartPrice'>{(price + (userInfo[0].delivery_cost ?? 0)).toFixed(2)} ₽</div>
                            </div> */}
                        </div>
                        <button className='shop-btn' onClick={() => toConfirm()}>Далее</button>
                    </div>
        }
    }
    
    return (
        <div>
            {/* {isLoading ? (
                <div className='loadScreen'>
                    <ReactLoading type="bubbles" color="#419FD9"
                        height={100} width={50} />
                </div>
            ) : ( */}
                <div>
                    <OtherHeader />
                    <div className='cart'>
                        <p className='name'>Корзина</p>
                        <Goods />
                    </div>
                </div>
            {/* )} */}
        </div>
    )
}

export default Cart;