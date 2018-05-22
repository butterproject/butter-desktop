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
      providers: [
          'youtube?channel=midianinjafly&mode=shows&maxResults=30',
          'youtube?channel=kurzgesagt',
          /*   'youtube?channel=devinsupertramp',
             'youtube?channel=TEDtalksDirector',
             'youtube?channel=BadLipReading',
             'youtube?channel=1veritasium',
             'youtube?channel=enyay', // tom scott
             'youtube?channel=CinemaSins',
             'youtube?channel=TomSka',
             'youtube?channel=ExplosmEntertainment',
             'youtube?channel=everyframeapainting',
             'youtube?channel=willunicycleforfood' // exurb1a
             // 'youtube?channel=petercapusottotv&titleRegex=[0-9]+[aª] +Temporada', */
      ]
  }
}

export {Settings as default}
