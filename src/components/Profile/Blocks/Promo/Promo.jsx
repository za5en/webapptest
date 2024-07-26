import React from 'react'
import './Promo.css'
import OtherHeader from '../../../OtherHeader/OtherHeader';

const Promo = () => {
    let promo = []

    function CopyText() {
        var range = document.createRange();
        range.selectNode(document.getElementById("promo-btn"));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand("copy");
        window.getSelection().removeAllRanges();

        alert('Промокод скопирован');
    }

    function PromoCard() {
        if (promo.length !== 0) {
            return  <div className='promoCard'>
                        <div className='firstOrderLine'>
                            <div className='promoName'>{'Персональная скидка!'}</div>
                        </div>
                        <div className='orderDate'>{'Скидка -15% на первый заказ'}</div>
                        <div className='lastPromoLine'>
                            <div className='promo-btn' id='promo-btn' onClick={CopyText}>{'xxxxx-12345-XXXXX-67890'}</div>
                        </div>
                    </div>
        } else {
            return  <div>
                        <p className='name'>Акции</p>
                        <div className='nullEdited'>Акций пока нет</div>
                    </div>
        }
    }

    return (
        <div>
            <OtherHeader />
            <div className='blocks'>
                <PromoCard />
            </div>
        </div>
    )
}

export default Promo;