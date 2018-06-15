import React from 'react'

import { TransitionGroup, CSSTransition } from 'react-transition-group'

import {Navbar, Toolbar, Dropdowns} from 'butter-base-components'
import {RouterMenu} from 'butter-component-menu'

import deepEqual from 'deep-equal'

import ListContainer from '../containers/list'

const {Dropdown} = Dropdowns

console.error (Dropdown)

class ListView extends React.Component {
    shouldComponentUpdate (nextProps) {
        console.error('FILTERS', nextProps.filters, this.props.filters)
        if (! deepEqual(nextProps.filters, this.props.filters)) {
            console.error('dispatching FETCH')
            this.props.actions.FETCH({
                ...nextProps.filters,
                page: 0
            })
            return false
        }

        return ! deepEqual(nextProps, this.props)
    }

    render () {
        const {tab, menu, filters, config, match, history, location, actions} = this.props

        return ([
            <Navbar key='main_nav'
                    left={
                        <div style={{display: 'flex'}}>
                            <RouterMenu items={menu} location={location} />
                            <span>
                                <label>Genre:</label>
                                <Dropdown options={config.filters.genres}
                                                  apply={(item) => actions.genre(item)} />
                            </span>
                            <span>
                                <label>Sort By:</label>
                                <Dropdown options={config.filters.sorters}
                                                  apply={(item) => actions.sorter(item)} />
                            </span>
                        </div>
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
    }
}

export {ListView as default}
