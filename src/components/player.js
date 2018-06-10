import React from 'react'
import {Navbar} from 'butter-base-components'
import Video from 'butter-component-video';

const Identity = a => a

const Player = ({id, isFetching, streamer, goBack}) => {
  return (
    <div>
        {isFetching ? <p>Loading...</p>
         : streamer.loading || ! streamer.url ? <p>Caching...</p>
         : <Video autoPlay goBack={goBack}>
             <source src={streamer.url} />
         </Video>
        }
    </div>
  )
}

Player.defaultProps = {
  isFetching: false,
  streamer: {loading: false},
  goBack: {action: Identity, title: 'Go Back'}
}

export {Player as default}
