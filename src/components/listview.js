import React from 'react';

import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { Switch, Route, Redirect } from 'react-router-dom';

import {Navbar} from 'butter-base-components';
import {RouterMenu} from 'butter-component-menu';

import {ListContainer} from '../containers';
import  {
    relativePath,
    defaultToolbar
} from '../utils';

const ListView = ({tabs, path, history, location}) => {
    const menu = Object.entries(tabs).map(([key, value]) => ({
        title: value.name,
        path: `/list/${key}`
    }))
    const defaultPath = menu[0].path

    return [
        <Navbar key='main_nav'
                left={
                    <RouterMenu items={menu} location={location}/>
                }
                right = {defaultToolbar(history)}
        />,
        <div key={'/list'} location={location}>
            <TransitionGroup>
                <CSSTransition key={location.pathname} classNames="fade" timeout={300}>
                    <Switch location={location}>
                        {menu.map(({path}) => (
                            <Route path={path} key={path}
                                   component={ListContainer} />
                        ))}
                        <Redirect to={defaultPath} />
                    </Switch>
                </CSSTransition>
            </TransitionGroup>
        </div>
    ]
}

export {ListView as default}
