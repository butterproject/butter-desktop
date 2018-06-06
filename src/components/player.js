import React from 'react'
import {Navbar} from 'butter-base-components'
import style from './style.css'

const Identity = a => a

const Video = ({url}) => (
  <video src={url} controls autoPlay="true">
  </video>
)

const Player = ({id, isFetching, streamer, goBack = {action: Identity, title: 'Go Back'}}) => {
  const url = `https://www.youtube.com/embed/${id}?rel=0&autoplay=1&showinfo=0`
    isFetching || console.error('playing', url)

  return (
      <div>
          <Navbar type='content-nav' goBack={goBack} />
          {isFetching ? <p>Loading...</p>
           : streamer.loading ? <p>Caching...</p>
           : <Video {...streamer}/>
          }
      </div>
  )
}

export {Player as default}
