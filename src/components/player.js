import React from 'react'
import {Navbar} from 'butter-base-components'
import Video from 'butter-component-video';

const Identity = a => a

const Player = ({id, isFetching, streamer, goBack}) => {
  const url = `https://www.youtube.com/embed/${id}?rel=0&autoplay=1&showinfo=0`
    isFetching || console.error('playing', url)

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
