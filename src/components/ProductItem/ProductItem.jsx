import React from 'react';
import './ProductItem.css'
import { useNavigate } from 'react-router-dom';
import { goodsAmount } from '../Products/Products.jsx'
import { reviews, reviewsId } from '../TestData/prod.jsx';

const ProductItem = ({product, className, onAdd, changePrice, link}) => {

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
        if (product.options.length > 0) {
            return  <button className={'add-btn'} onClick={() => toInfo()}>
                        <p className={'toCart'}>В корзину</p>
                    </button>
        } else {
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
    }

    const toInfo = () => {
        while (reviews.length !== 0) {
            reviews.pop();
        }
        while (reviewsId.length !== 0) {
            reviewsId.pop();
        }
        navigate(link ? `ProdInfo/${product.id}/${className}` : `../../ProdInfo/${product.id}/${className}`, { replace: false, state: {id: product.id, className: className}})
    }
    
    return (
        <div className={'product ' + className}>
            <div className='toInfo' onClick={() => toInfo()}>
                <div className={'img'}>
                    <img
			    		src={product.photoFile}
			    		alt={product.name}
			    		className='productIcon'
			    	/>
                </div>
                <div className={'title'}>{product.name}</div>
                <div className={'description'}>{product.description}</div>
                {/* <div className={'oldPrice'}>{product.oldPrice}</div> */}
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