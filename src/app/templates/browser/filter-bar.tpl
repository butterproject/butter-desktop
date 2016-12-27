<ul class="nav nav-hor left">
    <% _.each (App.Config.getTabs(), function (tab) { %>
    <li class="source providerinfo contentTab"
        data-value="<%= tab.type %>"
        data-toggle="tooltip"
        data-placement="top"
        title="<%= App.Config.getFiltredProviderNames(tab.providers) %>">
        <%= i18n.__(tab.name) %>
    </li>
    <% }); %>
</ul>
<ul id="nav-filters" class="nav nav-hor filters">
    <li id="types-dropdown"></li>
    <li id="genres-dropdown"></li>
    <li id="sorters-dropdown"></li>
</ul>
<ul class="nav nav-hor right">
    <li id="search-dropdown"></li>

    <!-- Randomize -->
    <% if (Settings.activateRandomize) { %>
    <li style="display:block">
    <% } else { %>
    <li style="display:none">
    <% } %>
        <i id="filterbar-random" class="material-icons tooltipped" data-toggle="tooltip" data-placement="bottom" title="<%= i18n.__("Randomize") %>">shuffle</i>
    </li>

    <!-- Watchlist -->
    <% if (Settings.activateWatchlist) { %>
    <li style="display:block">
    <% } else { %>
    <li style="display:none">
    <% } %>
        <i id="filterbar-watchlist" class="material-icons watchlist tooltipped" data-toggle="tooltip" data-placement="bottom" title="<%= i18n.__("Watchlist") %>">archive</i>
    </li>

    <!-- Favorites -->
    <li>
        <i id="filterbar-favorites" class="material-icons favorites tooltipped" data-toggle="tooltip" data-placement="bottom" title="<%= i18n.__("Favorites") %>">favorite</i>
    </li>

    <!-- Torrent Collection -->
    <% if (Settings.activateTorrentCollection) { %>
    <li id="torrent_col" style="display:block">
    <% } else { %>
    <li id="torrent_col" style="display:none">
    <% } %>
        <i id="filterbar-torrent-collection" class="material-icons torrent-collection tooltipped" data-toggle="tooltip" data-placement="bottom" title="<%= i18n.__("Torrent Collection") %>">folder</i>
    </li>

    <!-- About -->
    <li>
        <i id="filterbar-about" class="material-icons about tooltipped" data-toggle="tooltip" data-placement="bottom" title="<%= i18n.__("About") %>">info</i>
    </li>

    <!-- Settings -->
    <li>
        <i id="filterbar-settings" class="material-icons settings tooltipped" data-toggle="tooltip" data-placement="left" title="<%= i18n.__("Settings") %>">settings</i>
    </li>
</ul>
