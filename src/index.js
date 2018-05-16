'use strict;'

import RoutedNinja from './components/app';
import createStore from './store';

const providers = [
    require('butter-provider-gdocs'),
    require('butter-provider-vodo'),
    require('butter-provider-ccc')
]

const store = createStore(providers)

export {RoutedNinja as default, store};
