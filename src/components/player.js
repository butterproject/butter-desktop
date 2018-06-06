import React from 'react'
import {Navbar} from 'butter-base-components'

import { DefaultPlayer as Video } from 'react-html5video';
import 'react-html5video/dist/styles.css';

const Identity = a => a

const Player = ({id, isFetching, streamer, goBack = {action: Identity, title: 'Go Back'}}) => {
  const url = `https://www.youtube.com/embed/${id}?rel=0&autoplay=1&showinfo=0`
    isFetching || console.error('playing', url)

  return (
    <div>
        <Navbar type='content-nav' goBack={goBack} />
        {isFetching ? <p>Loading...</p>
         : streamer.loading || ! streamer.url ? <p>Caching...</p>
         : <Video autoPlay
                  controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen']}>
             <source src={streamer.url} />
         </Video>
        }
    </div>
  )
}

export {Player as default}
