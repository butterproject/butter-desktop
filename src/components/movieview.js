import React from 'react';

import ContentDetail from 'butter-component-content-details';
import {Navbar} from 'butter-base-components';

import {defaultToolbar} from '../utils';

const MovieView = ({history, location, item}) => (
    <ContentDetail key='movie_detail'
                   goBack={{
                       action: history.goBack,
                       title: 'Movies'
                   }}
                   toolbar={defaultToolbar(history)} {...item} />)

export {MovieView as default}
