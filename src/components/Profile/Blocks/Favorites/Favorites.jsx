import React from 'react'
import '../Blocks.css'
import OtherHeader from '../../../OtherHeader/OtherHeader';
import { useNavigate } from 'react-router-dom';
import ProductItem from '../../../ProductItem/ProductItem.jsx';

const Favorites = () => {
    let navigate = useNavigate();

    let favorites = []

    const {products} = require('../../../TestData/prod.jsx');

    const onAdd = (product) => {
        const added = addedItems.find(item => item.id === product.id);

        if (added) {
            newItems = Object.values(added).filter(item => item.id !== product.id);
            price[0] += parseFloat(product.price.substring(0, product.price.indexOf(' ')))
        } else {
            newItems = [...addedItems, product];
            price[0] += parseFloat(product.price.substring(0, product.price.indexOf(' ')))
        }

        setAddedItems(newItems)

        if (newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)}`
            })
        }
    }

    function FavList() {
        if (favorites.length !== 0) {
            return  <div className='list'>
                        <div className='cat'>
                        {products.map(item => (
                            <ProductItem 
                                product={item}
                                onAdd={onAdd}
                                className={'item'}
                            />
                        ))}
                        </div>
                    </div>
        } else {
            return  <div>
                    <div className='nullEdited'>Избранных товаров пока нет</div>
                    <button className='shop-btn' onClick={() => navigate(-2)}>К списку товаров</button>
                    </div>
        }
    }

    return (
        <div>
            <OtherHeader />
            <div className='blocks'>
                <p className='name'>Избранное</p>
                <FavList />
            </div>
        </div>
    )
}

export default Favorites;