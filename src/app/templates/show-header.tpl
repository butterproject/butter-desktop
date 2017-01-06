<ul class="panel-group nav-hor left" id="accordion" role="tablist" aria-multiselectable="true">
    <li class="panel">
        <a class="source active" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
            <%= i18n.__('Show Info') %>
        </a>
        <div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
        </div>
    </li>
    <%_.each(torrents, function(episodes, season) { %>
    <li class="panel">
        <a class="source" role="button" data-toggle="collapse" data-parent="#accordion"
           href="#show-detail-collapse-<%= season %>"
           aria-expanded="false" aria-controls="show-detail-collapse-<%= season %>">
            <%= i18n.__('Season ' + season) %>
        </a>
        <ul id="show-detail-collapse-<%= season %>" class="episode-list panel-collapse collapse" role="tabpanel">
            <%_.each(episodes, function(value, episode) { %>
            <li>
                <span><%= episode %></span>
                <h4><%= value.title %></h4>
            </li>
            <% }) %>
        </ul>
    </li>
    <% }) %>
</ul>

