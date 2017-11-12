import * as Phaser from "phaser"
/// <reference path="../node_modules/phaser-ce/typescript/phaser.d.ts">

class SimpleGame {

    constructor() {
        let config = {
            width: 800,
            height: 400,
            renderer: Phaser.AUTO,
            antialias: true,
            multiTexture: true,
            state: {
                preload: this.preload,
                create: this.create,
                update: this.update,
            }
        };
        this.game = new Phaser.Game(config);
    }

    game: Phaser.Game;
    background: Phaser.Sprite;
    capguy: Phaser.Sprite;

    preload() {
        this.game.load.atlas('cityscene', 'assets/cityscene.png', 'assets/cityscene.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    }

    create() {
        // background
        this.background = this.game.add.sprite(0, 0, 'cityscene', 'background');

        // sprite
        this.capguy = this.game.add.sprite(0, 180, 'cityscene', 'capguy/walk/0001');
        this.capguy.scale.setTo(0.5, 0.5);

        // animation
        this.capguy.animations.add('walk', Phaser.Animation.generateFrameNames('capguy/walk/', 1, 8, '', 4), 10, true, false);
        this.capguy.animations.play('walk');
    }

    update() {
        this.capguy.x += 3;
        if (this.capguy.x > 800) {
            this.capguy.x = -50;
        }
    }
}

window.onload = () => {

    new SimpleGame();

};