import React, { useState } from 'react'
import './Feedback.css'
import Button from '../Button/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { userInfo } from '../TestData/user.jsx';
import ReactLoading from "react-loading";
import { goodsOrder } from '../Profile/OrderCard/OrderCard.jsx';
import { config } from '../../api.js';
import ProdService from '../../services/ProdService.js';

var goodsMarks = new Map()

export var goodsReviews = new Map()

const Feedback = () => {
    let navigate = useNavigate();

    const score = [
        {mark: 1},
        {mark: 2},
        {mark: 3},
        {mark: 4},
        {mark: 5},
    ];

    const [appState, setAppState] = useState(0);

    const [isValidContent, setIsValidContent] = useState(true);

    const [isValidMark, setIsValidMark] = useState(true);

    const changeType = (mark, id) => {
        var state = appState + 1;
        goodsMarks.set(id, mark)
        setAppState(state)
    }

    const addString = (id, str) => {
        goodsReviews.set(id, str);
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

    function MarksLine({id}) {
        return (
            <div className='markLine'>
                {score.map((mark, index) =>
                    <div className='deliveryButton'>
                        <button className={`mark${goodsMarks.get(id) === index ? 'active' : ''}`} onClick={() => changeType(index, id)}>
                            {mark.mark}
                        </button>
                    </div>
                )}
            </div>
        )
    }

    function ProdCard({item}) {
        var element = document.getElementById('content' + item.product_id);
        var str = ''
        if (element != null) {
            str = element.value;
        }
        return (
            <div className='goodsFd'>
                {item.product !== null ? (
                <div>
                    <div className='goodsInnerFd'>
                        <img
                            src={item.photoFile[0]}
                            alt={item.product.name}
                            className='prodImg1'
                        />
                        <div className='prodText'>
                            <div className='prodName'>{item.product.name}</div>
                            <div className='prodName'>{item.price} ₽</div>
                            {/* <div className='prodParam'>{item.weight} гр</div> */}
                            {/* <div className='prodParam'>{item.order_quantity} шт.</div> */}
                        </div>
                    </div>
                    <MarksLine id={item.product_id} />
                    <form className='feedbackReview'>
                        <div className='fieldHeader'>Отзыв</div>
                        <textarea className='textFieldExt' type="text" id={'content' + item.product_id} placeholder='Краткий отзыв по товару' onChange={str !== '' ? addString(item.product_id, str) : null} defaultValue={goodsReviews.get(item.product_id)}></textarea>
                        {isValidContent ? (
                            <div></div>
                        ) : (
                            <div className='wrongPhone'>Отзыв должен содержать не более 200 символов</div>
                        )}
                    </form>
                </div>
                ) : (
                    <div></div>
                )
                }
            </div>
        );
    }

    const [isLoading, setIsLoading] = useState(false);

    const sendFeedback = async () => {
        async function createReview() {
            for (let i = 0; i < goodsOrder.length; i++) {
                goodsReviews.set(goodsOrder[i].product_id, document.getElementById('content' + goodsOrder[i].product_id).value)
            }
            for (let i = 0; i < goodsOrder.length; i++) {
                if (goodsReviews.get(goodsOrder[i].product_id).length < 200) {
                    setIsValidContent(true);
                    await ProdService.createReview(goodsOrder[i].product_id, goodsReviews.get(goodsOrder[i].product_id), goodsMarks.get(goodsOrder[i].product_id) + 1)
                } else {
                    setIsValidContent(false);
                }
            }
          }

          async function makeRequest() {
            let find = false;
            for (let i = 0; i < goodsOrder.length && !find; i++) {
                if (!goodsMarks.has(goodsOrder[i].product_id)) {
                    find = true;
                }
            }
            if (find) {
                setIsValidMark(false);
            } else {
                setIsValidMark(true);
                setIsLoading(true);
                try {
                    await createReview();
                    setAppState(appState + 1);
                } catch (e) {
                    // console.log(e)
                }
                setIsLoading(false);
                navigate(-2)
            }
          }
        
        await makeRequest()
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
                        {goodsOrder.map(prod => (
                            <ProdCard item={prod} />
                        ))}
                        {isValidMark ? (
                            <div></div>
                        ) : (
                            <div className='wrongPhone'>Необходимо установить оценки для всех продуктов</div>
                        )}
                    </div>
                    <div className='lowerPadding'></div>
                    <footer>
                        <button className='cart-btn' onClick={() => sendFeedback()}>{'Готово'}</button>
                    </footer>
                </div>
            )}
            
        </div>
    )
}

export default Feedback;