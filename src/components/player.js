import React from 'react'
import {Navbar} from 'butter-base-components'

const Identity = a => a

const Player = ({id, goBack = {action: Identity, title: "Go Back"}}) => (
    <div>
        <Navbar type='player-nav' goBack={goBack}/>
        <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${id}?rel=0&autoplay=1`} frameborder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
    </div>
)

export {Player as default}
