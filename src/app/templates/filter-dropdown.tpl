<div class="filter-dropdown">
    <div class="dropdown-toggle drop-head" data-toggle="dropdown">
        <div class="category"><%= title %></div>
        <div class="select-item">
            <div class="selected"><%= i18n.__("Select One") %></div>
            <div class="caret"></div>
        </div>
    </div>
    <ul class="dropdown-menu items" role="menu">
        <% values.forEach(function (v) { %>
        <li class="item" data-value="<%= v %>"><%= i18n.__(v) %></li>
        <% }) %>
    </ul>
</div>
