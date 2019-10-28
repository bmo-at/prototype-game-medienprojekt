import * as Phaser from 'phaser'

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
}

export class GameScene extends Phaser.Scene {

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private player!: any
    private showDebug = false

    constructor() {
        super(sceneConfig)
    }

    public preload() {
        this.load.image("tiles", "../assets/tilesets/tuxmon-sample-32px-extruded.png")
        this.load.tilemapTiledJSON("map", "../assets/tilemaps/tuxemon-town.json")
        this.load.atlas("atlas", "../assets/atlas/atlas.png", "../assets/atlas/atlas.json")
    }

    public create() {
        const map = this.make.tilemap({ key: "map" })
        const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles")

        const belowLayer = map.createStaticLayer("Below Player", tileset, 0, 0)
        const worldLayer = map.createStaticLayer("World", tileset, 0, 0)
        const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0)

        worldLayer.setCollisionByProperty({ collides: true })
        aboveLayer.setDepth(10)
        const spawnPoint: any = map.findObject("Objects", obj => obj.name === "Spawn Point")
        this.player = this.physics.add
            .sprite(spawnPoint.x!, spawnPoint.y!, "atlas", "misa-front")
            .setSize(30, 40)
            .setOffset(0, 24)

        this.physics.add.collider(this.player, worldLayer)

        const anims = this.anims
        anims.create({
            key: "misa-left-walk",
            frames: anims.generateFrameNames("atlas", {
                prefix: "misa-left-walk.",
                start: 0,
                end: 3,
                zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        })
        anims.create({
            key: "misa-right-walk",
            frames: anims.generateFrameNames("atlas", {
                prefix: "misa-right-walk.",
                start: 0,
                end: 3,
                zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        })
        anims.create({
            key: "misa-front-walk",
            frames: anims.generateFrameNames("atlas", {
                prefix: "misa-front-walk.",
                start: 0,
                end: 3,
                zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        })
        anims.create({
            key: "misa-back-walk",
            frames: anims.generateFrameNames("atlas", {
                prefix: "misa-back-walk.",
                start: 0,
                end: 3,
                zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        })

        const camera = this.cameras.main
        camera.startFollow(this.player)
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

        this.cursors = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.UP, 'down': Phaser.Input.Keyboard.KeyCodes.DOWN, 'left': Phaser.Input.Keyboard.KeyCodes.LEFT, 'right': Phaser.Input.Keyboard.KeyCodes.RIGHT })

        this.input.keyboard.once("keydown_D", () => {
            this.physics.world.createDebugGraphic()
            const graphics = this.add
                .graphics()
                .setAlpha(0.75)
                .setDepth(20)
            worldLayer.renderDebug(graphics, {
                tileColor: null,
                collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
                faceColor: new Phaser.Display.Color(40, 39, 37, 255)
            })
        })
    }

    public update() {
        const speed = 175;
        const prevVelocity = this.player.body.velocity.clone();

        this.player.body.setVelocity(0);

        if (this.cursors.left!.isDown) {
            this.player.body.setVelocityX(-speed);
        } else if (this.cursors.right!.isDown) {
            this.player.body.setVelocityX(speed);
        }

        if (this.cursors.up!.isDown) {
            this.player.body.setVelocityY(-speed);
        } else if (this.cursors.down!.isDown) {
            this.player.body.setVelocityY(speed);
        }

        this.player.body.velocity.normalize().scale(speed);

        if (this.cursors.left!.isDown) {
            this.player.anims.play("misa-left-walk", true);
        } else if (this.cursors.right!.isDown) {
            this.player.anims.play("misa-right-walk", true);
        } else if (this.cursors.up!.isDown) {
            this.player.anims.play("misa-back-walk", true);
        } else if (this.cursors.down!.isDown) {
            this.player.anims.play("misa-front-walk", true);
        } else {
            this.player.anims.stop();

            if (prevVelocity.x < 0) this.player.setTexture("atlas", "misa-left");
            else if (prevVelocity.x > 0) this.player.setTexture("atlas", "misa-right");
            else if (prevVelocity.y < 0) this.player.setTexture("atlas", "misa-back");
            else if (prevVelocity.y > 0) this.player.setTexture("atlas", "misa-front");
        }
    }
}

const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Medienprojekt Phaser Skunkworks',

    type: Phaser.WEBGL,

    width: window.innerWidth,
    height: window.innerHeight,

    physics: {
        default: 'arcade'
    },

    parent: 'game',
    backgroundColor: '0xFFFFFF',
    scene: GameScene
}

export const game = new Phaser.Game(gameConfig)