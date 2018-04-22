import React from 'react';

import {Toolbar} from 'butter-base-components';

const relativePath = (location, path) => {
    let basepath = location.pathname.split('/').slice(0, -1).join('/')
    return `${basepath}/${path}`
}

const defaultToolbar = (history) => (
    <Toolbar search={true} buttons={[
        {title: "settings", icon:"settings", action: () => (history.push('/settings'))}
    ]}/>
)

export {
    relativePath,
    defaultToolbar
}
