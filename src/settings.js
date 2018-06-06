import Settings from 'butter-settings-default'

Settings.tabs = {
  movie: {
    order: 1,
    name: 'Movies',
    providers: ['gdocs']
  },
  tvshow: {
    order: 2,
    name: 'Series',
    providers: ['youtube?channel=midianinjafly&mode=shows']
  },
  telesur: {
    order: 3,
    name: 'TeleSur',
    providers: ['youtube?channel=telesurtv&mode=shows']
  }
}

export {Settings as default}
