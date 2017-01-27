<%
if(typeof health === "undefined"){ health = false; };
%>
<div class="go-back"><i class="material-icons">arrow_back</i><span><%= title %></span></div>
<ul class="toolbar">
    <li>
        <i data-toggle="tooltip" data-placement="left" title="<%=i18n.__("Health false") %>" class="material-icons health-icon <%= health %>">fiber_manual_record</i>
    </li>
    <li>
        <i data-toogle="tooltip" data-placement="left" title="<%=i18n.__("Magnet link") %>" class="material-icons magnet-link">link</i>
    </li>
    <li>
        <i data-toggle="tooltip" data-placement="left" title="<%=i18n.__("Add to bookmarks") %>" class="material-icons favourites-toggle">favorite_border</i>
    </li>
    <li>
        <i data-toggle="tooltip" data-placement="left" title="<%=i18n.__("Not Seen") %>" class="material-icons watched-toggle">visibility_off</i>
    </li>
</ul>
