<div class="drop-selector dropup">
    <div class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
        <div class="select-item">
            <span class="selected"><%= selected %></span>
            <i class="icon material-icons"></i>
        </div>
    </div>
    <ul class="dropdown-menu" role="menu">
        <% for (var key in options) { %>
        <li class="filter-item" data-value="<%= key %>"><%= i18n.__(name || key) %></li>
        <% } %>
    </ul>
</div>
