<div class="dropup" >
    <div class="dropdown-toggle lang-dropdown" data-toggle="dropdown" >
        <i class="material-icons"><%= icon %></i>
        <span class="lang-name"><%= title %></span>
        <div class="selected-lang flag-icon flag none" title="<%= App.Localization.nativeName(selected) %>"></div>
        <i class="icon material-icons"></i>
    </div>
    <div class="dropdown-menu" role="menu">
        <div class="flag-container">
            <% for(var lang in values){ %>
            <div class="flag-icon flag <%= lang %>" data-lang="<%= lang %>" title="<%= App.Localization.nativeName(lang) %>"></div>
            <% } %>
        </div>
    </div>
</div>
