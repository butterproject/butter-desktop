import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { HashRouter, Switch, Route, NavLink, Redirect } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group'

require('./style.css')

import style from './styl/style.styl';
import {Window, Navbar, Menu, Toolbar} from 'butter-base-components';

import ButterSettings from 'butter-component-settings';
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

let relativePath = (location, path) => {
    let basepath = location.pathname.split('/').slice(0, -1).join('/')
    return `${basepath}/${path}`
}

let ListAndMenu = ({items, menu, path, history, location}) => ([
    <Navbar key='main_nav'
            left={
                <RouterMenu items={menu.map((c) => ({
                        path: relativePath(location, c),
                        title: c
                }))} location={location}/>
            }
            right = {
                <Toolbar search={true} buttons={[
                    {title: "settings", icon:"settings", action: () => (history.push('/settings'))}
                ]}/>
            }
    />,
    <div location={location}>
        {menu.map((path) => (<Route path={relativePath(location, path)} key={path} render={() => (
            <List key={path} items={items[path]} />
        )} />))}
        <Route render={() => (<Redirect to={`/list/${menu[0]}`} />)} />
    </div>
])

let NinjaWindow = ({settings, ...props}) => (
    <Window
        title={<img src={logo} style={{
            height: '50px',
            marginTop: '40px'
        }}/>}>
        <Switch>
            <Route path='/settings' render={() => (<ButterSettings {...settings} location={props.location} navbar={{goBack: () => (props.history.push('/'))}}/>)} />
            <Route path='/list' render={() => (<ListAndMenu menu={Object.keys(props.items)} {...props}/>)} />
            <Route render={() => (<Redirect to='/list' />)} />
        </Switch>
    </Window>)

let ButterNinja = (props) => (
    <div>
        <RotatingImages imgs={imgs}/>
        <NinjaWindow {...props} />
    </div>
)

let RoutedNinja = (props) => (
    <HashRouter>
        <Route render={(routeProps) => (
            <ButterNinja {...props} {...routeProps}/>
        )} />
    </HashRouter>
)

export default RoutedNinja;
