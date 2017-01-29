<div class="settings-container">
    <div class="success_alert" style="display:none"><%= i18n.__("Saved") %>&nbsp;<i class="material-icons">check</i></div>
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
                <div class="toolbar-settings"></div>
            </ul>
        </div>
    </div>
    <script>
        $('#myTabs a').click(function (e) {
      e.preventDefault()
      $(this).tab('show')
    })
    </script>
    <div id="qrcode-overlay"></div>
    <div id="qrcode-modal" style="display:none;">
        <i class="material-icons" id="qrcode-close">close</i>
        <canvas id="qrcode" width="200" height="200"></canvas>
    </div><!-- /.modal -->

     <!-- Nav tabs -->
     <div class="navbar-s">
         <ul id="myTabs" class="nav nav-tabs" role="tablist">
             <% App.Model.Settings.Collection.map(function (e, i) { %>
             <li  class="source" href="#<%= e.id %>" aria-controls="<%= e.id %>" role="tab" data-toggle="tab"><%= i18n.__(e.get('title')) %></li>
             <% }) %>
          </ul>
      </div>

      <!-- Tab panes -->
      <div class="tab-content-wrapper"></div>

      <div class="btns">
          <div class="btn flush-bookmarks advanced"><%= i18n.__("Flush bookmarks database") %></div>
          <div class="btn flush-subtitles advanced"><%= i18n.__("Flush subtitles cache") %></div>
          <div class="btn flush-databases"><%= i18n.__("Flush all databases") %></div>
          <div class="btn default-settings"><%= i18n.__("Reset to Default Settings") %></div>
      </div>
</div>
