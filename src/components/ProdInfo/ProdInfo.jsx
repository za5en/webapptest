import React, { useState } from 'react';
import './ProdInfo.css'
import {useLocation, useNavigate} from 'react-router-dom';
import OtherHeader from '../OtherHeader/OtherHeader.jsx';
import { goodsAmount } from '../Products/Products.jsx'

const ProdInfo = () => {

    let navigate = useNavigate();

    const {products} = require('../TestData/prod.jsx');
    
    const location = useLocation();

    let product = {};

    const [price, setPrice] = useState();
    let defPrice = 0;

    const [amount, setAmount] = useState();
    let defAmount = 1;

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
    
    return (
        <div>
            <OtherHeader />
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
            </div>
        </div>
    );
};

export default ProdInfo;