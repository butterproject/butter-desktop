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

const ListView = ({items, menu, path, history, location}) => ([
    <Navbar key='main_nav'
            left={
                <RouterMenu items={menu.map((c) => ({
                        path: relativePath(location, c),
                        title: c
                }))} location={location}/>
            }
            right = {defaultToolbar(history)}
    />,
    <div key={'/list'} location={location}>
        <TransitionGroup>
            <CSSTransition key={location.pathname} classNames="fade" timeout={300}>
                <Switch location={location}>
                    {menu.map((path) => (
                        <Route path={relativePath(location, path)} key={path}
                               component={ListContainer} />
                    ))}
                    <Redirect to={`/list/${menu[0]}`} />
                </Switch>
            </CSSTransition>
        </TransitionGroup>
    </div>
])

export {ListView as default}
