import React, { useEffect, useState } from 'react'
import './Feedback.css'
import BurgerIcon from '../../assets/images/burger.png';
import Button from '../Button/Button';
import { useNavigate } from 'react-router-dom';
import { goodsAmount } from '../Products/Products';
import { useTelegram } from '../../hooks/useTelegram.js';
import axios from 'axios';

const Feedback = () => {
    const {onClose} = useTelegram(); 
    let goods = []
    let price = 0

    var goodsMarks = new Map()

    const {products} = require('../TestData/prod.jsx');

    const score = [
        {mark: 1},
        {mark: 2},
        {mark: 3},
        {mark: 4},
        {mark: 5},
    ];

    let find = false;
    for (let i = 0; i < Object.keys(products).length && !find; i++) {
        if (goodsAmount.has(products[i].id)) {
            goods.push(products[i])
            price += products[i].price * goodsAmount.get(products[i].id)
        }
    }

    const [activeButton, setActiveButton] = useState(0);

    const changeType = (mark, id) => {
        setActiveButton(mark)
        goodsMarks.set(id, mark)
    }
    
    function FeedbackHeader() {
        let navigate = useNavigate();
        return (
            <div className='feedbackHeader'>
                <Button className='cancelButton' onClick={() => navigate(-1)}><b className='cancel'>Назад</b></Button>
                <div className='feedbackHeaderName'>Оценить заказ</div>
                <span />
            </div>
        )
    }

    function ProdCard({item}) {
        return (
            <div className='goods'>
                <img
                    src={BurgerIcon}
                    alt='burger'
                    className='prodImgFd'
                />
                <div className='prodText'>
                    <div className='firstFdLine'>
                        <div className='orderNum'>{'Бургер'}</div>
                        <div className='orderCost'>{'99'} ₽</div>
                    </div>
                    <div className='prodParam'>{'250'} гр</div>
                    <div className='prodParam'>{'2'} шт.</div>
                    <div className='deliveryLine'>
                        {score.map((mark, index) =>
                            <div className='deliveryButton'>
                                <button className={`mark${activeButton === index ? 'active' : ''}`} label={activeButton === index ? 'ACTIVE' : 'inactive'} onClick={() => changeType(index, item.id)}>
                                    {mark.mark}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const [appState, setAppState] = useState();
    const [isLoading, setIsLoading] = useState(false);

    // useEffect(() => {

    // }, [setAppState]);

    const sendFeedback = async () => {
        async function createReview() {
            var response  = await axios.post(`https://market-bot.org:8082/clients_api/reviews/create_review/?bot_id=${botId}&client_id=${clientId}&product_id=${prodId}&content=${content}&rate=${rate}&photo=${photo}`)
            console.log(response.data)
            setAppState(response);
          }
      
          async function clientsOrders() {
            var response = await axios.post(`https://market-bot.org:8082/clients_api/clients_orders/get_orders?bot_id=${userInfo[0].bot_id}&client_id=${userInfo[0].id}`)
            console.log(response.data)
            setAppState(response);
          }
      
          async function makeRequest() {
            setIsLoading(true);
            await createReview();
            await clientsOrders();
            setIsLoading(false);
          }
      
        await makeRequest()
        onClose;
    }
    
    return (
        <div>
            <FeedbackHeader />
            <div className='cart'>
                {goods.map(item => (
                    <ProdCard
                        item={item} 
                    />
                ))}
                <form className='payments'>
                    <div className='fieldHeader'>Отзыв</div>
                    <textarea className='textFieldExt' type="text" placeholder='Краткий отзыв по заказу'></textarea>
                </form>
            </div>
            <footer>
                <button className='cart-btn' onClick={() => sendFeedback()}>{'Готово'}</button>
            </footer>
        </div>
    )
}

export default Feedback;