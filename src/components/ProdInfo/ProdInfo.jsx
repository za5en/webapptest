import React, { useEffect, useState } from 'react';
import './ProdInfo.css'
import {useLocation, useNavigate} from 'react-router-dom';
import OtherHeader from '../OtherHeader/OtherHeader.jsx';
import { goodsAmount } from '../Products/Products.jsx'
import { userInfo } from '../TestData/user.jsx';
import axios from 'axios';
import ReactLoading from "react-loading";

var optionsSelect = new Map()

const ProdInfo = () => {

    let navigate = useNavigate();

    const {products, reviews, reviewsId, myReviews} = require('../TestData/prod.jsx');
    
    const location = useLocation();

    let product = {};

    const [appState, setAppState] = useState();
    const [optionType, setOptionType] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const changeType = (groupName, name, itemPrice) => {
        optionsSelect.set(groupName, name)
        
        setPrice((product.price + itemPrice) * amount)
        setOptionType(optionType + 1)
    }

    const onChange = (edit) => {
        if (edit === '-') {
            if (amount > 0) {
                setPrice(price - product.price)
                setAmount(amount - 1)
            }
        } else {
            setPrice(price + product.price)            
            setAmount(amount + 1)
        }
    }

    const onExit = () => {
        if (typeof amount !== "undefined") {
            goodsAmount.set(`${product.id}`, amount);
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

    let optionPriceBoost = 0;
    if (product?.options.length > 0) {
        for (let i = 0; i < product.options.length; i++) {
            if (!optionsSelect.has(product.options[i].group_name)) {
                optionsSelect.set(product.options[i].group_name, product.options[i].options[0].name)
                optionPriceBoost += product.options[i].options[0].price
            } else {
                for (let j = 0; j < product.options[i].options.length; j++) {
                    if (optionsSelect.get(product.options[i].group_name) === product.options[i].options[j].name) {
                        optionPriceBoost += product.options[i].options[j].price
                    }
                }
            }
        }
    }

    const [amount, setAmount] = useState(goodsAmount.get(`${product.id}`) ?? 0);
    const [price, setPrice] = useState((product.price + optionPriceBoost) * amount);

    // function Variants() {
    //     if (product.variants?.length > 0) {
    //         return  <div className='prodBlock'>
    //                     <div className={'prodOptions'}>Варианты товара</div>
    //                     <form className='radioButtons'>
    //                         {product.variants?.map(item => (
    //                             <div className='selectLine'>
    //                                 <input className='selectPoint' type="radio" name="payment" id={item} value="card"></input>
    //                                 <label className='selectText' for={item}>{item}</label><br />
    //                                 <span className='pricePoint'>99.00 ₽</span>
    //                             </div>
    //                         ))}
    //                     </form>
    //                 </div>
    //     }
    // }

    function Options() {
        if (product?.options.length > 0) {
            return product.options.map(option => ( 
                <div className='prodBlock'>
                        <div className='prodOptions'>{option.group_name}</div>
                        <div className='radioButtons'>
                            {[...Array.from(option.options.values())].map(item => (
                                <div className='selectLine'>
                                    <div className='optionButton'>
                                        <button className={`option${optionsSelect.get(option.group_name) === item.name ? 'active' : ''}`} onClick={() => changeType(option.group_name, item.name, item.price)}>
                                            <div className='promoLine'>
                                                {item.name}
                                                <span className='pricePoint'>+ {item.price} ₽</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            )
        }
    }

    const editReview = async (reviewId) => {
        navigate(`EditReview/${product.id}/${reviewId}`, { replace: false, state: {prodId: product.id, revId: reviewId}});
    }

    async function getReviews() {
        while (reviews.length > 0) {
            reviews.pop();
        }
        while (reviewsId.length > 0) {
            reviewsId.pop();
        }
        while (myReviews.length > 0) {
            myReviews.pop();
        }

        var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_reviews/?bot_id=${userInfo[0].bot_id}&client_id=${userInfo[0].id}&product_id=${location.state.id}`)
        if (response.status === 200) {
            for (let i = 0; i < response.data.length; i++) {
                if (!reviewsId.includes(response.data[i].id)) {
                    reviewsId.push(response.data[i].id)
                    if (response.data[i].reviewer_id === userInfo[0].id) {
                        myReviews.push(response.data[i])
                    } else {
                        reviews.push(response.data[i])
                    }
                }
            }
        }
        setAppState(response);
    }

    useEffect(() => {
        async function makeRequest() {
          setIsLoading(true);
          try {
            await getReviews();
          } catch (e) {
            // console.log(e)
          }
          setIsLoading(false);
        }
    
        makeRequest()
    }, [setAppState]);

    const deleteReview = async (reviewId) => {
        try {
            var response = await axios.post(`https://market-bot.org:8082/clients_api/reviews/delete_review/?bot_id=${userInfo[0].bot_id}&client_id=${userInfo[0].id}&review_id=${reviewId}`)
            if (response.status === 200) {
                await getReviews();
            }
        } catch (e) {
            // console.log(e)
        }
        setAppState(response);
    }

    
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
                        {/* <div className='selectLine'>
                            <div className={'oldPrice1'}>
                                {product.oldPrice}
                            </div>
                            <div className={'discount1'}>
                                {typeof product.oldPrice === 'string' 
                                ? `-${Math.round((1 - product.price / product.oldPrice) * 100)}%` 
                                : ''}
                            </div>
                        </div> */}
                    </div>
                    <div className='prodBlock'>
                        <div className={'description1'}>{product.description}</div>
                        <div className={'prodWeight'}><b>Вес:</b> {product.weight} гр</div>
                    </div>
                    {/* <Variants /> */}
                    <Options />
                    <div className='prodBlock'>
                        <div className='addToCartLine'>
                            <button className='minus-btn' onClick={() => onChange('-')}>-</button>
                            <div className='amount'>{amount}</div>
                            <button className='plus-btn' onClick={() => onChange('+')}>+</button>
                        </div>
                        {
                            product?.options.length > 0 ? (
                                <button className='buy-btn' onClick={() => onExit()}>{price?.toFixed(2)} ₽</button>
                            ) : (
                                <button className='buy-btn' onClick={() => onExit()}>{price?.toFixed(2)} ₽</button>
                            )
                        }
                    </div>
                    {myReviews.length !== 0 ? (
                        <div>
                            <div className='reviews'>Мои отзывы</div>
                            {myReviews.map(item => (
                                <div className='reviewBlock'>
                                    <div className='promoLine'>
                                        <div className='ratingAuthor'>User{item.reviewer_id}</div>
                                        <div className='itemRating'>★{item.rate}</div>
                                        <div className='ratingDate'>{new Date(item.create_date+'Z').toLocaleDateString(undefined, {year: 'numeric', month: '2-digit', day: '2-digit'})}</div>
                                    </div>
                                    {item.content !== '' ? (
                                        <div className='ratingDesc'>{item.content}</div>
                                    ) : (
                                        <div></div>
                                    )}
                                    <div className='promoLine'>
                                        <button className='review-btn' onClick={() => editReview(item.id)}>🖊️</button>
                                        <button className='review-btn' onClick={() => deleteReview(item.id)}>❌</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div></div>
                    )}
                    {reviews.length !== 0 ? (
                        <div>
                            <div className='promoLine'>
                                <div className='reviews'>Отзывы</div>
                                <div className='allReviews' onClick={() => navigate('Reviews', { replace: false })}>Все ({reviews.length})</div>
                            </div>
                            <div>
                                <div className='reviewBlock'>
                                    <div className='promoLine'>
                                        <div className='ratingAuthor'>User{reviews[0].reviewer_id}</div>
                                        <div className='itemRating'>★{reviews[0].rate}</div>
                                        <div className='ratingDate'>{new Date(reviews[0].create_date+'Z').toLocaleDateString(undefined, {year: 'numeric', month: '2-digit', day: '2-digit'})}</div>
                                    </div>
                                    {reviews[0].content !== '' ? (
                                        <div className='ratingDesc'>{reviews[0].content}</div>
                                    ) : (
                                        <div></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        myReviews.length !== 0 ? (
                            <div className='noReviews'>Других отзывов пока нет</div>
                        ) : (
                            <div className='noReviews'>Отзывов пока нет</div>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default ProdInfo;