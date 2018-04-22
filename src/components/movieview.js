import React from 'react';

import MovieDetail from 'butter-component-movie-details';
import {Navbar} from 'butter-base-components';

import {defaultToolbar} from '../utils';

const MovieView = ({history, location, item}) => ([
    <Navbar key='main_nav'
    title="Go Back"
    goBack={() => (history.goBack())}
            right = {defaultToolbar(history)}
    />,
    <MovieDetail key='movie_detail' {...item} />
])

export {MovieView as default}
