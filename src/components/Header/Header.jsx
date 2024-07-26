import React, { Component } from 'react'
import Button from '../Button/Button';
import { useTelegram } from '../../hooks/useTelegram';
import './Header.css'
import Avatar from '../../assets/icons/avatar.svg';
import { useNavigate } from 'react-router-dom';

class HeaderComponent extends Component {
    constructor(props) {
        super(props);
        this.categories = props.categories;
        this.state = {
            selected: props.categories[0],
        }
    }
      
    onSelectChange = (select) => {
        this.onMove(select);
        this.setState({selected: select});
    }

    onMove = (select) => {
        const getElement = document.getElementById(select);
        getElement.scrollIntoView({behavior: "smooth"});
    }

    render() {
        let buttons = [];
        let button;
        for (let i = 0; i < this.categories?.length ?? 0; i++) {
            if (this.state.selected === this.categories[i]) {
                button= <div className='scroll-selected'>
                            <span onClick={() => this.onMove(this.categories[i])}>{this.categories[i]}</span>
                        </div>
            } else {
                button= <div className='scroll'>
                            <span onClick={() => this.onSelectChange(this.categories[i])}>{this.categories[i]}</span>
                        </div>
            }
            buttons.push(button)
        }
        return <div className='secondLine'>{buttons}</div>
    }
}

const Header = () => {
    const {user, onClose} = useTelegram(); 
    let navigate = useNavigate();
    const {categories} = require('../TestData/prod.jsx');

    // let selected = categories[0]

    // const onClick = (id) => {
    //     const getElement = document.getElementById(id);
    //     getElement.scrollIntoView({behavior: "smooth"});
    //     selected = id;
    //     console.log(selected);
    // }

    return (
        <div className='header'>
            <div className='firstLine'>
                <Button className='cancelButton' onClick={onClose}><b className='cancel'>Закрыть</b></Button>
                <button className='menuButton' onClick={() => navigate('Profile', { replace: false })}>
                    <img src={user?.photo_url ?? Avatar} className='menuIcon' />
                    <span className='username'>
                        {user?.username ?? 'Username'}
                    </span>
                </button>
            </div>
            <HeaderComponent categories={categories} />
        </div>
    )
}

export default Header;