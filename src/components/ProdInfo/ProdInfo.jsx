import React from 'react';
import './ProdInfo.css'
import BurgerIcon from '../../assets/images/burger.png';
import {useLocation} from 'react-router-dom';
import OtherHeader from '../OtherHeader/OtherHeader.jsx';

const ProdInfo = () => {

    const {products} = require('../TestData/prod.jsx');
    
    const location = useLocation();

    let product = {};

    // const onAddHandler = () => {
    //     location.onAdd(location.product);
    // }

    let find = false;
    for (let i = 0; i < Object.keys(products).length && !find; i++) {
        if (products[i].id == location.state.id) {
            product = products[i];
            find = true;
        }
    }
    
    return (
        <div>
            <OtherHeader />
            <div className={'product1 ' + location.state.className}>
                <div>
                    <img
			    		src={BurgerIcon}
			    		alt='burger'
			    		className='productIcon1'
			    	/>
                </div>
                <div className={'title1'}>{product.title}</div>
                <div className={'price1'}>
                    {product.price}
                </div>
                <div>
                    <span className={'oldPrice1'}>
                        {product.oldPrice}
                    </span>
                    <span className={'discount1'}>
                        {typeof product.oldPrice === 'string' 
                        ? `-${Math.round((1 - parseFloat(product.price.substring(0, product.price.indexOf(' '))) / parseFloat(product.oldPrice.substring(0, product.oldPrice.indexOf(' ')))) * 100)}%` 
                        : ''}
                    </span>
                </div>
                <div className={'description1'}>{product.description}</div>
            </div>
        </div>
    );
};

export default ProdInfo;