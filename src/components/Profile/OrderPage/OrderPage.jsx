import React, { useEffect, useState } from 'react'
import './OrderPage.css'
import OtherHeader from '../../OtherHeader/OtherHeader';
import { useNavigate } from 'react-router-dom';
import { goodsOrder } from '../OrderCard/OrderCard';

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

    const rateProduct = () => {
        // product.length = 0
        // product.push(prod)
        // product = prod
        navigate('Feedback', { replace: false })
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
                                    <img
			    		                src={prod.photoFile}
                                        alt={prod.name}
                                        className='prodImg1'
                                    />
                                    <div className='prodText'>
                                        <div className='prodName1'>{prod.name}</div>
                                        <div className='multiple'>
                                            <div className='orderAmount'>{prod.weight + ' г'}</div>
                                            <div className='orderCostInside'>{prod.price + ' ₽'}</div>
                                        </div>
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
                            <div className='orderMainNoMargin'>{item[0].sum + '₽'}</div>
                        </div>
                        <div className='orderSub'>{'Статус'}</div>
                        <div className='orderMain'>{statuses.get(item[0].status)}</div>
                        <div className='orderSub'>{'Адрес доставки'}</div>
                        <div className='orderMain'>{item[0].delivery_address}</div>
                        <div className='orderSub'>{'Дата и время заказа'}</div>
                        <div className='orderMain'>{new Date(item[0].start_time+'Z').toLocaleDateString(undefined, {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})}</div>
                        {prod.review.length === 0 ? (
                            <button className='repeat-btn' onClick={() => rateProduct()}>Оценить заказ</button>
                        ) : (
                            <div></div>
                        )}
                    </div>
                    <button className='repeat-btn' onClick={() => navigate(-3)}>Повторить заказ</button>
                </div>
            </div>
        </div>
    )
}

export default OrderPage;