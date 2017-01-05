<ul class="nav nav-hor left">
    <li class="source" data-value="info">
        <%= i18n.__('Show Info') %>
    </li>
    <%_.each(torrents, function(value, season) { %>
    <li class="source" data-value="<%= 'season-' + season %>"
        role="button" data-toggle="collapse"
        data-target="#show-detail-collapse-<%= season %>"
        aria-expanded="false" aria-controls="show-detail-collapse">
        <%= i18n.__('Season ' + season) %>
    </li>
    <% }) %>
    <ul>
        <%_.each(torrents, function(episodes, season) { %>
        <ul id="show-detail-collapse-<%= season %>" class="collapse">
            <%_.each(episodes, function(value, episode) { %>
            <li>
                <span><%= episode %></span>
                <span><%= value.title %></span>
            </li>
            <% }) %>
        </ul>
        <% }) %>
    </ul>
</ul>

