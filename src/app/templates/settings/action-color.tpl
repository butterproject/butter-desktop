<input class="colorsub" id="<%= id %>" type="color" size="7" name="<%= id %>" value="<%= value %>" list="<%= id %>_colors">
<datalist id="<%= id %>_colors">
    <% options.map(function (o) { %>
    <option><%= o %></option>
    <% }) %>
</datalist>
