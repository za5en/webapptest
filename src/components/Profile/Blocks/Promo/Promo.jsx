import React from 'react'
import '../Blocks.css'
import OtherHeader from '../../../OtherHeader/OtherHeader';

const Promo = () => {

    return (
        <div>
            <OtherHeader />
            <div className='blocks'>
                <p className='name'>Акции</p>
                <div className='null'>Акций пока нет</div>
            </div>
        </div>
    )
}

export default Promo;