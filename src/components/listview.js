import React from 'react'

import { TransitionGroup, CSSTransition } from 'react-transition-group'

import {Navbar, Toolbar} from 'butter-base-components'
import {RouterMenu} from 'butter-component-menu'

import ListContainer from '../containers/list'

const ListView = ({tab, menu, match, history, location, actions}) => ([
    <Navbar key='main_nav'
            left={
                <RouterMenu items={menu} location={location} />
            }
            right={
                <Toolbar search buttons={[
                    {title: 'settings', icon: 'settings', action: actions.settings}
                ]} actions={{search: actions.search}} />
            }
    />,
    <TransitionGroup key={'/list'}>
        <CSSTransition key={location.pathname} classNames='fade' timeout={300}>
            <div style={{overflow: 'scroll', height: '100%'}}>
                <ListContainer tab={tab} history={history} match={match}/>
            </div>
        </CSSTransition>
    </TransitionGroup>
])

export {ListView as default}
