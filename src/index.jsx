import React from 'react';

let ListItem = (props) => (<li>
    {props.children}
</li>)

let List = (props) => <div>
    <ul>
        {this.props.items.map((it, k) => {
             let ItemComponent = props.itemComponent;
             <ItemComponent {...props} key={k} >{it}</ItemComponent>
         })}
    </ul>
</div>;

export default List;
