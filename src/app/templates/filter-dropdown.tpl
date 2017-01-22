<div class="filter-dropdown">
    <div class="dropdown-toggle" data-toggle="dropdown">
        <div class="category"><%= title %></div>
        <div class="select-item">
            <div class="selected"><%= i18n.__("Select One") %></div>
            <i class="icon material-icons"></i>
        </div>
    </div>
    <ul class="filter-items" role="menu">
        <% for (var key in options) { %>
        <li class="filter-item" data-value="<%= key %>"><%= i18n.__(options[key]) %></li>
        <% } %>
    </ul>
</div>
