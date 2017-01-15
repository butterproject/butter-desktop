<div class="settings-container">
    <div class="success_alert" style="display:none"><%= i18n.__("Saved") %>&nbsp;<span id="checkmark-notify"><div id="stem-notify"></div><div id="kick-notify"></div></span></div>
    <div id="action-bar">
        <div class="actions-bar">
            <div class="go-back"><i class="material-icons">arrow_back</i><span><%= i18n.__("Settings") %></span></div>
            <ul class="toolbar">
                <li>
                    <i data-toggle="tooltip" data-placement="left" title="<%= i18n.__("Keyboard Shortcuts") %>" class="material-icons">keyboard</i>
                </li>
                <li>
                    <i data-toogle="tooltip" data-placement="left" title="<%= i18n.__("Help Section") %>" class="material-icons magnet-link">help_outline</i>
                </li>
                <li>
                    <i data-toggle="tooltip" data-placement="left" title="<%= i18n.__("Show advanced settings") %>" class="material-icons favourites-toggle">filter_list</i><input id="show-advanced-settings" class="settings-checkbox" name="showAdvancedSettings" type="checkbox" <%=(Settings.showAdvancedSettings? "checked":"")%>>
                </li>
            </ul>
        </div>
    </div>
    <script>
        $('#myTabs a').click(function (e) {
      e.preventDefault()
      $(this).tab('show')
    })
    </script>

     <!-- Nav tabs -->
     <div class="navbar-s">
          <ul id="myTabs" class="nav nav-tabs" role="tablist">
            <li role="presentation" class="active source"><a href="#player" aria-controls="home" role="tab" data-toggle="tab">Player</a></li>
            <li role="presentation" class="source"><a href="#interface" aria-controls="profile" role="tab" data-toggle="tab">Interface</a></li>
            <li role="presentation" class="source"><a href="#extensions" aria-controls="extensions" role="tab" data-toggle="tab">Extensions</a></li>
            <li role="presentation" class="source"><a href="#settings" aria-controls="settings" role="tab" data-toggle="tab">Settings</a></li>
          </ul>
      </div>

      <!-- Tab panes -->
      <div class="tab-content">
        <div role="tabpanel" class="tab-pane active" id="player">
            <section id="subtitles">
                <div class="content">
                    <div class="settings-row dropdown subtitles-language-default">
                        <i class="material-icons">subtitles</i>
                        <div class="text">
                            <div class="item-title"><%= i18n.__("Default Subtitle") %></div>
                            <div class="helper">Some text for help.</div>

                        </div>
                        <div class="action-item">
                            <%
                                var sub_langs = "<option "+(Settings.subtitle_language == "none"? "selected='selected'":"")+" value='none'>" +
                                                    i18n.__("Disabled") + "</option>";

                                for(var key in App.Localization.langcodes) {
                                    if (App.Localization.langcodes[key].subtitle !== undefined && App.Localization.langcodes[key].subtitle == true) {
                                        sub_langs += "<option "+(Settings.subtitle_language == key? "selected='selected'":"")+" value='"+key+"'>"+
                                                        App.Localization.langcodes[key].nativeName+"</option>";
                                    }
                                }
                            %>
                            <select name="subtitle_language"><%=sub_langs%></select>
                            <div class="dropdown-arrow"></div>
                        </div>
                    </div>
    
                    <div class="settings-row dropdown advanced subtitles-font">
                        <i class="material-icons">format_shapes</i>
                        <div class="text">
                            <div class="item-title"><%= i18n.__("Font") %></div>
                            <div class="helper">Some text for help.</div>

                        </div>
                        <div class="action-item">
                            <%
                                var arr_fonts = [
                                    {name:"AljazeeraMedExtOf", id:"aljazeera"},
                                    {name:"Deja Vu Sans", id:"dejavusans"},
                                    {name:"Droid Sans", id:"droidsans"},
                                    {name:"Comic Sans MS", id:"comic"},
                                    {name:"Georgia", id:"georgia"},
                                    {name:"Geneva", id:"geneva"},
                                    {name:"Helvetica", id:"helvetica"},
                                    {name:"Khalid Art", id:"khalid"},
                                    {name:"Lato", id:"lato"},
                                    {name:"Montserrat", id:"montserrat"},
                                    {name:"OpenDyslexic", id:"opendyslexic"},
                                    {name:"Open Sans", id:"opensans"},
                                    {name:"PT Sans",id:"pts"},
                                    {name:"Tahoma", id:"tahoma"},
                                    {name:"Trebuchet MS", id:"trebuc"},
                                    {name:"Roboto",id:"roboto"},
                                    {name:"Ubuntu", id:"ubuntu"},
                                    {name:"Verdana", id:"verdana"},
                                ];

                                var font_folder = path.resolve({
                                    win32:  "/Windows/fonts",
                                    darwin: "/Library/Fonts",
                                    linux:  "/usr/share/fonts"
                                }[process.platform]);

                                var files = [];
                                var recursive = function (dir) {
                                    if (fs.statSync(dir).isDirectory()) {
                                        fs.readdirSync(dir).forEach(function (name) {
                                            var newdir = path.join(dir, name);
                                            recursive(newdir);
                                        });
                                    } else {
                                        files.push(dir);
                                    }
                                };
                                try {
                                    recursive(font_folder);
                                } catch (e) {}
                                var avail_fonts = ["Arial"];

                                for (var i in arr_fonts) {
                                    for (var key in files) {
                                        var found = files[key].toLowerCase();
                                        var toFind = arr_fonts[i].id;
                                        if (found.indexOf(toFind) != -1) {
                                            avail_fonts.push(arr_fonts[i].name);
                                            break;
                                        }
                                    }
                                }

                                var sub_fonts = "";
                                for (var key in avail_fonts) {
                                    sub_fonts += "<option "+(Settings.subtitle_font == avail_fonts[key]+",Arial"? "selected='selected'":"")+" value='"+avail_fonts[key]+",Arial'>"+avail_fonts[key]+"</option>";
                                }
                            %>
                            <select name="subtitle_font"><%=sub_fonts%></select>
                            <div class="dropdown-arrow"></div>
                        </div>
                    </div>
           

                    <div class="settings-row dropdown subtitles-decoration advanced">
                        <i class="material-icons">format_color_text</i>
                        <div class="text">
                            <div class="item-title"><%= i18n.__("Decoration") %></div>
                            <div class="helper">Some text for help.</div>

                        </div>
                        <div class="action-item">
                             <%
                                var arr_deco = ["None", "Outline", "Opaque Background", "See-through Background"];

                                var sub_deco = "";
                                for(var key in arr_deco) {
                                    sub_deco += "<option "+(Settings.subtitle_decoration == arr_deco[key]? "selected='selected'":"")+" value='"+arr_deco[key]+"'>"+i18n.__(arr_deco[key])+"</option>";
                                }
                            %>
                            <select name="subtitle_decoration"><%=sub_deco%></select>
                            <div class="dropdown-arrow"></div>
                        </div>
                    </div>
                   

                    <div class="settings-row dropdown dropdown subtitles-size">
                        <i class="material-icons">color_lens</i>
                        <div class="text">
                            <div class="item-title"><%= i18n.__("Size") %></div>
                            <div class="helper">Some text for help.</div>

                        </div>
                        <div class="action-item">
                            <%
                                var arr_sizes = ["20px","22px","24px","26px","28px","30px","32px","34px","36px","38px","40px","42px","44px","46px","48px","50px","52px","54px","56px","58px","60px"];

                                var sub_sizes = "";
                                for(var key in arr_sizes) {
                                    sub_sizes += "<option "+(Settings.subtitle_size == arr_sizes[key]? "selected='selected'":"")+" value='"+arr_sizes[key]+"'>"+arr_sizes[key]+"</option>";
                                }
                            %>
                            <select name="subtitle_size"><%=sub_sizes%></select>
                            <div class="dropdown-arrow"></div>
                        </div>
                    </div>

                    <div class="settings-row advanced subtitles-custom">
                        <i class="material-icons">subtitles</i>
                        <div class="text">
                            <div class="item-title"><%= i18n.__("Color") %></div>
                            <div class="helper">Some text for help.</div>

                        </div>
                        <div class="action-item">
                            <input class="colorsub" id="subtitles_color" type="color" size="7" name="subtitle_color" value="<%=Settings.subtitle_color%>" list="subs_colors">
                            <datalist id="subs_colors">
                                <option>#ffffff</option>
                                <option>#ffff00</option>
                                <option>#ff0000</option>
                                <option>#ff00ff</option>
                                <option>#00ffff</option>
                                <option>#00ff00</option>
                            </datalist>
                        </div>
                    </div>

                  
                    <div class="settings-row advanced subtitles-language-default">
                        <i class="material-icons">format_bold</i>
                        <div class="text">
                            <div class="item-title"><%= i18n.__("Bold") %></div>
                            <div class="helper">Some text for help.</div>

                        </div>
                        <div class="action-item">
                            <input class="settings-checkbox" name="subtitles_bold" id="subsbold" type="checkbox" <%=(Settings.subtitles_bold? "checked='checked'":"")%>>
                        </div>
                    </div>

                </div>
            </section>
        </div>
        <div role="tabpanel" class="tab-pane" id="interface">
            <section id="user-interface">
                <div class="content">
                    <div class="settings-row subtitles-language">
                        <i class="material-icons">settings_applications</i>
                        <div class="text">
                            <div class="item-title"><%= i18n.__("Default Language") %></div>
                            <div class="helper">Some text for help.</div>

                        </div>
                        <div class="action-item">
                            <%
                                var langs = "";
                                for(var key in App.Localization.allTranslations) {
                                        key = App.Localization.allTranslations[key];
                                        if (App.Localization.langcodes[key] !== undefined) {
                                        langs += "<option "+(Settings.language == key? "selected='selected'":"")+" value='"+key+"'>"+
                                                    App.Localization.langcodes[key].nativeName+"</option>";
                                    }
                                }
                            %>
                            <select name="language"><%=langs%></select>
                            <div class="dropdown-arrow"></div>
                        </div>
                    </div>

                    <div class="settings-row pct-theme">
                        <i class="material-icons">settings_applications</i>
                        <div class="text">
                            <div class="item-title"><%= i18n.__("Theme") %></div>
                            <div class="helper">Some text for help.</div>
                        </div>
                        <div class="action-item">
                            <%
                                var themes = "";
                                var theme_files = fs.readdirSync('./src/app/themes/');
                                for (var i in theme_files) {
                                    if (theme_files[i].indexOf('_theme') > -1) {
                                        themes += "<option " + (Settings.theme == theme_files[i].slice(0, -4)? "selected='selected'" : "") + " value='" + theme_files[i].slice(0, -4) + "'>" +
                                        theme_files[i].slice(0, -10).split('_').join(' '); + "</option>";
                                    }
                                    if (theme_files[i] === 'third_party') {
                                        var third_party_files = fs.readdirSync('./src/app/themes/third_party');
                                        for (var k in third_party_files) {
                                            if (third_party_files[k].indexOf('_theme') > -1) {
                                                themes += "<option " + (Settings.theme == 'third_party\/' + third_party_files[k].slice(0, -4)? "selected='selected'" : "") + " value='" + 'third_party\/' + third_party_files[k].slice(0, -4) + "'>" +
                                                third_party_files[k].slice(0, -10).split('_').join(' '); + "</option>";
                                            }
                                        }
                                    }
                                }
                            %>
                            <select name="theme"><%=themes%></select>
                            <div class="dropdown-arrow"></div>
                        </div>
                    </div>

                    <div class="settings-row advanced start-screen">
                        <i class="material-icons">settings_applications</i>
                        <div class="text">
                            <div class="item-title"><%= i18n.__("Start Screen") %></div>
                            <div class="helper">Some text for help.</div>

                        </div>
                        <div class="action-item">
                            <%
                                    var arr_screens = ["Movies","TV Series","Anime","Indie","Favorites", "Watchlist", "Last Open"];

                                    var selct_start_screen = "";
                                    for(var key in arr_screens) {
                                        selct_start_screen += "<option "+(Settings.start_screen == arr_screens[key]? "selected='selected'":"")+" value='"+arr_screens[key]+"'>"+i18n.__(arr_screens[key])+"</option>";
                                    }
                                %>
                            <select name="start_screen"><%=selct_start_screen%></select>
                            <div class="dropdown-arrow"></div>
                        </div>
                    </div>

                    <div class="settings-row advanced">
                        <i class="material-icons">settings_applications</i>
                        <div class="text">
                            <div class="item-title"><%= i18n.__("Translate Synopsis") %></div>
                            <div class="helper">Some text for help.</div>

                        </div>
                        <div class="action-item">
                            <input class="settings-checkbox" name="translateSynopsis" id="translateSynopsis" type="checkbox" <%=(Settings.translateSynopsis? "checked='checked'":"")%>>
                        </div>
                    </div>


                    <div class="settings-row advanced">
                        <i class="material-icons">settings_applications</i>
                        <div class="text">
                            <div class="item-title"><%= i18n.__("Show rating over covers") %></div>
                            <div class="helper">Some text for help.</div>

                        </div>
                        <div class="action-item">
                            <input class="settings-checkbox" name="coversShowRating" id="cb3" type="checkbox" <%=(Settings.coversShowRating? "checked='checked'":"")%>>
                        </div>
                    </div>


                    <div class="settings-row advanced">
                        <i class="material-icons">settings_applications</i>
                        <div class="text">
                            <div class="item-title"><%= i18n.__("Always On Top") %></div>
                            <div class="helper">Some text for help.</div>

                        </div>
                        <div class="action-item">
                            <input class="settings-checkbox" name="alwaysOnTop" id="cb4" type="checkbox" <%=(Settings.alwaysOnTop? "checked='checked'":"")%>>
                        </div>
                    </div>


                    <div class="settings-row advanced">
                        <i class="material-icons">settings_applications</i>
                        <div class="text">
                            <div class="item-title"><%= i18n.__("Remember Filters") %></div>
                            <div class="helper">Some text for help.</div>

                        </div>
                        <div class="action-item">
                            <input class="settings-checkbox" name="rememberFilters" id="cb7" type="checkbox" <%=(Settings.rememberFilters? "checked='checked'":"")%>>
                        </div>
                    </div>

                    <div class="settings-row watchedCovers">
                        <i class="material-icons">settings_applications</i>
                        <div class="text">
                            <div class="item-title"><%= i18n.__("Watched Items") %></div>
                            <div class="helper">Some text for help.</div>

                        </div>
                        <div class="action-item">
                            <%
                                    var watch_type = {
                                        "none": "Show",
                                        "fade": "Fade",
                                        "hide": "Hide"
                                    };

                                    var select_watched_cover = "";
                                    for(var key in watch_type) {
                                        select_watched_cover += "<option "+(Settings.watchedCovers == key? "selected='selected'":"")+" value='"+key+"'>"+i18n.__(watch_type[key])+"</option>";
                                    }
                                %>
                            <select name="watchedCovers"><%=select_watched_cover%></select>
                            <div class="dropdown-arrow"></div>
                        </div>
                    </div>


                </div>
            </section>
        </div>
        <div role="tabpanel" class="tab-pane" id="extensions">
            <section id="remote-control" class="advanced">
                
                <div class="content">
                    <div class="title"><%= i18n.__("Remote Control") %></div>
                    <div class="settings-row dropdown subtitles-language-default">
                        <i class="material-icons">subtitles</i>
                        <div class="text">
                            <div class="item-title"><%= i18n.__("Local IP Address") %></div>
                            <div class="helper">Some text for help.</div>

                        </div>
                        <div class="action-item">
                             <input type="text" id="settingsIpAddr" value="<%= Settings.ipAddress %>" readonly="readonly" size="20" />
                        </div>
                    </div>
                    <div class="settings-row dropdown subtitles-language-default">
                        <i class="material-icons">subtitles</i>
                        <div class="text">
                            <div class="item-title"><%= i18n.__("HTTP API Port") %></div>
                            <div class="helper">Some text for help.</div>

                        </div>
                        <div class="action-item">
                            <input id="httpApiPort" type="number" size="5" name="httpApiPort" value="<%=Settings.httpApiPort%>">
                        </div>
                    </div>
                    <div class="settings-row dropdown subtitles-language-default">
                        <i class="material-icons">subtitles</i>
                        <div class="text">
                            <div class="item-title"><%= i18n.__("HTTP API Username") %></div>
                            <div class="helper">Some text for help.</div>

                        </div>
                        <div class="action-item">
                            <input id="httpApiUsername" type="text" name="httpApiUsername" value="<%=Settings.httpApiUsername%>">
                        </div>
                    </div>
                    <div class="settings-row dropdown subtitles-language-default">
                        <i class="material-icons">subtitles</i>
                        <div class="text">
                            <div class="item-title"><%= i18n.__("HTTP API Password") %></div>
                            <div class="helper">Some text for help.</div>

                        </div>
                        <div class="action-item">
                            <input id="httpApiPassword" type="text" name="httpApiPassword" value="<%=Settings.httpApiPassword%>">
                        </div>
                    </div>
                    <div class="settings-row dropdown subtitles-language-default">
                        <i class="material-icons">subtitles</i>
                        <div class="text">
                            <div class="item-title"><%= i18n.__("Generate Pairing QR code") %></div>
                            <div class="helper">Some text for help.</div>

                        </div>
                        <div class="action-item database">
                             <div class="btn database qr-code">
                                Action
                             </div>
                            <div id="qrcode-overlay"></div>
                                <div id="qrcode-modal">
                                    <span class="fa-stack fa-1x" id="qrcode-close">
                                        <i class="fa fa-circle-thin fa-stack-2x" style="margin-top: -2px;"></i>
                                        <i class="fa fa-times fa-stack-1x" style="margin-top: -2px;"></i>
                                    </span>
                                    <canvas id="qrcode" width="200" height="200"></canvas>
                                </div><!-- /.modal -->
                        </div>
                    </div>

                   
                </div>
            </section>
             <% if(App.Trakt) { %>
            <section id="trakt-tv">
                
                <div class="content">
                    <div class="title">Trakt.tv</div>
                    <div class="trakt-options<%= App.Trakt.authenticated ? " authenticated" : "" %>">
                        <% if(App.Trakt.authenticated) { %>
                            <div class="settings-row">
                                <i class="material-icons">tv</i>
                                <div class="text">
                                    <div class="item-title"><%= i18n.__("You are currently connected to %s", "Trakt.tv") %>.</div>
                                    <div class="helper">Some text for help.</div>

                                </div>
                                <div class="action-item">
                                    <a id="unauthTrakt" class="unauthtext" href="#"><%= i18n.__("Disconnect account") %></a>
                                </div>
                            </div>

                            <div class="settings-row">
                                <i class="material-icons">tv</i>
                                <div class="text">
                                    <div class="item-title"><%= i18n.__("Automatically Sync on Start") %></div>
                                    <div class="helper">Some text for help.</div>

                                </div>
                                <div class="action-item">
                                    <input class="settings-checkbox" name="traktSyncOnStart" id="traktSyncOnStart" type="checkbox" <%=(Settings.traktSyncOnStart? "checked='checked'":"")%>>
                                </div>
                            </div>

                            <div class="settings-row">
                                <i class="material-icons">tv</i>
                                <div class="text">
                                    <div class="item-title"><%= i18n.__("Resume Playback") %></div>
                                    <div class="helper">Some text for help.</div>

                                </div>
                                <div class="action-item">
                                    <input class="settings-checkbox" name="traktPlayback" id="traktPlayback" type="checkbox" <%=(Settings.traktPlayback? "checked='checked'":"")%>>
                                </div>
                            </div>

                            <div class="settings-row advanced">
                                <i class="material-icons">tv</i>
                                <div class="text">
                                    <div class="item-title"><%= i18n.__("Sync With Trakt") %></div>
                                    <div class="helper">Some text for help.</div>

                                </div>
                                <div class="action-item">
                                    <div class="btn syncTrakt" id="syncTrakt">
                                        <i class="fa fa-refresh">&nbsp;&nbsp;</i>
                                        Sync
                                    </div>
                                </div>
                            </div>
                            <% } else { %>
                            <div class="settings-row">
                                <i class="material-icons">tv</i>
                                <div class="text">
                                    <div class="item-title"><%= i18n.__("Connect to %s to automatically 'scrobble' episodes you watch in %s", "Trakt.tv", Settings.projectName) %></div>
                                    <div class="helper">Some text for help.</div>
                                </div>
                                <div class="action-item">
                                    <div class="btn syncTrakt" id="authTrakt">
                                        <i class="fa fa-user-plus">&nbsp;&nbsp;</i>
                                        <%= i18n.__("Connect To %s", "Trakt") %>
                                    </div>
                                    <div id="authTraktCode" style="display:none">
                                        <%= i18n.__("Code:")%>    
                                        <input type="text" size="20" readonly/>
                                    </div>
                                </div>
                            </div>
                            <% } %>
                    </div>
                </div>
            </section>
            <% } %>

            <% if(App.TVShowTime) { %>
            <section id="tvshowtime">
                
                <div class="content">
                    <div class="title">TVShow Time</div>
                    <div class="tvshowtime-options <%= App.TVShowTime.authenticated ? " authenticated" : "" %>">
                        <% if(App.TVShowTime.authenticated) { %>
                            <div class="settings-row">
                                <i class="material-icons">tv</i>
                                <div class="text">
                                    <div class="item-title"><%= i18n.__("You are currently connected to %s", "TVShow Time") %>.</div>
                                    <div class="helper">Some text for help.</div>

                                </div>
                                <div class="action-item">
                                    <a id="disconnect-tvst" class="unauthtext" href="#"><%= i18n.__("Disconnect account") %></a>
                                </div>
                            </div>
                        <% } else { %>
                            <div class="settings-row ">
                                <i class="material-icons">tv</i>
                                <div class="text">
                                    <div class="item-title"><%= i18n.__("Connect To %s", "TVShow Time") %></div>
                                    <div class="helper">Some text for help.</div>

                                </div>
                                <div class="action-item">
                                    <div class="btn" id="connect-with-tvst">
                                    <i class="material-icons">insert_link</i>
                                    Connect
                                </div>
                                <div class="tvst-loading-spinner" style="display: none"></div>
                                </div>
                            </div>
                        <% } %>
                    </div>
                </div>
            </section>
            <% } %>

            <section id="opensubtitles">
                
                <div class="content">
                    <div class="title">OpenSubtitles</div>
                    <div class="opensubtitles-options">
                        <% if(Settings.opensubtitlesAuthenticated) { %>
                            <div class="settings-row">
                                <i class="material-icons">subtitles</i>
                                <div class="text">
                                    <div class="item-title"><%= i18n.__("You are currently connected to %s", "OpenSubtitles") %>.</div>
                                    <div class="helper">Some text for help.</div>

                                </div>
                                <div class="action-item">
                                    <a id="unauthOpensubtitles" class="unauthtext" href="#"><%= i18n.__("Disconnect account") %></a>
                                </div>
                            </div>
                        <% } else { %>
                            <div class="settings-row">
                                <i class="material-icons">subtitles</i>
                                <div class="text">
                                    <div class="item-title"><%= i18n.__("Username") %></div>
                                    <div class="helper">Some text for help.</div>

                                </div>
                                <div class="action-item">
                                    <input type="text" id="opensubtitlesUsername" name="opensubtitlesUsername">
                                    <div class="loading-spinner" style="display: none"></div>
                                    <div class="valid-tick" style="display: none"></div>
                                    <div class="invalid-cross" style="display: none"></div>
                                </div>
                            </div>

                            <div class="settings-row">
                                <i class="material-icons">subtitles</i>
                                <div class="text">
                                    <div class="item-title"><%= i18n.__("Password") %></div>
                                    <div class="helper">Some text for help.</div>

                                </div>
                                <div class="action-item">
                                    <input type="password"  id="opensubtitlesPassword" name="opensubtitlesPassword">
                                </div>
                            </div>

                            <div class="settings-row">
                                <i class="material-icons">subtitles</i>
                                <div class="text">
                                    <div class="item-title"><%= i18n.__("Connect To %s", "OpenSubtitles") %></div>
                                    <div class="helper"><%= i18n.__("%s stores an encrypted hash of your password in your local database", Settings.projectName) %></div>

                                </div>
                                <div class="action-item">
                                    <div class="btn" id="authOpensubtitles">
                                        <i class="material-icons">link</i>
                                        Connect
                                    </div>
                                </div>
                            </div>

                           
                        
                        <% } %>
                        <div class="settings-row advanced">
                            <i class="material-icons">subtitles</i>
                            <div class="text">
                                <div class="item-title"><%= i18n.__("Automatic Subtitle Uploading") %></div>
                                <div class="helper">Some text for help.</div>

                            </div>
                            <div class="action-item">
                                <input class="settings-checkbox" name="opensubtitlesAutoUpload" id="opensubtitlesAutoUpload" type="checkbox" <%=(Settings.opensubtitlesAutoUpload? "checked='checked'":"")%>>
                            </div>
                        </div>
    
                    </div>
                </div>
            </section>
        </div>
        <div role="tabpanel" class="tab-pane" id="settings">
            <section>
                    <div class="content">
                        <div class="settings-row advanced movies-quality">
                            <i class="material-icons">settings_applications</i>
                            <div class="text">
                                <div class="item-title"><%= i18n.__("Only list movies in") %></div>
                                <div class="helper">Some text for help.</div>

                            </div>
                            <div class="action-item">
                                <select name="movies_quality">
                                    <option <%=(Settings.movies_quality == "all"? "selected='selected'":"") %> value="all"><%= i18n.__("All") %></option>
                                    <option <%=(Settings.movies_quality == "1080p"? "selected='selected'":"") %> value="1080p">1080p</option>
                                    <option <%=(Settings.movies_quality == "720p"? "selected='selected'":"") %> value="720p">720p</option>
                                </select>
                                <div class="dropdown-arrow"></div>
                            </div>
                        </div>

                         <div class="settings-row advanced ">
                            <i class="material-icons">settings_applications</i>
                            <div class="text">
                                <div class="item-title"><%= i18n.__("Show movie quality on list") %></div>
                                <div class="helper">Some text for help.</div>

                            </div>
                            <div class="action-item">
                                <input class="settings-checkbox" name="moviesShowQuality" id="cb1" type="checkbox" <%=(Settings.moviesShowQuality? "checked='checked'":"")%>>
                            </div>
                        </div>

                         <div class="settings-row advanced ">
                            <i class="material-icons">settings_applications</i>
                            <div class="text">
                                <div class="item-title"><%= i18n.__("Always start playing in fullscreen") %></div>
                                <div class="helper">Some text for help.</div>

                            </div>
                            <div class="action-item">
                                <input class="settings-checkbox" name="alwaysFullscreen" id="alwaysFullscreen" type="checkbox" <%=(Settings.alwaysFullscreen? "checked='checked'":"")%>>
                            </div>
                        </div>


                         <div class="settings-row advanced ">
                            <i class="material-icons">settings_applications</i>
                            <div class="text">
                                <div class="item-title"><%= i18n.__("Play next episode automatically") %></div>
                                <div class="helper">Some text for help.</div>

                            </div>
                            <div class="action-item">
                                <input class="settings-checkbox" name="playNextEpisodeAuto" id="playNextEpisodeAuto" type="checkbox" <%=(Settings.playNextEpisodeAuto? "checked='checked'":"")%>>
                            </div>
                        </div>


                         <div class="settings-row">
                            <i class="material-icons">settings_applications</i>
                            <div class="text">
                                <div class="item-title"><%= i18n.__("Torrent Collection") %></div>
                                <div class="helper">Some text for help.</div>

                            </div>
                            <div class="action-item">
                                <input class="settings-checkbox" name="activateTorrentCollection" id="activateTorrentCollection" type="checkbox" <%=(Settings.activateTorrentCollection? "checked='checked'":"")%>>
                            </div>
                        </div>


                         <div class="settings-row">
                            <i class="material-icons">settings_applications</i>
                            <div class="text">
                                <div class="item-title"><%= i18n.__("Watchlist") %></div>
                                <div class="helper">Some text for help.</div>

                            </div>
                            <div class="action-item">
                                <input class="settings-checkbox" name="activateWatchlist" id="activateWatchlist" type="checkbox" <%=(Settings.activateWatchlist? "checked='checked'":"")%>>
                            </div>
                        </div>


                         <div class="settings-row">
                            <i class="material-icons">settings_applications</i>
                            <div class="text">
                                <div class="item-title"><%= i18n.__("Randomize Button for Movies") %></div>
                                <div class="helper">Some text for help.</div>

                            </div>
                            <div class="action-item">
                                <input class="settings-checkbox" name="activateRandomize" id="activateRandomize" type="checkbox" <%=(Settings.activateRandomize? "checked='checked'":"")%>>
                            </div>
                        </div>
                        <% if(Settings.tvAPI) { %>
                         <div class="settings-row advanced ">
                            <i class="material-icons">settings_applications</i>
                            <div class="text">
                                <div class="item-title"><%= i18n.__("TV Show API Endpoint") %></div>
                                <div class="helper">Some text for help.</div>

                            </div>
                            <div class="action-item">
                                <input id="tvAPI" type="text" size="50" name="tvAPI" value="<%=Settings.tvAPI[0].url%>">
                                <% if (Settings.tvAPI.length <= 1) { %>
                                &nbsp;&nbsp;<i class="reset-tvAPI fa fa-undo tooltipped" data-toggle="tooltip" data-placement="auto" title="<%= i18n.__('Reset to Default Settings') %>"></i>
                                <% } %>
                            </div>
                        </div>
                        <% } %>

                         <div class="settings-row advanced ">
                            <i class="material-icons">settings_applications</i>
                            <div class="text">
                                <div class="item-title"><%= i18n.__("Connection Limit") %></div>
                                <div class="helper">Some text for help.</div>

                            </div>
                            <div class="action-item">
                                <input id="connectionLimit" type="text" size="20" name="connectionLimit" value="<%=Settings.connectionLimit%>"/>
                            </div>
                        </div>

                         <div class="settings-row advanced ">
                            <i class="material-icons">settings_applications</i>
                            <div class="text">
                                <div class="item-title"><%= i18n.__("Port to stream on") %></div>
                                <div class="helper"><%= i18n.__("0 = Random") %></div>

                            </div>
                            <div class="action-item">
                                <input id="streamPort" type="text" size="20" name="streamPort" value="<%=Settings.streamPort%>"/>
                            </div>
                        </div>

                         <div class="settings-row advanced " id="overallRatio">
                            <i class="material-icons">settings_applications</i>
                            <div class="text">
                                <div class="item-title"><%= i18n.__("Overall Ratio") %></div>
                                <div class="helper"><%= Common.fileSize(Settings.totalDownloaded) %><i class="material-icons">arrow_upward</i><%= Common.fileSize(Settings.totalUploaded) %><i class="material-icons">arrow_downward</i></div>

                            </div>
                            <div class="action-item">
                                <% var overallRatio = function () {
                                var ratio = (Settings.totalUploaded / Settings.totalDownloaded).toFixed(2);
                                isNaN(ratio) ? ratio = i18n.__("None") : ratio;
                                return ratio;
                               }
                            %>
                            <input type="text" size="20" name="overallRatio" value="<%= overallRatio() %>">
                            </div>
                        </div>

                        <div class="settings-row advanced" id="cache">
                            <i class="material-icons">settings_applications</i>
                            <div class="text">
                                <div class="item-title"><%= i18n.__("Cache Directory") %></div>
                                <div class="helper">Some text for help.</div>

                            </div>
                            <div class="action-item">
                                <span>
                                    <input type="text" placeholder="<%= i18n.__("Cache Directory") %>" id="faketmpLocation" value="<%= Settings.tmpLocation %>" readonly="readonly" />
                                    <i class="open-tmp-folder material-icons tooltipped" data-toggle="tooltip" data-placement="auto" title="<%= i18n.__("Open Cache Directory") %>">folder_open</i>
                                    <input type="file" name="tmpLocation" id="tmpLocation" nwdirectory style="display: none;" nwworkingdir="<%= Settings.tmpLocation %>" />
                                </span>
                            </div>
                        </div>

                        <div class="settings-row advanced">
                            <i class="material-icons">settings_applications</i>
                            <div class="text">
                                <div class="item-title"><%= i18n.__("Clear Tmp Folder after closing app?") %></div>
                                <div class="helper">Some text for help.</div>

                            </div>
                            <div class="action-item">
                                <input class="settings-checkbox" name="deleteTmpOnClose" id="cb2" type="checkbox" <%=(Settings.deleteTmpOnClose? "checked='checked'":"")%>>
                            </div>
                        </div>

                        <div class="settings-row advanced" id="database" >
                            <i class="material-icons">settings_applications</i>
                            <div class="text">
                                <div class="item-title"><%= i18n.__("Database Directory") %></div>
                                <div class="helper">Some text for help.</div>

                            </div>
                            <div class="action-item">
                                <span>
                                    <input type="text" placeholder="<%= i18n.__("Database Directory") %>" id="fakedatabaseLocation" value="<%= Settings.databaseLocation %>" readonly="readonly" />
                                    <i class="open-database-folder material-icons tooltipped" data-toggle="tooltip" data-placement="auto" title="<%= i18n.__("Open Database Directory") %>">folder_open</i>
                                    <input type="file" name="fakedatabaseLocation" id="fakedatabaseLocation" nwdirectory style="display: none;" nwworkingdir="<%= Settings.databaseLocation %>" />
                                </span>
                            </div>
                        </div>


                        <div class="settings-row advanced">
                            <i class="material-icons">settings_applications</i>
                            <div class="text">
                                <div class="item-title"><%= i18n.__("Import Database") %></div>
                                <div class="helper">Some text for help.</div>

                            </div>
                            <div class="action-item">
                                <div class="btn database import-database">
                                        <i class="material-icons">file_download</i>
                                        <%= i18n.__("Import Database") %>
                                    </div>
                            </div>
                        </div>

                        <div class="settings-row advanced">
                            <i class="material-icons">settings_applications</i>
                            <div class="text">
                                <div class="item-title"><%= i18n.__("Export Database") %></div>
                                <div class="helper">Some text for help.</div>

                            </div>
                            <div class="action-item">
                                <div class="btn database export-database">
                                        <i class="material-icons">file_upload</i>
                                        <%= i18n.__("Export Database") %>
                                    </div>
                            </div>
                        </div>
                        <div class="settings-row advanced">
                            <i class="material-icons">settings_applications</i>
                            <div class="text">
                                <div class="item-title"><%= i18n.__("When Opening TV Series Detail Jump To") %></div>
                                <div class="helper">Some text for help.</div>

                            </div>
                            <div class="action-item">
                                <%
                                                var tv_detail_jump_to = {
                                                    "firstUnwatched": "First Unwatched Episode",
                                                    "next": "Next Episode In Series"
                                                };

                                                var selected_tv_detail_jump = "";
                                                for(var key in tv_detail_jump_to) {
                                                    selected_tv_detail_jump += "<option "+(Settings.tv_detail_jump_to == key? "selected='selected'":"")+" value='"+key+"'>"+i18n.__(tv_detail_jump_to[key])+"</option>";
                                                }
                                            %>
                                        <select name="tv_detail_jump_to"><%=selected_tv_detail_jump%></select>
                                        <div class="dropdown-arrow"></div>
                            </div>
                        </div>

                        <div class="settings-row advanced">
                            <i class="material-icons">settings_applications</i>
                            <div class="text">
                                <div class="item-title"><%= i18n.__("Activate automatic updating") %></div>
                                <div class="helper">Some text for help.</div>

                            </div>
                            <div class="action-item">
                                <input class="settings-checkbox" name="automaticUpdating" id="cb5" type="checkbox" <%=(Settings.automaticUpdating? "checked='checked'":"")%>>
                            </div>
                        </div>


                        <div class="settings-row advanced">
                            <i class="material-icons">settings_applications</i>
                            <div class="text">
                                <div class="item-title"><%= i18n.__("Celebrate various events") %></div>
                                <div class="helper">Some text for help.</div>

                            </div>
                            <div class="action-item">
                                <input class="settings-checkbox" name="events" id="cb6" type="checkbox" <%=(Settings.events? "checked='checked'":"")%>>
                            </div>
                        </div>

                        <div class="settings-row advanced">
                            <i class="material-icons">settings_applications</i>
                            <div class="text">
                                <div class="item-title"><%= i18n.__("Minimize to Tray") %></div>
                                <div class="helper">Some text for help.</div>

                            </div>
                            <div class="action-item">
                                <input class="settings-checkbox" name="minimizeToTray" id="minimizeToTray" type="checkbox" <%=(Settings.minimizeToTray? "checked='checked'":"")%>>
                            </div>
                        </div>

                        <div class="settings-row advanced">
                            <i class="material-icons">settings_applications</i>
                            <div class="text">
                                <div class="item-title"><%= i18n.__("Big Picture Mode") %></div>
                                <div class="helper">Some text for help.</div>

                            </div>
                            <div class="action-item">
                                <input class="settings-checkbox" name="bigPicture" id="bigPicture" type="checkbox" <%=(Settings.bigPicture? "checked='checked'":"")%>>
                            </div>
                        </div>

                       
                </section>
    
        </div>
      </div>

    </div>

    

    

    
    <div class="btns">
        <div class="btn flush-bookmarks advanced"><%= i18n.__("Flush bookmarks database") %></div>
        <div class="btn flush-subtitles advanced"><%= i18n.__("Flush subtitles cache") %></div>
        <div class="btn flush-databases"><%= i18n.__("Flush all databases") %></div>
        <div class="btn default-settings"><%= i18n.__("Reset to Default Settings") %></div>
    </div>

</div>
