import React, { useState } from 'react';
import './ProductItem.css'
import { useNavigate } from 'react-router-dom';
import { goodsAmount } from '../Products/Products.jsx'
import { reviews, reviewsId, stickerContent, stickerInfo } from '../TestData/prod.jsx';
import like1 from "../../assets/icons/non_like.svg"
import like2 from "../../assets/icons/like.svg"
import axios from 'axios';
import { userInfo } from '../TestData/user.jsx';

const ProductItem = ({ product, className, onAdd, changePrice, link }) => {

    let navigate = useNavigate();

    const [prodState, setProdState] = useState(0);

    const { products } = require('../TestData/prod.jsx');

    const onAddHandler = () => {
        onAdd(product);
        goodsAmount.set(`${product.id}`, 1);
    }

    const changePriceHandler = (editType) => {
        changePrice(editType, product.price);
    }

    const onChange = (edit) => {
        if (edit === '-') {
            if (goodsAmount.has(`${product.id}`)) {
                changePriceHandler(edit);
                if (goodsAmount.get(`${product.id}`) == 1) {
                    goodsAmount.delete(`${product.id}`);
                }
                else {
                    goodsAmount.set(`${product.id}`, goodsAmount.get(`${product.id}`) - 1)
                }
            }
        } else {
            if (goodsAmount.has(`${product.id}`)) {
                changePriceHandler(edit);
                goodsAmount.set(`${product.id}`, goodsAmount.get(`${product.id}`) + 1)
            } else {
                changePriceHandler(edit);
                goodsAmount.set(`${product.id}`, 2)
            }
        }
    }

    function Button() {
        if (typeof product?.options !== "undefined" && product?.options.length > 0) {
            return <button className={'add-btn'} onClick={() => toInfo()}>
                <p className={'toCart'}>Добавить в корзину</p>
            </button>
        } else {
            if (!goodsAmount.has(`${product.id}`)) {
                return <button className={'add-btn'} onClick={onAddHandler}>
                    <p className={'toCart'}>Добавить в корзину</p>
                </button>
            } else {
                return <div className='addToCartButtons'>
                    <button className='minus-cart-btn' onClick={() => onChange('-')}>–</button>
                    <div className='amountCart'>{goodsAmount.get(`${product.id}`) ?? 1} шт</div>
                    <button className='plus-cart-btn' onClick={() => onChange('+')}>+</button>
                </div>
            }
        }
    }

    const toInfo = () => {
        while (reviews.length !== 0) {
            reviews.pop();
        }
        while (reviewsId.length !== 0) {
            reviewsId.pop();
        }
        navigate(link !== 3 ?
            link === 1 ?
                `ProdInfo/${product.id}/${className}`
                : `../../ProdInfo/${product.id}/${className}`
            : `../../../ProdInfo/${product.id}/${className}`, { replace: false, state: { id: product.id, className: className } })
    }

    const like = async (id) => {
        let find = false;
        for (let i = 0; i < Object.keys(products).length && !find; i++) {
            if (products[i].id === id) {
                find = true;
                if (products[i].like) {
                    await removeFromFav(id);
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

    async function removeFromFav(id) {
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
        <div className={'product ' + className}>
            <div className='toInfo'>
                <div className='img'>
                    {typeof product.photoFile !== 'undefined' ? (
                        <img
                        src={product.photoFile[0]}
                        alt={product.name}
                        className='productIcon'
                        onClick={() => toInfo()}
                    />
                    ) : (
                        <div></div>
                    )}                    
                    {product.like ? (
                        <img className='likeIcon' src={like2} onClick={() => like(product.id)}></img>
                    ) : (
                        <img className='likeIcon' src={like1} onClick={() => like(product.id)}></img>
                    )}
                    {typeof getStickers !== 'undefined' && getStickers.length > 0 ? (
                        getStickers.map((item, index) => (
                            <div className={`sticker${index}`} style={{background: item.background === 'light' ? 'linear-gradient(90deg, #FE5BD8 0%, #FD986A 100%)' : 'linear-gradient(90deg, #5B8CFE 0%, #6AF8FD 100%)'}}>
                                <div className='stickerText' style={{color: `#${item.color_text}`}}>{item.text}</div>
                            </div>
                        ))
                    ) : (
                        <div></div>
                    )}
                </div>
                <div className='title' onClick={() => toInfo()}>{product.name}</div>
                <div className='description' onClick={() => toInfo()}>{product.description}</div>
                {/* <div className={'oldPrice'}>{product.oldPrice}</div> */}
                <div className='promoLine' onClick={() => toInfo()}>
                    <div className='price'>
                        {product.price} ₽
                        {/* <span className='discount'>
                            {typeof product.oldPrice === 'string' 
                            ? `-${Math.round((1 - product.price) / product.oldPrice * 100)}%` 
                            : ''}
                        </span> */}
                    </div>
                </div>
            </div>
            <Button />
        </div>
    );
};

export default ProductItem;