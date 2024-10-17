import React, { Component, useEffect } from 'react'
import Button from '../Button/Button';
import { useTelegram } from '../../hooks/useTelegram';
import './Header.css'
import search from "../../assets/icons/search.svg"
import { useNavigate } from 'react-router-dom';
import { products, categories, catNames } from '../TestData/prod.jsx';
import eruda from 'eruda';
import settings from "../../assets/icons/settings.svg"

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
        if (typeof select !== 'undefined') {
            getElement.scrollIntoView({behavior: "smooth"});
        }
    }

    render() {
        let buttons = [];
        let button;
        for (let i = 0; i < this.categories?.length ?? 0; i++) {
            if (this.state.selected === this.categories[i]) {
                button = <div className='scroll-selected'>
                            <span onClick={() => this.onMove(this.categories[i])}>{typeof this.categories[i] !== "undefined" ? this.categories[i] : 'Без категории'}</span>
                        </div>
            } else {
                button = <div className='scroll'>
                            <span onClick={() => this.onSelectChange(this.categories[i])}>{typeof this.categories[i] !== "undefined" ? this.categories[i] : 'Без категории'}</span>
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

    let productsByCat = new Map();
    var cats = [];
    cats = categories;
    for (let i = 0; i < cats.length; i++) {
        productsByCat.set(cats[i], []);
        // hiddenCats.set(cats[i], 0);
    }
    for (let i = 0; i < Object.keys(products).length; i++) {
      if (products[i].category_name === null) {
          products[i].category_name = 'Без категории'
      }
      let currentProd = productsByCat.get(products[i].category_name);
      if (typeof currentProd != 'undefined' && typeof products[i] != 'undefined') {
          currentProd.push(products[i]);
      }
      productsByCat.set(products[i].category_name, currentProd);
      // if (currentProd.it_hidden) {
      //     let hidden = hiddenCats.get(products[i].categories);
      //     hiddenCats.set(products[i].categories, hidden + 1);
      // }
    }  
    var values = catNames.values()
    for (let i = 0; i < catNames.size; i++) {
        var val = values.next().value
        if (typeof productsByCat.get(val) !== 'undefined') {
            if (productsByCat.get(val).length === 0) {
                productsByCat.delete(val);
                var index = cats.indexOf(val);
                if (index > -1) {
                    cats.splice(index, 1);
                }
            }
        }
    }

    useEffect(() => {
        eruda.init();
    })

    return (
        <div className='header'>
            <div className='firstLine'>
                <Button className='cancelButton' onClick={onClose}><b className='cancel'>Закрыть</b></Button>
                <button className='menuButton' onClick={() => navigate('Profile', { replace: false })}>
                    {/* <img src={user?.photo_url ?? Avatar} className='menuIcon' /> */}
                    <span className='username'>
                        {user?.first_name ?? 'Username'}
                    </span>
                </button>
            </div>
            <div className='searchLine'>
                <img className='searchIcon' src={search}></img>
                <input className='searchField' type="text" id='search' onFocus={() => navigate('Search', { replace: false })} placeholder='Поиск товаров'></input>
            </div>
            {
                cats.length > 0 ? (
                    <HeaderComponent categories={cats} />
                ) : (
                    <div></div>
                )
            }
        </div>
    )
}

export default Header;