import React, { useState } from 'react';
import './ProductItem.css'
import BurgerIcon from '../../assets/images/burger.png';
import { useNavigate } from 'react-router-dom';
import { goodsAmount } from '../Products/Products.jsx'

const ProductItem = ({product, className, onAdd, changePrice}) => {

    let navigate = useNavigate();

    const onAddHandler = () => {
        onAdd(product);
        goodsAmount.set(product.id, 1);
    }

    const changePriceHandler = (editType) => {
        changePrice(editType, product.price);
    }

    const onChange = (edit) => {
        if (edit === '-') {
            if (goodsAmount.has(product.id)) {
                changePriceHandler(edit);
                if (goodsAmount.get(product.id) == 1) {
                    goodsAmount.delete(product.id);
                }
                else {
                    goodsAmount.set(product.id, goodsAmount.get(product.id) - 1)
                }
            }
        } else {
            if (goodsAmount.has(product.id)) {
                changePriceHandler(edit);
                goodsAmount.set(product.id, goodsAmount.get(product.id) + 1)
            } else {                
                changePriceHandler(edit);
                goodsAmount.set(product.id, 2)
            }
        }
    }

    function Button() {
        if (!goodsAmount.has(product.id)) {
            return  <button className={'add-btn'} onClick={onAddHandler}>
                        <p className={'toCart'}>В корзину</p>
                    </button>
        } else {
            return  <div className='addToCartButtons'>
                        <button className='minus-cart-btn' onClick={() => onChange('-')}>-</button>
                        <div className='amountCart'>{goodsAmount.get(product.id) ?? 1}</div>
                        <button className='plus-cart-btn' onClick={() => onChange('+')}>+</button>
                    </div>
        }
    }
    
    return (
        <div className={'product ' + className}>
            <div className='toInfo' onClick={() => navigate(`ProdInfo/${product.id}/${className}`, { replace: false, state: {id: product.id, className: className}})}>
                <div className={'img'}>
                    <img
			    		src={product.photoFile}
			    		alt={product.name}
			    		className='productIcon'
			    	/>
                </div>
                <div className={'title'}>{product.name}</div>
                <div className={'description'}>{product.description}</div>
                <div className={'oldPrice'}>{product.oldPrice}</div>
                <div className={'price'}>
                    {product.price} ₽
                    <span className={'discount'}>
                        {typeof product.oldPrice === 'string' 
                        ? `-${Math.round((1 - product.price) / product.oldPrice * 100)}%` 
                        : ''}
                    </span>
                </div>
            </div>
            <Button />
        </div>
    );
};

export default ProductItem;