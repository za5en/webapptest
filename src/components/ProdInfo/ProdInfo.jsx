import React, { useEffect, useState } from 'react';
import './ProdInfo.css'
import {useLocation, useNavigate} from 'react-router-dom';
import OtherHeader from '../OtherHeader/OtherHeader.jsx';
import { goodsAmount } from '../Products/Products.jsx'
import { userInfo } from '../TestData/user.jsx';
import axios from 'axios';
import ReactLoading from "react-loading";
import like1 from "../../assets/icons/non_like.svg"
import like2 from "../../assets/icons/like.svg"
import Button from '../Button/Button.jsx';

var optionsSelect = new Map()

const ProdInfo = () => {

    let navigate = useNavigate();

    const {products, reviews, reviewsId, myReviews, stickerInfo, stickerContent} = require('../TestData/prod.jsx');
    
    const location = useLocation();

    let product = {};

    const [appState, setAppState] = useState();
    const [optionType, setOptionType] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [prodState, setProdState] = useState(0);

    const changeType = (groupName, name, itemPrice) => {
        optionsSelect.set(`${product.id}_${groupName}`, name)
        var priceBoost = 0
        var key = `${product.id}`
        for (let i = 0; i < product.options.length; i++) {
            var index = 0;
            var find = false;
            for (let j = 0; j < product.options[i].options.length && !find; j++) {
                if (optionsSelect.get(`${product.id}_${product.options[i].group_name}`) === product.options[i].options[j].name) {
                    index = j;
                    find = true;
                    priceBoost += product.options[i].options[j].price
                }
            }
            key += `_${index}`
        }
        setAmount(typeof goodsAmount.get(key) !== 'undefined' ? goodsAmount.get(key) : 0)
        setPrice(typeof goodsAmount.get(key) !== 'undefined' ? (product.price + priceBoost) * goodsAmount.get(key) : 0)
        setOptionType(optionType + 1)
    }

    const onChange = (edit) => {
        let priceBoost = 0
        if (typeof product?.options !== "undefined" && product?.options.length > 0) {
            for (let i = 0; i < product.options.length; i++) {
                var find = false;
                for (let j = 0; j < product.options[i].options.length && !find; j++) {
                    if (optionsSelect.get(`${product.id}_${product.options[i].group_name}`) === product.options[i].options[j].name) {
                        find = true;
                        priceBoost += product.options[i].options[j].price
                    }
                }
            }
        }
        if (edit === '-') {
            if (amount > 0) {
                setPrice(price - product.price - priceBoost)
                setAmount(amount - 1)
            }
        } else {
            setPrice(price + product.price + priceBoost)            
            setAmount(amount + 1)
        }
    }

    const onExit = () => {
        if (typeof amount !== "undefined") {
            if (typeof product?.options !== "undefined" && product?.options.length > 0) {
                var key = `${product.id}`
                for (let i = 0; i < product.options.length; i++) {
                    var index = 0;
                    var find = false;
                    for (let j = 0; j < product.options[i].options.length && !find; j++) {
                        if (optionsSelect.get(`${product.id}_${product.options[i].group_name}`) === product.options[i].options[j].name) {
                            index = j;
                            find = true;
                        }
                    }
                    key += `_${index}`
                }
                if (amount === 0) {
                    if (goodsAmount.has(key)) {
                        goodsAmount.delete(key);
                    }
                } else {
                    goodsAmount.set(key, amount);
                }
            } else {
                if (amount === 0) {
                    if (goodsAmount.has(`${product.id}`)) {
                        goodsAmount.delete(`${product.id}`);
                    }
                } else {
                    goodsAmount.set(`${product.id}`, amount);
                }
            }
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
    if (typeof product?.options !== "undefined" && product?.options.length > 0) {
        for (let i = 0; i < product.options.length; i++) {
            if (!optionsSelect.has(`${product.id}_${product.options[i].group_name}`)) {
                // var selectedName = new Map()
                // selectedName.set(product.options[i].group_name, product.options[i].options[0].name)
                optionsSelect.set(`${product.id}_${product.options[i].group_name}`, product.options[i].options[0].name)
                optionPriceBoost += product.options[i].options[0].price
            } else {
                for (let j = 0; j < product.options[i].options.length; j++) {
                    if (optionsSelect.get(`${product.id}_${product.options[i].group_name}`) === product.options[i].options[j].name) {
                        optionPriceBoost += product.options[i].options[j].price
                    }
                }
            }
        }
    }
    var prodKey = `${product.id}`
    if (typeof product?.options !== "undefined" && product?.options.length > 0) {
        for (let i = 0; i < product.options.length; i++) {
            var index = 0;
            find = false;
            for (let j = 0; j < product.options[i].options.length && !find; j++) {
                if (optionsSelect.get(`${product.id}_${product.options[i].group_name}`) === product.options[i].options[j].name) {
                    index = j;
                    find = true;
                }
            }
            prodKey += `_${index}`
        }
    }
    const [amount, setAmount] = useState(goodsAmount.get(prodKey) ?? 0);
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
        if (typeof product?.options !== "undefined" && product?.options.length > 0) {
            return product.options.map(option => ( 
                <div className='prodBlock'>
                    <div className='prodOptions'>{option.group_name}</div>
                    <div className='radioButtons'>
                        {[...Array.from(option.options.values())].map(item => (
                            <div className='selectLine'>
                                <div className='optionButton'>
                                    <button className={`option${optionsSelect.get(`${product.id}_${option.group_name}`) === item.name ? 'active' : ''}`} onClick={() => changeType(option.group_name, item.name, item.price)}>
                                        <div className='promoLine'>
                                            {item.name}
                                            {item.price >= 0 ? (
                                                <span className='pricePoint'>+ {item.price} ₽</span>
                                            ) : (
                                                <span className='pricePoint'>- {item.price} ₽</span>
                                            )}                                            
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

        var response = await axios.get(`https://market-bot.org:8082/clients_api/clients_menu/get_reviews/${userInfo[0].bot_id}/?client_id=${userInfo[0].id}&product_id=${location.state.id}`)
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
            var response = await axios.post(`https://market-bot.org:8082/clients_api/reviews/delete_review/${userInfo[0].bot_id}/?client_id=${userInfo[0].id}&review_id=${reviewId}`)
            if (response.status === 200) {
                await getReviews();
            }
        } catch (e) {
            // console.log(e)
        }
        setAppState(response);
    }

    const like = async (id) => {
        let find = false;
        for (let i = 0; i < Object.keys(products).length && !find; i++) {
            if (products[i].id === id) {
                find = true;
                if (products[i].like) {
                    await removeToFav(id);
                } else {
                    await addToFav(id);
                }
                products[i].like = !products[i].like;
            }
        }
        // product.like = !product.like;
        //api method
        setProdState(prodState + 1)
    }

    async function addToFav(id) {
        try {
            var response = await axios.post(`https://market-bot.org:8082/clients_api/clients_menu/add_to_favorites/${userInfo[0].bot_id}/?product_id=${id}&client_id=${userInfo[0].id}`)
            // console.log(1)
            if (response.status === 200) {
            //   console.log(response)
            }
        } catch (e) {
            // console.log(e)
        }
    }

    async function removeToFav(id) {
        try {
            var response = await axios.delete(`https://market-bot.org:8082/clients_api/clients_menu/remove_from_favorites/${userInfo[0].bot_id}/?product_id=${id}&client_id=${userInfo[0].id}`)
            // console.log(1)
            if (response.status === 200) {
            //   console.log(response)
            }
        } catch (e) {
            // console.log(e)
        }
    }

    var getStickers = [];
    
    if (typeof stickerInfo !== 'undefined' && stickerInfo.size > 0 && stickerInfo.has(product.id)) {
        var stickers = stickerInfo.get(product.id);
        for (let i = 0; i < stickers.length; i++) {
            getStickers.push(stickerContent.get(stickers[i]));
        }
    }

    return (
        <div>
            <div className='otherHeader'>
                <Button className='cancelButton' onClick={() => navigate(-1)}><b className='cancel'>Назад</b></Button>
                {product.like ? (
                    <img className='likeIconInfo' src={like2} onClick={() => like(product.id)}></img>
                ) : (
                    <img className='likeIconInfo' src={like1} onClick={() => like(product.id)}></img>
                )}
            </div>
            {isLoading ? (
                <div className='loadScreen'>
                    <ReactLoading type="bubbles" color="#419FD9"
                        height={100} width={50} />
                </div>
            ) : (
                <div className={'product1 ' + location.state.className}>
                    <div className='bannerLine'>
                        {product.photoFile.map(item => (
                            <div className='scroll'>
                                <div className='bannerImg'>
                                    <img
		                        		src={item}
		                        		alt={product.name}
		                        		className='productIcon1'
		                        	/>
                                </div>
                            </div>
                        ))}
                    </div>
                    {typeof getStickers !== 'undefined' && getStickers.length > 0 ? (
                        <div className='bannerLine'>
                            {getStickers.map(item => (
                                <div className='scroll'>
                                    <div className='sticker' style={{background: item.background === 'light' ? 'linear-gradient(90deg, #FE5BD8 0%, #FD986A 100%)' : 'linear-gradient(90deg, #5B8CFE 0%, #6AF8FD 100%)'}}>
                                        <div className='stickerTextProd' style={{color: `#${item.color_text}`}}>{item.text}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div></div>
                    )}
                    <div className={'title1'}>{product.name}</div>
                    <div className='prodBlockPrice'>
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
                        {
                            typeof product.weight !== "undefined" ? (
                            <div className={'prodWeight'}><b>Вес:</b> {product.weight} гр</div>
                            ) : (
                                <div></div>
                            )
                        }
                    </div>
                    {/* <Variants /> */}
                    <Options />
                    {myReviews.length !== 0 ? (
                        <div>
                            <div className='reviewBlock1'>
                                <div className='reviewsLine'>
                                    <div className='reviews'>Мои отзывы</div>
                                </div>
                            {myReviews.map(item => (
                                <div className='reviewBlock2'>
                                    <div className='promoLine'>
                                        <div className='ratingAuthor'>{item.reviewer_name}</div>
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
                        </div>
                    ) : (
                        <div></div>
                    )}
                    {reviews.length !== 0 ? (
                        <div>
                            <div className='reviewBlock1'>
                                <div className='reviewsLine'>
                                    <div className='reviews'>Отзывы</div>
                                    <div className='allReviews' onClick={() => navigate('Reviews', { replace: false })}>Все ({reviews.length})</div>
                                </div>
                                <div className='promoLine'>
                                    <div className='ratingAuthor'>{reviews[0].reviewer_name}</div>
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
                    ) : (
                        myReviews.length !== 0 ? (
                            <div className='noReviews'>Других отзывов пока нет</div>
                        ) : (
                            <div className='noReviews'>Отзывов пока нет</div>
                        )
                    )}
                    <div className='additionalSpace'></div>
                    <footer>
                        <div className='prodLineAmount'>
                            <div className='addToCartButtonsProd'>
                                <button className='minus-cart-btn' onClick={() => onChange('-')}>–</button>
                                <div className='amountCart'>{amount}</div>
                                <button className='plus-cart-btn' onClick={() => onChange('+')}>+</button>
                            </div>
                            {
                                typeof product?.options !== "undefined" && product?.options.length > 0 ? (
                                    <button className='add-btn-prod' onClick={() => onExit()}><p className='toCart'>{price?.toFixed(2)} ₽</p></button>
                                ) : (
                                    <button className='add-btn-prod' onClick={() => onExit()}><p className='toCart'>{price?.toFixed(2)} ₽</p></button>
                                )
                            }
                        </div>
                    </footer>
                </div>
            )}
        </div>
    );
};

export default ProdInfo;