<div class="filter-dropdown">
    <div class="dropdown-toggle drop-head" data-toggel="dropdown">
        <div class="category"><%= title =></div>
        <div class="select-item">
            <div class="selected"><%= i18n.__("Select One")%></div>
            <i class="icon material-icons"></i>
        </div>
    </div>
    <div class="dropdown-menu items" role="menu">
        <% for (var v in values ) { %>
        <li class="item" data-value="<%= v %>"><%= i18n.__(v) %></li>
        <% } %>
    </div>
</div>
