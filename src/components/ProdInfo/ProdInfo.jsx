import React, { useEffect, useState } from 'react';
import './ProdInfo.css'
import {useLocation, useNavigate} from 'react-router-dom';
import OtherHeader from '../OtherHeader/OtherHeader.jsx';
import { goodsAmount } from '../Products/Products.jsx'
import { userInfo } from '../TestData/user.jsx';
import axios from 'axios';
import ReactLoading from "react-loading";

const ProdInfo = () => {

    let navigate = useNavigate();

    const {products, reviews, reviewsId} = require('../TestData/prod.jsx');
    
    const location = useLocation();

    let product = {};

    const [price, setPrice] = useState();
    let defPrice = 0;

    const [amount, setAmount] = useState();
    let defAmount = 1;

    const [appState, setAppState] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const onChange = (edit) => {
        if (edit === '-') {
            if (typeof amount !== 'undefined') {
                if (amount > 1) {
                    if (typeof price !== 'undefined') {
                        setPrice(price - product.price)
                    } else {
                        setPrice(product.price)
                    }
                    setAmount(amount - 1)
                }
            } else {
                if (defAmount > 1) {
                    setAmount(defAmount - 1)
                    setPrice(defPrice - product.price)
                } else {
                    setAmount(1)
                    setPrice(product.price)
                }
            }
        } else {
            if (typeof amount !== 'undefined') {
                if (typeof price !== 'undefined') {
                    setPrice(price + product.price)
                } else {
                    setPrice(product.price + defPrice)
                }                
                setAmount(amount + 1)
            } else {
                setAmount(defAmount + 1)
                setPrice(product.price + defPrice)
            }
        }
    }

    const onExit = () => {
        if (amount !== "undefined") {
            goodsAmount.set(product.id, amount);
        }
        navigate(-1);
    }

    let find = false;
    for (let i = 0; i < Object.keys(products).length && !find; i++) {
        if (products[i].id === location.state.id) {
            product = products[i];
            find = true;
        }
    }
    defAmount = goodsAmount.get(product.id) ?? 1
    defPrice = product.price * defAmount

    function Variants() {
        if (product.variants?.length > 0) {
            return  <div className='prodBlock'>
                        <div className={'prodOptions'}>Варианты товара</div>
                        <form className='radioButtons'>
                            {product.variants?.map(item => (
                                <div className='selectLine'>
                                    <input className='selectPoint' type="radio" name="payment" id={item} value="card"></input>
                                    <label className='selectText' for={item}>{item}</label><br />
                                    <span className='pricePoint'>99.00 ₽</span>
                                </div>
                            ))}
                        </form>
                    </div>
        }
    }

    function Options() {
        if (product.options?.length > 0) {
            return  <div className='prodBlock'>
                        <div className={'prodOptions'}>Рекомендуемые опции</div>
                        <form className='radioButtons'>
                            {product.options?.map(item => (
                                <div className='selectLine'>
                                    <input className='selectPoint' type="checkbox" name="payment" id={item} value="card"></input>
                                    <label className='selectText' for={item}>{item}</label><br />
                                    <span className='pricePoint'>50 ₽</span>
                                </div>
                            ))}
                        </form>
                    </div>
        }
    }

    useEffect(() => {
        async function getReviews() {
            var response  = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_reviews/?bot_id=${userInfo[0].bot_id}&client_id=${userInfo[0].id}&product_id=${location.state.id}`)
            if (response.status === 200) {
                for (let i = 0; i < response.data.length; i++) {
                    if (!reviewsId.includes(response.data[i].id)) {
                        console.log(response.data[i])
                        reviewsId.push(response.data[i].id)
                        reviews.push(response.data[i])
                    }
                }
            }
            setAppState(response);
        }

        async function makeRequest() {
          setIsLoading(true);
          try {
            await getReviews();
          } catch (e) {
            console.log(e)
          }
          setIsLoading(false);
        }
    
        makeRequest()
    }, [setAppState]);
    
    return (
        <div>
            <OtherHeader />
            {isLoading ? (
                <div className='loadScreen'>
                    <ReactLoading type="bubbles" color="#419FD9"
                        height={100} width={50} />
                </div>
            ) : (
                <div className={'product1 ' + location.state.className}>
                    <div>
                        <img
			        		src={product.photoFile}
			        		alt={product.name}
			        		className='productIcon1'
			        	/>
                    </div>
                    <div className='prodBlock'>
                        <div className={'title1'}>{product.name}</div>
                        <div className={'price1'}>
                            {product.price} ₽
                        </div>
                        <div className='selectLine'>
                            <div className={'oldPrice1'}>
                                {product.oldPrice}
                            </div>
                            <div className={'discount1'}>
                                {typeof product.oldPrice === 'string' 
                                ? `-${Math.round((1 - product.price / product.oldPrice) * 100)}%` 
                                : ''}
                            </div>
                        </div>
                    </div>
                    <div className='prodBlock'>
                        <div className={'description1'}>{product.description}</div>
                        <div className={'prodWeight'}><b>Вес:</b> {product.weight} гр</div>
                    </div>
                    {/* <Variants />
                    <Options /> */}
                    <div className='prodBlock'>
                        <div className='addToCartLine'>
                            <button className='minus-btn' onClick={() => onChange('-')}>-</button>
                            <div className='amount'>{amount ?? defAmount}</div>
                            <button className='plus-btn' onClick={() => onChange('+')}>+</button>
                        </div>
                        <button className='buy-btn' onClick={() => onExit()}>{price?.toFixed(2) ?? defPrice.toFixed(2)} ₽</button>
                    </div>
                    {reviews.length !== 0 ? (
                        <div className='reviews'>Отзывы</div>
                    ) : (
                        <div className='reviews'>Отзывов пока нет</div>
                    )}
                    {reviews.map(item => {
                        return <div>
                            <div className='reviewBlock'>
                                <div className='promoLine'>
                                    <div className='ratingAuthor'>User{item.reviewer_id}</div>
                                    <div className='itemRating'>★{item.rate}</div>
                                    <div className='ratingDate'>{new Date(item.create_date).toLocaleDateString(undefined, {year: 'numeric', month: '2-digit', day: '2-digit'})}</div>
                                </div>
                                <div className='ratingDesc'>{item.content}</div>
                            </div>
                        </div>
                    })}
                </div>
            )}
        </div>
    );
};

export default ProdInfo;