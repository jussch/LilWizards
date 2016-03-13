/**
 * Created by Justin on 2016-02-29.
 */
'use strict';
require('styles/menu/main');

import _ from 'lodash';
import React, { Component } from 'react';
import TopComponent from './Top';
import SettingsComponent from './Settings';
import CharacterComponent from './Character';
import LevelsComponent from './Levels';

class Main extends Component {
  render() {
    const menu = this.props.menu.last();
    const layerName = menu.get('layerName');
    const menuProps = {
      menu: menu,
      characters: this.props.characters,
    };

    let menuToRender;
    if (layerName === 'top') {
      menuToRender = <TopComponent {...menuProps} />;
    } else if (layerName === 'settings') {
      menuToRender = <SettingsComponent {...menuProps} />;
    } else if (layerName === 'character') {
      menuToRender = <CharacterComponent {...menuProps} />;
    } else if (layerName === 'levels') {
      menuToRender = <LevelsComponent {...menuProps} />;
    }

    return (
      <div className="main">
        {menuToRender}
      </div>
    );
  }
}

export default Main;
