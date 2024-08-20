import React, { useState } from 'react';
import OtherHeader from '../OtherHeader/OtherHeader.jsx';
import ReactLoading from "react-loading";

const Reviews = () => {
    const {reviews} = require('../TestData/prod.jsx');
    const [isLoading, setIsLoading] = useState(false);
    return (
        <div>
            <OtherHeader />
            {isLoading ? (
                <div className='loadScreen'>
                    <ReactLoading type="bubbles" color="#419FD9"
                        height={100} width={50} />
                </div>
            ) : (
                <div className='product1'>
                    <div className='user'>
                        <div className='name'>Отзывы</div>
                    </div>
                    {reviews.map(item => {
                        return <div>
                            <div className='reviewBlock'>
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
                            </div>
                        </div>
                    })}
                </div>
            )}
        </div>
    );
};

export default Reviews;