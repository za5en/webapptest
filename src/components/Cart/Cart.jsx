import React from 'react'
import './Cart.css'
import OtherHeader from '../OtherHeader/OtherHeader';
import { useNavigate } from 'react-router-dom';
import { goodsAmount } from '../Products/Products';

const Cart = () => {
    let navigate = useNavigate();
    let goods = []
    let price = 0
    let delivery = 0
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
                        optionNames.push(products[i].options[j].options[index].name)
                        if (prodKey.includes("_")) {
                            prodKey = prodKey.substring(prodKey.indexOf("_") + 1)
                        } else {
                            prodKey = ""
                        }
                        j++;
                    }
                    goods[goods.length - 1].id = key;
                    goods[goods.length - 1].names = optionNames;
                    goods[goods.length - 1].boostPrice = products[i].price + optionPriceBoost;
                    price += (products[i].price + optionPriceBoost) * value;
                }
            }            
        }
        if (goodsAmount.has(`${products[i].id}`)) {
            goods.push(products[i])
            price += products[i].price * goodsAmount.get(`${products[i].id}`)
        }
    }

    if (price < 999) {
        delivery = 200
    }

    // const onChange = (edit, id) => {
    //     console.log(goodsAmount)
    //     if (edit === '-') {
    //         if (goodsAmount.has(id)) {
    //             // changePriceHandler(edit);
    //             if (goodsAmount.get(id) == 1) {
    //                 goodsAmount.delete(id);
    //             }
    //             else {
    //                 goodsAmount.set(id, goodsAmount.get(id) - 1)
    //             }
    //         }
    //     } else {
    //         if (goodsAmount.has(id)) {
    //             // changePriceHandler(edit);
    //             goodsAmount.set(id, goodsAmount.get(id) + 1)
    //         } else {                
    //             // changePriceHandler(edit);
    //             goodsAmount.set(id, 2)
    //         }
    //     }
    //     console.log(goodsAmount)
    // }

    function PaidDelivery() {
        if (price < 999) { //courier && 
            return <div className='deliveryMin'>Минимальная сумма заказа для бесплатной доставки - 999 ₽</div>
        }
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
			    		            src={item.photoFile}
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
                                    {/* <div className='changeAmountButtons'>
                                        <button className='minus-cart-btn' onClick={() => onChange('-', item.id)}>-</button>
                                        <div className='amountCart'>{goodsAmount.get(item.id) ?? 1}</div>
                                        <button className='plus-cart-btn' onClick={() => onChange('+', item.id)}>+</button>
                                    </div>                   */}
                                    <div className='prodParam'>{goodsAmount.get(`${item.id}`)} шт.</div>
                                    <div className='prodPrice'>{(item.price * goodsAmount.get(`${item.id}`)).toFixed(2)} ₽</div>
                                </div>
                            </div>
                        })}
                        <div className='moneyBlock'>
                            <PaidDelivery />
                            <div className='cartLine'>
                                <div className='cartName'>Сумма заказа</div>
                                <div className='cartPrice'>{price.toFixed(2)} ₽</div>
                            </div>
                            <div className='cartLine'>
                                <div className='cartName'>Стоимость доставки</div>
                                <div className='cartPrice'>{delivery ?? 0} ₽</div>
                            </div>                            
                            <div className='cartLine'>
                                <div className='cartName'>Общая сумма</div>
                                <div className='cartPrice'>{(price + (delivery ?? 0)).toFixed(2)} ₽</div>
                            </div>
                        </div>
                        <button className='shop-btn' onClick={() => navigate('ConfirmOrder', { replace: false })}>Далее</button>
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