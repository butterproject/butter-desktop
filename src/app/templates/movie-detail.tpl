<%
if(typeof synopsis === "undefined"){ synopsis = "Synopsis not available."; };
if(typeof runtime === "undefined"){ runtime = "N/A"; };
if (genres) {
for(var i = 0; i < genres.length; i++) {
genres[i] = i18n.__(genres[i]);
}
} else {
var genres = [undefined];
};
%>

<section class="poster-box">
    <img src="images/posterholder.png" class="mcover-image" />
</section>

<section class="content-box">
    <div class="meta-container">
        <div class="metadatas">
            <div class="metaitem rating-container">
                <div class="star-container" data-toggle="tooltip" data-placement="right" title="<%= rating %>/10">
                    <% var p_rating = Math.round(rating) / 2; %>
                    <% for (var i = 1; i <= Math.floor(p_rating); i++) { %>
                    <i class="fa fa-star rating-star"></i>
                    <% }; %>
                    <% if (p_rating % 1 > 0) { %>
                    <span class = "fa-stack rating-star-half-container">
                        <i class="fa fa-star fa-stack-1x rating-star-half-empty"></i>
                        <i class="fa fa-star-half fa-stack-1x rating-star-half"></i>
                    </span>
                    <% }; %>
                    <% for (var i = Math.ceil(p_rating); i < 5; i++) { %>
                    <i class="fa fa-star rating-star-empty"></i>
                    <% }; %>
                </div>
                <div class="number-container hidden"><%= rating %> <em>/10</em></div>
            </div>
            <div class="metaitem"><%= year %></div>
            <div class="metaitem"><%= runtime %> min</div>
            <div class="metaitem"><%= genres.join(" / ") %></div>
            <div data-toggle="tooltip" data-placement="top" title="<%=i18n.__("Open IMDb page") %>" class="movie-imdb-link"></div>
        </div>

        <div class="overview"><%= synopsis %></div>
        <div id="watch-trailer"  class="button play-selector">
            <%=i18n.__("Watch Trailer") %>
        </div>
    </div>
</section>
<section id="play-control"></section>
