import React, { useState } from 'react';
import './BannerPage.css'
import {useLocation} from 'react-router-dom';
import OtherHeader from '../OtherHeader/OtherHeader.jsx';
import { goodsAmount } from '../Products/Products.jsx';
import BurgerIcon from '../../assets/images/burger.png';
import ProductItem from '../ProductItem/ProductItem.jsx';

const BannerPage = () => {
    const {products, banners} = require('../TestData/prod.jsx');
    
    const location = useLocation();

    let banner = {};

    let goods = [];

    let newItems = [];

    let nullPrice = 0;

    const [addedItems, setAddedItems] = useState([]);

    const [price, setPrice] = useState();

    let find = false;
    for (let i = 0; i < Object.keys(banners).length && !find; i++) {
        if (banners[i].id === location.state.id) {
            banner = banners[i];
            find = true;
        }
    }

    if (typeof banner.goods !== "undefined") {
        for (let i = 0; i < banner.goods.length; i++) {
            find = false;
            for (let j = 0; j < Object.keys(products).length && !find; j++) {
                if (products[j].id === banner.goods[i]) {
                    goods.push(products[j]);
                    find = true;
                }
            }
        }
    }

    const onAdd = (product) => {
        let added = addedItems.find(item => item.id === product.id);

        let addPrice = price ?? nullPrice;

        if (added) {
            newItems = addedItems;
            addPrice += product.price;
        } else {
            newItems = [...addedItems, product];
            addPrice += product.price;
            goodsAmount.set(product.id, 1);
        }

        setPrice(addPrice)
        setAddedItems(newItems)
    }

    const changePrice = (edit, prodPrice) => {
        if (edit === '+') {
            if (typeof price === "undefined" && nullPrice != 0) {
                setPrice(nullPrice + Number(prodPrice));
            } else {
                setPrice(price + Number(prodPrice));
            }
        } else {
            if (typeof price === "undefined" && nullPrice != 0) {
                if (nullPrice - Number(prodPrice) >= 0) { 
                    setPrice(nullPrice - Number(prodPrice));
                } else {
                    setPrice(0);
                }
            } else {
                if (price - Number(prodPrice) >= 0) { 
                    setPrice(price - Number(prodPrice));
                } else {
                    setPrice(0);
                }
            }
        }
    }
    
    return (
        <div>
            <OtherHeader />
            <div className='bannerPage'>
                <div>
                    <img
			    		src={BurgerIcon} //banner.image
			    		alt={banner.header}
			    		className='productIcon1'
			    	/>
                </div>
                <div className='prodBlock'>
                    <div className={'title1'}>{banner.header}</div>
                    <div className={'descriptionBanner'}>{banner.description}</div>
                </div>
                <div className='list'>
                    <div className='cat'>
                        {goods.map(item => (
                            item.it_hidden ? (
                                <div></div>
                            ) : (
                                <ProductItem
                                    product={item}
                                    onAdd={onAdd}
                                    className={'item'}
                                    changePrice={changePrice}
                                    link={false}
                                />
                            )
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BannerPage;