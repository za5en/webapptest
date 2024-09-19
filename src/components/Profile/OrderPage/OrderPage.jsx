import React, { useEffect, useState } from 'react'
import './OrderPage.css'
import OtherHeader from '../../OtherHeader/OtherHeader';
import { useNavigate } from 'react-router-dom';
import { goodsOrder } from '../OrderCard/OrderCard';
import { goodsReviews } from '../../Feedback/Feedback';
import { contacts } from '../Profile';
import { goodsAmount } from '../../Products/Products';

export var item = []
export var product = []

const OrderPage = () => {
    let navigate = useNavigate();
    let statuses = new Map()

    statuses.set('new', 'Новый')
    statuses.set('at work', 'В процессе')
    statuses.set('in delivery', 'В пути')
    statuses.set('completed', 'Выполнен')
    statuses.set('cancelled', 'Отменен')

    var reviews = false

    for (let i = 0; i < goodsOrder.length; i++) {
        if (goodsOrder[i].review.length !== 0) {
            reviews = true
        }
    }

    const rateProduct = () => {
        // product.length = 0
        // product.push(prod)
        // product = prod
        while (goodsReviews.length > 0) {
            goodsReviews.pop()
        }
        navigate('Feedback', { replace: false })
    }

    const repeatOrder = () => {
        if (goodsAmount.size > 0) {
            goodsAmount.clear()
        }
        for (let i = 0; i < goodsOrder.length; i++) {
            if (goodsOrder[i].option.length > 0) {
                var key = `${goodsOrder[i].product_id}`;
                for (let j = 0; j < goodsOrder[i].option.length; j++) {
                    let find = false;
                    for (let k = 0; k < goodsOrder[i].product.options[j].options.length && !find; k++) {
                        if (goodsOrder[i].option[j].options[0].name === goodsOrder[i].product.options[j].options[k].name) {
                            key += `_${k}`;
                            find = true;
                        }
                    }
                }
                goodsAmount.set(key, goodsOrder[i].count);
            } else {
                goodsAmount.set(`${goodsOrder[i].product_id}`, goodsOrder[i].count);
            }
        }
        navigate('../../../Cart', {replace: false})
    }

    return (
        <div>
            <div>
                <OtherHeader />
                <div className='blocks'>
                    <p className='name'>Заказы</p>
                    <div className='orderViewCard'>
                        {goodsOrder.map(prod => (
                            <div className='orderPositions'>
                                <div className='goodsOrder'>
                                    {typeof prod.product !== 'undefined' && typeof prod.photoFile !== 'undefined' && prod.product !== null ? (
                                        <img
			    		                    src={prod.photoFile[0]}
                                            alt={prod.product.name}
                                            className='prodImg1'
                                        /> 
                                    ) : (
                                        <img
			    		                    src={prod.photoFile}
                                            alt='ProductName'
                                            className='prodImg1'
                                        />
                                    )}
                                    <div className='prodText'>
                                        {typeof prod.product !== 'undefined' && prod.product !== null ? (
                                            <div className='prodName1'>{prod.product.name}</div>
                                        ) : (
                                            <div className='prodName1'>Продукт</div>
                                        )}
                                        <div className='multiple'>
                                            <div className='orderAmount'>{prod.count + ' шт'}</div>
                                            <div className='orderCostInside'>{prod.price + ' ₽'}</div>
                                        </div>
                                        {prod?.option.length > 0 ? (
                                            prod.option.map(item => (
                                                <div className='orderOption'>{item.options[0].name}</div>
                                            ))
                                        ) : (
                                            <div></div>
                                        )}
                                        {prod.review.length === 0 ? (
                                            // <button className='rate-btn' onClick={() => rateProduct(prod)}>Оценить товар</button>
                                            <div></div>
                                        ) : (
                                            <div className='orderMainRate'>Ваша оценка: {prod.review.rate}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className='firstOrderLineEdited'>
                            <div className='orderMainNoMargin'>{'Сумма заказа'}</div>
                            <div className='orderMainNoMarginColored'>{item[0].sum + '₽'}</div>
                        </div>
                        <div className='orderSub'>{'Статус'}</div>
                        <div className='orderMain'>{statuses.get(item[0].status)}</div>
                        {typeof item[0].delivery_address !== "undefined" && item[0].delivery_address !== "" && item[0].delivery_address !== null ? (
                            <div>
                                <div className='orderSub'>{'Адрес доставки'}</div>
                                <div className='orderMain'>{item[0].delivery_address}</div>
                            </div>
                        ) : (
                            <div>
                                <div className='orderSub'>{'Адрес самовывоза'}</div>
                                <div className='orderMain'>{contacts[0].shop_address}</div>
                            </div>
                        )}
                        <div className='orderSub'>{'Дата и время заказа'}</div>
                        <div className='orderMain'>{new Date(item[0].start_time+'Z').toLocaleDateString(undefined, {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})}</div>
                        {/* {!reviews ? ( */}
                            <div className='promoLine'>
                                <button className='rate-btn' onClick={() => rateProduct()}>Оценить заказ</button>
                            </div>
                        {/* ) : (
                            <div></div>
                        )} */}
                    </div>
                    <button className='repeat-btn' onClick={() => repeatOrder()}>Повторить заказ</button>
                </div>
            </div>
        </div>
    )
}

export default OrderPage;