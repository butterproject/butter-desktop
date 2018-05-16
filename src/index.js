'use strict;'

import RoutedNinja from './components/app';
import createStore from './store';
import Settings from 'butter-settings-default';

Settings.tabs = {
    movie: {
        order: 1,
        name: 'Movies',
        providers: ['gdocs', 'vodo']
    }
}

const store = createStore(Settings)

export {RoutedNinja as default, store};
