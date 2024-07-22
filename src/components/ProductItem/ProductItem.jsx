import React from 'react';
import './ProductItem.css'
import BurgerIcon from '../../assets/images/burger.png';
import { useNavigate } from 'react-router-dom';

const ProductItem = ({product, className, onAdd}) => {

    let navigate = useNavigate();

    const onAddHandler = () => {
        onAdd(product);
    }
    
    return (
        <div className={'product ' + className}>
            <div className='toInfo' onClick={() => navigate(`ProdInfo/${product.id}/${className}`, { replace: false, state: {id: product.id, className: className}})}>
                <div className={'img'}>
                    <img
			    		src={BurgerIcon}
			    		alt='burger'
			    		className='productIcon'
			    	/>
                </div>
                <div className={'title'}>{product.title}</div>
                <div className={'description'}>{product.description}</div>
                <div className={'oldPrice'}>{product.oldPrice}</div>
                <div className={'price'}>
                    {product.price}
                    <span className={'discount'}>
                        {typeof product.oldPrice === 'string' 
                        ? `-${Math.round((1 - parseFloat(product.price.substring(0, product.price.indexOf(' '))) / parseFloat(product.oldPrice.substring(0, product.oldPrice.indexOf(' ')))) * 100)}%` 
                        : ''}
                    </span>
                </div>
            </div>
            <button className={'add-btn'} onClick={onAddHandler}>
                <p className={'toCart'}>В корзину</p>
            </button>
        </div>
    );
};

export default ProductItem;