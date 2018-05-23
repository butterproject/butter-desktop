import React from 'react'
import {Navbar} from 'butter-base-components'

const Identity = a => a

const Player = ({id, isFetching, goBack = {action: Identity, title: 'Go Back'}}) => {
  const url = `https://www.youtube.com/embed/${id}?rel=0&autoplay=1&showinfo=0`
    isFetching || console.error('playing', url)

  return (
      <div>
          <Navbar type='player-nav' goBack={goBack} />
          {isFetching ? <p>Loading...</p>
           :  <iframe width='100%' height='100%' src={url} frameBorder='0' allow='autoplay; encrypted-media' allowFullScreen />
          }
      </div>
  )
}

export {Player as default}
