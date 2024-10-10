import React, { useState } from 'react'
import '../Feedback/Feedback.css'
import Button from '../Button/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { userInfo } from '../TestData/user.jsx';
import ReactLoading from "react-loading";

var prodMark = new Map()

const EditReview = () => {
    let navigate = useNavigate();

    const location = useLocation();

    let product = {};

    let review = {};

    const {products, myReviews} = require('../TestData/prod.jsx');

    const score = [
        {mark: 1},
        {mark: 2},
        {mark: 3},
        {mark: 4},
        {mark: 5},
    ];

    let find = false;
    for (let i = 0; i < Object.keys(products).length && !find; i++) {
        if (products[i].id === location.state.prodId) {
            product = products[i];
            find = true;
        }
    }

    find = false;
    for (let i = 0; i < Object.keys(myReviews).length && !find; i++) {
        if (myReviews[i].id === location.state.revId) {
            review = myReviews[i];
            find = true;
        }
    }

    const [appState, setAppState] = useState(0);
    const [activeButton, setActiveButton] = useState(review.rate - 1);

    const [isValidContent, setIsValidContent] = useState(true);

    const [isValidMark, setIsValidMark] = useState(true);

    const changeType = (mark, id) => {
        prodMark.set(id, mark)
        setActiveButton(mark)
    }
    
    function FeedbackHeader() {
        let navigate = useNavigate();
        return (
            <div className='feedbackHeader'>
                <Button className='cancelButton' onClick={() => navigate(-1)}><b className='cancel'>Назад</b></Button>
                <div className='feedbackHeaderName'>Изменить отзыв</div>
                <span />
            </div>
        )
    }

    function ProdCard({item}) {
        return (
            <div className='goodsFd'>
                <div className='goodsInnerFd'>
                    <img
                        src={item.photoFile[0]}
                        alt={item.name}
                        className='prodImg1'
                    />
                    <div className='prodText'>
                        <div className='prodName'>{item.name}</div>
                        <div className='prodName'>{item.price} ₽</div>
                    </div>
                </div>
                <div className='markLine'>
                    {score.map((mark, index) =>
                        <div className='deliveryButton'>
                            <button className={`mark${activeButton === index ? 'active' : ''}`} onClick={() => changeType(index, item.id)}>
                                {mark.mark}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const [isLoading, setIsLoading] = useState(false);

    const sendReview = async () => {
        var content = document.getElementById('content').value
        async function editReview() {
            var response = await axios.post(`https://market-bot.org:8082/clients_api/reviews/change_review/${userInfo[0].bot_id}/?client_id=${userInfo[0].id}&review_id=${location.state.revId}&content=${content}&rate=${prodMark.get(product.id) + 1}`)
            setAppState(response);
          }

          async function makeRequest() {
            if (document.getElementById('content').value.length < 200) {
                setIsValidContent(true);
                if (!prodMark.has(product.id)) {
                    setIsValidMark(false);
                } else {
                    setIsValidMark(true);
                    setIsLoading(true);
                    try {
                        await editReview();
                    } catch (e) {
                        // console.log(e)
                    }
                    setIsLoading(false);
                    navigate(-1)
                }
            } else {
                setIsValidContent(false);
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
                        <ProdCard item={product} />
                        {isValidMark ? (
                            <div></div>
                        ) : (
                            <div className='wrongPhone'>Необходимо выбрать оценку</div>
                        )}
                        <form className='payments'>
                            <div className='fieldHeader'>Отзыв</div>
                            <textarea className='textFieldExt' type="text" id='content' placeholder='Краткий отзыв по товару' defaultValue={review.content}></textarea>
                            {isValidContent ? (
                                <div></div>
                            ) : (
                                <div className='wrongPhone'>Отзыв должен содержать не более 200 символов</div>
                            )}
                        </form>
                    </div>
                    <footer>
                        <button className='cart-btn' onClick={() => sendReview()}>{'Готово'}</button>
                    </footer>
                </div>
            )}
            
        </div>
    )
}

export default EditReview;