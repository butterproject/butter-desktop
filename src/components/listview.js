import React from 'react'

import { TransitionGroup, CSSTransition } from 'react-transition-group'

import {Navbar, Toolbar, Dropdowns} from 'butter-base-components'
import {RouterMenu} from 'butter-component-menu'
const {Dropdown} = Dropdowns

import deepEqual from 'deep-equal'

import ListContainer from '../containers/list'
import SortAsc from '../icons/sort-ascending.svg'
import SortDesc from '../icons/sort-descending.svg'

import style from './listview.styl'

const order = {
    asc: 'Ascending',
    desc: 'Decending'
}

const Selector = ({children, title, ...props}) => (
    <span className={style.selector}>
        <label className={style.label}>{title}:</label>
        <Dropdown {...props}/>
    </span>
)

const OrderSelector = ({order, apply}) => (
    <SortDesc onClick={() => apply(order === 'asc' ? 'desc' : 'asc')}
              className={style.orderSelector} aria-order={order}/>
)

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
                        <RouterMenu items={menu} location={location} />
                    }
                    right={
                        <Toolbar search buttons={[
                            {title: 'settings', icon: 'settings', action: actions.settings}
                        ]} actions={{search: actions.search}} />
                    }>
                <div style={{display: 'flex'}}>
                    <Selector title="Genre"
                              selected={filters.genre}
                              options={config.filters.genres}
                              apply={(item) => actions.genre(item)} />
                    <Selector title="Sort By"
                              selected={filters.sorter}
                              options={config.filters.sorters}
                              apply={(item) => actions.sorter(item)} />
                    <OrderSelector order={filters.order} apply={actions.order}/>
                </div>
            </Navbar>
            ,
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
