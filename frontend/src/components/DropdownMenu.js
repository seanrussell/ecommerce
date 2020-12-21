import React, { Component } from 'react'

class DropdownMenu extends Component {
    getMenuItem = (menuItem, depthLevel, index) => {
        let link = '/category/' + menuItem.id;
        if (menuItem.submenu && menuItem.submenu.length > 0) {
            return (
                <li key={menuItem.id}>
                  <a href={link}>{menuItem.title} <span className="drop-icon">{depthLevel > 0 ? (<i class="fas fa-caret-right"></i>): (<i class="fas fa-caret-down"></i>)}</span><label title="Toggle Drop-down" className="drop-icon" for={menuItem.id}><i class="fas fa-caret-down"></i></label></a> <input type="checkbox" id={menuItem.id}></input>
                  <DropdownMenu config={menuItem.submenu} submenu={true} depthLevel={++depthLevel} />
                </li>
            );
        } else {
          return <li key={menuItem.id}><a href={link}>{menuItem.title}</a></li>;
        }
      };
    
      render = () => {
        let { config, depthLevel } = this.props;
    
        let options = [];
        config.map((item, index) => {
          options.push(this.getMenuItem(item, depthLevel || 0, index));
        });
    
        if (this.props.submenu && this.props.submenu === true)
          return <ul className="sub-menu">{options}</ul>;
    
        return <div className="category-menu-wrapper"><div className="container"><nav id="menu"><label for="tm" id="toggle-menu">Categories <span class="drop-icon"><i class="fas fa-caret-down"></i></span></label><input type="checkbox" id="tm"/><ul className="category-menu main-menu">{options}</ul></nav></div></div>;
      };
}

export default DropdownMenu;
