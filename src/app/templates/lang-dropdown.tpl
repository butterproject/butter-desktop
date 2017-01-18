<div class="drop-selector dropup" >
    <div class="dropdown-toggle lang-dropdown" data-toggle="dropdown" >
        <div class="drop-label">
            <i class="material-icons"><%= icon %></i>
            <span class="lang-name"><%= title %></span>
        </div>
        <div class="select-item">
            <div class="selected-lang flag-icon flag none" title="<%= App.Localization.nativeName(selected) %>"></div>
            <i class="icon material-icons"></i>
        </div>
    </div>
    <ul class="dropdown-menu" role="menu">
        <div class="flag-container">
            <% for(var lang in values){ %>
            <div class="flag-icon flag <%= lang %>" data-lang="<%= lang %>" title="<%= App.Localization.nativeName(lang) %>"></div>
            <% } %>
        </ul>
    </div>
</div>
