import React, { useState } from 'react'
import './Feedback.css'
import Button from '../Button/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { userInfo } from '../TestData/user.jsx';
import { product } from '../Profile/OrderPage/OrderPage.jsx';
import ReactLoading from "react-loading";

const Feedback = () => {
    let navigate = useNavigate();

    var goodsMarks = new Map()

    const score = [
        {mark: 1},
        {mark: 2},
        {mark: 3},
        {mark: 4},
        {mark: 5},
    ];

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
                    src={item.photoFile}
                    alt={item.name}
                    className='prodImg1'
                />
                <div className='prodText'>
                    <div className='prodName'>{item.name}</div>
                    <div className='prodName'>{item.price} ₽</div>
                    {/* <div className='prodParam'>{item.weight} гр</div> */}
                    {/* <div className='prodParam'>{item.order_quantity} шт.</div> */}
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

    const sendFeedback = async () => {
        var content = document.getElementById('content').value
        async function createReview() {
            var response  = await axios.post(`https://market-bot.org:8082/clients_api/reviews/create_review/?bot_id=${userInfo[0].bot_id}&client_id=${userInfo[0].id}&product_id=${product.id}&content=${content}&rate=${score[activeButton].mark}`)
            setAppState(response);
          }

          async function makeRequest() {
            setIsLoading(true);
            await createReview();
            setIsLoading(false);
          }
      
        await makeRequest()
        navigate(-2)
    }
    
    return (
        <div> 
            {isLoading ? (
                <div className='loadScreen'>
                    <ReactLoading type="bubbles" color="#419FD9"
                        height={100} width={50} />
                </div>
            ) : (
                <div>
                    <FeedbackHeader />
                    <div className='cart'>
                        <ProdCard item={product} />
                        <form className='payments'>
                            <div className='fieldHeader'>Отзыв</div>
                            <textarea className='textFieldExt' type="text" id='content' placeholder='Краткий отзыв по товару'></textarea>
                        </form>
                    </div>
                    <footer>
                        <button className='cart-btn' onClick={() => sendFeedback()}>{'Готово'}</button>
                    </footer>
                </div>
            )}
            
        </div>
    )
}

export default Feedback;