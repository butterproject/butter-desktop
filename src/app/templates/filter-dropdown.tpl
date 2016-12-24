<div class="filter-dropdown">
    <div class="drop-head">
        <div class="category"><%= title =></div>
        <div class="select-item">
            <div class="selected"><%= i18n.__("Select One")%></div>
            <i class="icon material-icons"></i>
        </div>
    </div>
    <div class="items">
        <% _.each(values, function (v) { %>
        <li class="item" data-value="<%= v %>"><%= i18n.__(v) %></li>
        <% }) %>
    </div>
</div>
