import ActionTypes from 'butter-action-types';

const arrayToi18nHash = (a) => {
    return a.reduce((a, c) => {
        a[c] = c;
        return a;
    }, {});
}

// XXX(xaiki): remove infavour of a real i18n implementation
const i18n = {
    __: (a) => (a)
}

const tabs = [{
    title: "General",
    id: "general",
    items: [{
        id: "activateTorrentCollection",
        icon: "collections_bookmark",
        title: "Torrent Collection",
        helper: "Display a view with your Torrent Collection",
        action: {
            type: ActionTypes.SWITCH
        }
    }, {
        id: "activateWatchlist",
        icon: "remove_red_eye",
        title: "Watchlist",
        helper: "Display a view with your Watchlist",
        action: {
            type: ActionTypes.SWITCH
        }
    }, {
        id: "activateRandomize",
        icon: "shuffle",
        title: "Randomize Button",
        helper: "Display a button to select a Random Movie in the Current View",
        advanced: true,
        action: {
            type: ActionTypes.SWITCH
        }
    }, {
        id: "movies_quality",
        icon: "sort",
        title: "Content Quality",
        helper: "Only show content in this quality",
        advanced: true,
        action: {
            type: ActionTypes.DROPDOWN,
            options: arrayToi18nHash(["all", "1080p", "720p"])
        }
    }, {
        id: "moviesShowQuality",
        icon: "high_quality",
        title: "Show Quality",
        helper: "Display Content Quality in List view",
        advanced: true,
        action: {
            type: ActionTypes.SWITCH
        }
    }, {
        id: "alwaysFullscreen",
        icon: "fullscreen",
        title: "Fullscreen",
        helper: "Always start playback in FullScreen mode",
        advanced: true,
        action: {
            type: ActionTypes.SWITCH
        }
    }, {
        id: "playNextEpisodeAuto",
        icon: "queue_play_next",
        title: "Play Next",
        helper: "Automatically play next Episode",
        advanced: true,
        action: {
            type: ActionTypes.SWITCH
        }
    }, {
        id: "connectionLimit",
        icon: "settings_applications",
        title: "Connection Limit",
        helper: "Limit the amount of Outbound Connection Butter will open",
        advanced: true,
        action: {
            type: ActionTypes.TEXT
        }
    }, {
        id: "streamPort",
        icon: "settings_applications",
        title: "Stream Port",
        helper: "Port to stream on, randomlly choosen if 0",
        advanced: true,
        action: {
            type: ActionTypes.TEXT
        }
    }, {
        id: "overallRatio",
        icon: "settings_applications",
        title: "Overall Ratio",
        helper: "Downloaded so far:",
        advanced: true,
        action: {
            type: ActionTypes.TEXT
        }
    }, {
        id: "cache-directory",
        icon: "folder",
        title: "Cache Directory",
        helper: "Open the Directory where Butter keeps it's Cache",
        advanced: true,
        action: {
            type: ActionTypes.BUTTON,
            title: "Open"
        }
    }, {
        id: "deleteTmpOnClose",
        icon: "delete",
        title: "Clear Cache",
        helper: "Delete temp folder after closing the App",
        advanced: true,
        action: {
            type: ActionTypes.SWITCH
        }
    }]
}, {
    title: "Interface",
    id: "interface",
    items: [{
        icon: "collections_bookmark",
        title: "Torrent Collection",
        helper: "Display a view with your Torrent Collection",
        action: {
            type: ActionTypes.SWITCH
        }
    }, {
        icon: "folder",
        title: "Cache Directory",
        helper: "Open the Directory where Butter keep it's cache",
        action: {
            type: ActionTypes.BUTTON,
            title: "Open"
        }
    }, {
        icon: "format_paint",
        title: "Theme",
        helper: "Select a different Look&Feel for the App",
        action: {
            type: ActionTypes.DROPDOWN,
            options: arrayToi18nHash(["dark", "pink"]),
            apply: (theme) =>
                (document.documentElement.className = `butter-theme-${theme}`)
        }
    }, {
        icon: "location_on",
        title: "IP Adress",
        helper: "Set this machine's IP Adress",
        action: {
            type: ActionTypes.TEXT
        }
    }]
}, {
    title: "Providers",
    id: "providers",
    items: []
}]

export {tabs as default}
