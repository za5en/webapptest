import React, { useState } from 'react';
import './OrderCard.css'
import { useNavigate } from 'react-router-dom';
import { item } from '../OrderPage/OrderPage.jsx'
import { userInfo } from '../../TestData/user';
import ReactLoading from "react-loading";
import { goodsAmount } from '../../Products/Products.jsx';
import ProdService from '../../../services/ProdService.js';
import OrdersService from '../../../services/OrdersService.js';

export var goodsOrder = new Map()
export var goodsGlobal = new Map()

const OrderCard = ({order, profile}) => {
    let navigate = useNavigate();
    
    const [appState, setAppState] = useState();
    const [isLoading, setIsLoading] = useState(false);

    let statuses = new Map()

    statuses.set('new', 'Новый')
    statuses.set('at work', 'В процессе')
    statuses.set('in delivery', 'В пути')
    statuses.set('completed', 'Выполнен')
    statuses.set('cancelled', 'Отменен')

    const openOrder = async () => {
        while (item.length > 0) {
            item.pop()
        }
        item.push(order)

        async function getProducts() {
            var response  = await OrdersService.getOnlyProducts(item[0].id);
            goodsOrder = await OrdersService.getCart(response.data[0].cart_id);
            // var goodsInfo = await getProductInfo();
            for (let i = 0; i < goodsOrder.length; i++) {
                goodsOrder[i].review = await getReviews(goodsOrder[i].product_id)
                goodsOrder[i].photoFile = []
                var ok = true;
                for (var j = 0; j < 3 && ok; j++) {
                    var photo = await OrdersService.getPhoto(goodsOrder[i].product_id, j)
                    if (typeof photo === 'undefined') {
                        ok = false;
                    } else {
                        goodsOrder[i].photoFile.push(photo);
                    }
                }
                // let find = false;
                // for (let j = 0; j < goodsInfo.length && !find; j++) {
                //     if (goodsOrder[i].product_id === goodsInfo[j].id) {
                //         find = true;
                //         // goodsOrder[i].name = goodsInfo[j].name;
                //         // goodsOrder[i].price = goodsInfo[j].price;
                //         // goodsOrder[i].weight = goodsInfo[j].weight;
                //     }
                // }
            }
            setAppState(goodsOrder);
        }
    
        async function getReviews(prodId) {
            var review = []
            try {
                var response = ProdService.getReviews(prodId);
                if (response.status === 200) {
                    for (let i = 0; i < response.data.length; i++) {
                        if (response.data[i].reviewer_id === userInfo[0].id) {
                            review = response.data[i]
                        }
                    }
                }
                setAppState(response);
            } catch (e) {
                // console.log(e)
            }
            return review 
        }
      
        async function makeRequest() {
            setIsLoading(true);
            try {
                await getProducts();
            } catch (e) {
                // console.log(e)
            }
            setIsLoading(false);
        }

        await makeRequest()
        navigate('OrderPage', { replace: false })
    }

    const repeatOrder = () => {
        if (goodsAmount.size > 0) {
            goodsAmount.clear()
        }
        for (let i = 0; i < goods.length; i++) {
            if (goods[i].option.length > 0) {
                var key = `${goods[i].product_id}`;
                for (let j = 0; j < goods[i].option.length; j++) {
                    let find = false;
                    for (let k = 0; k < goods[i].product.options[j].options.length && !find; k++) {
                        if (goods[i].option[j].options[0].name === goods[i].product.options[j].options[k].name) {
                            key += `_${k}`;
                            find = true;
                        }
                    }
                }
                goodsAmount.set(key, goods[i].count);
            } else {
                goodsAmount.set(`${goods[i].product_id}`, goods[i].count);
            }
        }
        navigate('../../Cart', {replace: false})
    }

    var goods = goodsGlobal.get(order.id)

    return (
        <div>
            {isLoading ? (
                <div className='loadScreen'>
                    <ReactLoading type="bubbles" color="#419FD9"
                        height={100} width={50} />
                </div>
            ) : (
                profile ? (
                    <div className='orderCard'  onClick={() => openOrder()}>
                        <div className='orderCardWithPic'>
                            {typeof goods !== 'undefined' ? (
                                    typeof goods[0].product !== 'undefined' && goods[0].product !== null && typeof goods[0].product.photoFile !== 'undefined' ? (
                                        <img
			    		                    src={goods[0].product.photoFile}
                                            alt={goods[0].product.name}
                                            className='prodImgPic'
                                        /> 
                                    ) : (
                                        <img
			    		                    src='null'
                                            alt='ProductName'
                                            className='prodImgPic'
                                        />
                                    )
                                ) : (
                                    <div></div>
                                )
                            }
                            <div className='prodText'>
                                <div className='orderNumPic'>{'#' + order.id}</div>
                                <div className='orderStatusPic'>{statuses.get(order.status)}</div>
                                <div className='lightTextPic'>{new Date(order.start_time+'Z').toLocaleDateString(undefined, {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit'})}</div>
                            </div>
                        </div>
                    </div>
                ) : (
                <div className='orderCard'>
                    <div className='firstOrderLine' onClick={() => openOrder()}>
                        <div className='orderDate'>{new Date(order.start_time+'Z').toLocaleDateString(undefined, {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit'})}</div>
                        <div className='orderNum'>{'#' + order.id}</div>
                        <div className='orderStatus'>{statuses.get(order.status)}</div>
                        {/* <div className='orderCost'>{order.sum + '₽'}</div> */}
                    </div>
                    <div className='lightText' onClick={() => openOrder()}>{order.delivery_type === 'pickup' ? "Самовывоз" : "Доставка"}</div>
                    {
                        typeof goods !== 'undefined' ? (
                            goods.map(item => (
                                <div onClick={() => openOrder()}>
                                    <div className='promoLine'>
                                    {typeof item.product !== 'undefined' && item.product !== null ? (
                                        <div className='prodValue'>{item.count} x {item.product.name}</div>
                                        ) : (
                                        <div className='prodValue'>{item.count} x Продукт</div>
                                    )}
                                        <div className='priceValue'>{item.price}</div>
                                    </div>
                                    {typeof item.option !== 'undefined' ?
                                        item.option.length > 0 ? (
                                            item.option.map(prod => (
                                                <div className='optionText'>{prod.options[0].name}</div>
                                            ))
                                        ) : (
                                            <div></div>
                                        ) : (
                                            <div></div>
                                        )
                                    }
                                    <hr className="solidOrder"></hr>
                                </div>
                            ))
                        ) : (
                            <div></div>
                        )
                    }
                    <button className='repeat-another' onClick={() => repeatOrder()}>Повторить заказ</button>
                </div>
                )
            )}
        </div>
    );
};

export default OrderCard;