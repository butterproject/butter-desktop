<div class="play-control">
    <div class="play-btn">
            <div id="player-chooser" class="play-selector"></div>

            <div class="movie-quality-container" style="display: none">
                <% if (torrents["720p"] !== undefined && torrents["1080p"] !== undefined) { %>
                <div class="q720">720p</div>
                <div class="q1080">1080p</div>
                <div class="quality switch white">
                    <input data-toogle="tooltip" data-placement="top" title="720p - <%= Common.fileSize(torrents['720p'].size) %><br>1080p - <%= Common.fileSize(torrents['1080p'].size) %>" type="radio" name="switch" id="switch-hd-off" >
                    <input data-toogle="tooltip" data-placement="top" title="720p - <%= Common.fileSize(torrents['720p'].size) %><br>1080p - <%= Common.fileSize(torrents['1080p'].size) %>" type="radio" name="switch" id="switch-hd-on" checked >
                    <span class="toggle"></span>
                </div>
                <% } else { %>
                <% if (torrents["720p"] !== undefined) { %>
                <div data-toogle="tooltip" data-placement="top" title="<%= Common.fileSize(torrents['720p'].size) %>" class="q720">720p</div>
                <% }else if (torrents["1080p"] !== undefined) { %>
                <div data-toogle="tooltip" data-placement="top" title="<%= Common.fileSize(torrents['1080p'].size) %>" class="q720">1080p</div>
                <% } else { %>HDRip<% } %> 
                <% } %>
            </div>
    </div>
    <div class="flex-left dropdowns-container">
        <div id="subs-dropdown"></div>
        <div id="audio-dropdown"></div>
        <div id="quality-dropdown">
                <div class="dropup">
                    <div class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                        <i class="material-icons">high_quality</i>
                        <span class="">720p</span>
                        <div class="caret"></div>
                    </div>
                </div>  
        </div>
        <div id="player-dropdown">
                <div class="dropup">
                    <div class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                        <i class="material-icons">airplay</i>
                        <span class="">Popcorn Time!</span>
                        <div class="caret"></div>
                    </div>
                </div>  
        </div>
    </div>
</div>
