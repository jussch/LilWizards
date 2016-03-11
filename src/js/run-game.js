/**
 * Created by Justin on 2016-02-24.
 */
'use strict';
import $ from 'jquery';
import { GlobalSL } from './utilities/sound_library';
import Players from './base/players';
import Player from './base/player';
import GameView from './game/game_view';
import Game from './game/game';
import Sprite from './base/sprite';

const songs = [
  'Castlemania.mp3',
  'Full-Circle.mp3',
  'battle.mp3',
];

const backgrounds = {
  Library: require('graphics/bg_bookcase.jpg'),
  Cemetery: require('graphics/bg-cemetery.png'),
  Boarwarts: require('graphics/bg_boarwarts.jpg'),
  Spikes: require('graphics/bg_boarwarts.jpg'),
};

export default function runGame(selectedLevel, nlevel, isDemo) {
  GlobalSL.playSE('menu-select.ogg', 100);
  document.getElementById('menu');

  $('.main-menu').addClass('hidden');

  var song = songs[Math.floor(songs.length * Math.random())];
  GlobalSL.playBGM(song);
  var fgcanvas = document.getElementById('game-fg-canvas');
  var fgctx = fgcanvas.getContext('2d');
  var bgcanvas = document.getElementById('game-bg-canvas');
  var bgctx = bgcanvas.getContext('2d');
  var game = new Game({
    level: selectedLevel,
    background: backgrounds[nlevel],
  });

  if (Players.length === 1) {
    Players.push(new Player({
      controllerType: 'computer',
      controllerIndex: 0,
      spellList: Player.randomSpellList(),
      wizardGraphic: Sprite.WIZARDS[0],
    }));
    Players.push(new Player({
      controllerType: 'computer',
      controllerIndex: 1,
      spellList: Player.randomSpellList(),
      wizardGraphic: Sprite.WIZARDS[0],
    }));
    Players.push(new Player({
      controllerType: 'computer',
      controllerIndex: 2,
      spellList: Player.randomSpellList(),
      wizardGraphic: Sprite.WIZARDS[0],
    }));
    Players.slice(1).forEach(function (player) {
      player.nextSprite(1);
    });
  }

  for (var i = 0; i < Players.length; i++) {
    game.wizards.push(Players[i].makeWizard({
      game: game,
    }));
  }

  var gameView = new GameView(bgctx, fgctx, game);
  gameView.isDemo = isDemo;
  gameView.startGame();
  bgm.play();
}
