<div class="filter-dropdown">
    <div class="dropdown-toggle drop-head" data-toggle="dropdown">
        <div class="category"><%= title %></div>
        <div class="select-item">
            <div class="selected"><%= i18n.__("Select One") %></div>
            <div class="caret"></div>
        </div>
    </div>
    <ul class="dropdown-menu filter-items" role="menu">
        <% for (var v in values) { %>
        <li class="filter-item" data-value="<%= v %>"><%= i18n.__(v) %></li>
        <% } %>
    </ul>
</div>
