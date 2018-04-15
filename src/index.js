import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { HashRouter, Switch, Route, NavLink, Redirect } from 'react-router-dom';

import style from './styl/style.styl';
import {Window, Navbar, Menu, Toolbar} from 'butter-base-components';
import List from 'butter-component-list';
import {RouterMenu} from 'butter-component-menu';

import logo from './img/logo.png';

let imgs = [
    'https://farm1.staticflickr.com/751/22609797817_f2e2ff56eb_o_d.jpg',
    'https://farm6.staticflickr.com/5800/31223777911_7b960ddaae_k_d.jpg',
    'https://farm6.staticflickr.com/5512/31337144505_0d1b06879c_k_d.jpg'
]

let BackgroundImage = ({url, visible}) => (
    <div className={`${style.backdrop}`}
         style={{
             backgroundImage: `url(${url})`,
             opacity: visible ? 1 : 0,
             transition: `opacity 2s`
         }}>
    </div>)

class RotatingImages extends Component {
    constructor(props) {
        super(props)

        this.state = {
            idx: 0,
            show: 0,
            hide: -1 % props.imgs.length
        }
    }

    componentWillMount() {

        this.timer = setInterval(() => {
            this.setState((state, props) => ({
                hide: state.idx,
            }))

            setTimeout(() => (
                this.setState((state, props) => ({
                    idx: (state.idx + 1) % props.imgs.length
                }))
            ), this.props.switchTime*10)

            setTimeout(() => (
                this.setState((state, props) => ({
                    show: state.idx
                }))
            ), this.props.switchTime*200)
        }, this.props.switchTime*1000)
    }

    componentWillUnmount() {
        clearTimeout(this.timer)
    }

    render () {
        let {imgs, switchTime} = this.props;
        let {idx, hide, show} = this.state;
        let nextIdx = (idx + 1) % imgs.length;

        return ([
            <BackgroundImage key={idx} url={imgs[idx]} visible={idx !== hide} />,
            <BackgroundImage key={nextIdx} url={imgs[nextIdx]} visible={nextIdx === show} />
        ])
    }
}

RotatingImages.propTypes = {
    imgs: PropTypes.array.isRequired,
    switchTime: PropTypes.number.isRequired
}

RotatingImages.defaultProps = {
    switchTime: 100
}

let NinjaWindow = ({items, menu, ...props}) => (
    <Window
        bars={[
            <Navbar key='main_nav'
                         left={
                             <RouterMenu items={menu}/>
                         }
                         right = {
                             <Toolbar search={true}/>
                         }
            />
        ]}
        title={<img src={logo} style={{
            height: '50px',
            marginTop: '40px'
        }}/>}>
        <Switch>
            {menu.map((e) => (
                <Route path={e.path} render={() => (<List items={items[e.path]} />)} />
            ))}
        </Switch>
    </Window>
)

let ButterNinja = (props) => (
    <div>
        <RotatingImages imgs={imgs}/>
        <NinjaWindow {...props} />
    </div>
)

let RoutedNinja = (props) => (
    <HashRouter>
        <Switch>
            <Route exact path='/' render={() => (<Redirect to={props.menu[0].path}/>)} />
            <Route path='/list' render={() => (<ButterNinja {...props}/>)} />
        </Switch>
    </HashRouter>
)

export default RoutedNinja;
