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

    <ul id="nav-filters" class="nav nav-hor filters">
        <li id="types-dropdown"></li>
        <li id="genres-dropdown"></li>
        <li id="sorters-dropdown"></li>
    </ul>
</ul>

<ul class="nav nav-hor right">
    <li id="search-dropdown"></li>
    <!-- Randomize -->
    <% if (Settings.activateRandomize) { %>
    <li style="display:inline-block">
    <% } else { %>
    <li style="display:none">
    <% } %>
        <i id="filterbar-random" class="material-icons tooltipped" data-toggle="tooltip" data-placement="bottom" title="<%= i18n.__("Randomize") %>">shuffle</i>
    </li>
    <li>
        <i class="material-icons tooltipped">shuffle</i>
    </li>
    <!-- Watchlist
    <li>
        <i id="filterbar-watchlist" class="material-icons tooltipped contentTab"
           data-toggle="tooltip" data-placement="bottom" data-value="watchlist"
           title="<%= i18n.__("Watchlist") %>">inbox</i>
    </li>
     -->
    <!-- Favorites -->
    <li>
        <i id="filterbar-favorites" class="material-icons tooltipped contentTab"
           data-toggle="tooltip" data-placement="bottom" data-value="favorites"
           title="<%= i18n.__("Favorites") %>">favorite</i>
    </li>

    <!-- Torrent Collection
    <li id="torrent_col">
        <i id="filterbar-torrent-collection" class="material-icons tooltipped contentTab"
           data-toggle="tooltip" data-placement="bottom" data-value="torrentCollection"
           title="<%= i18n.__("Torrent Collection") %>">folder</i>
    </li>
    -->
    <!-- About
    <li>
        <i id="filterbar-about" class="material-icons about tooltipped" data-toggle="tooltip" data-placement="bottom" title="<%= i18n.__("About") %>">info</i>
    </li>
    -->
    <!-- Settings -->
    <li>
        <i id="filterbar-settings" class="material-icons settings tooltipped" data-toggle="tooltip" data-placement="left" title="<%= i18n.__("Settings") %>">more_vert</i>
    </li>
</ul>
