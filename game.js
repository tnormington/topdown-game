var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});

var player;
var keyboardInput;
var controls;
var barriers;
var bullets;
var targets;

var score = 0;

function preload() {
    game.load.image('minion', 'images/minion.png');
    game.load.image('zombie', 'images/zombie.png');
    game.load.image('aimer', 'images/aimer.png');
    game.load.image('background', 'images/background.png');
    game.load.image('l_block', 'images/L_block.png');
    game.load.image('bullet', 'images/bullet.png');
    game.load.image('target', 'images/target_small.png');
    game.load.image('circle_aimer_large', 'images/circle_aimer_large.png');
}

function create() {
    game.add.tileSprite(0, 0, 2000, 2000, 'background');
    game.world.setBounds(0, 0, 2000, 2000);
    game.physics.startSystem(Phaser.Physics.ARCADE);


    bullets = game.add.group();
    game.physics.arcade.enable(bullets);
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(50, 'bullet');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);


    monsters = game.add.group();
    monsters.enableBody = true;
    monsters.physicsBodyType = Phaser.Physics.ARCADE;
    var monster1 = monsters.create(1000, 250, 'zombie');
    var healthBar = new Phaser.Rectangle(monster1.x + 10, monster1.y + 10, monster1.x + 50, monster1.y + 20);


    barriers = game.add.group();
    barriers.enableBody = true;
    var barrier1 = barriers.create(275, 275, 'l_block');
    barrier1.body.immovable = true;


    player = game.add.sprite(game.world.centerX, game.world.centerY, 'zombie');
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.anchor.set(0.5);
    game.camera.follow(player);


    targets = game.add.group();
    targets.enableBody = true;
    targets.physicsBodyType = Phaser.Physics.ARCADE;
    targets.setAll('checkWorldBounds', true);
    var target1 = targets.create(1500, 250, 'target');
    target1.body.immovable = true;
    target1.body.setCircle(34.5);



    controls = {
      up: game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: game.input.keyboard.addKey(Phaser.Keyboard.D),

      q: game.input.keyboard.addKey(Phaser.Keyboard.Q),
    };

    controls.q.processKeyDown = function() {
        console.log('q clicked');
        $('body').addClass('targeting');
    };
}

function update() {
    game.physics.arcade.collide(player, barriers);
    game.physics.arcade.collide(player, targets);
    game.physics.arcade.overlap(bullets, targets, handleCollision);
    targets.onOutOfBounds = function() {
        console.log('out of bounds');
    };


    // Slowly stop the player movement
    player.body.velocity.x = player.body.velocity.x/1.25;
    player.body.velocity.y= player.body.velocity.y/1.25;
    player.rotation = game.physics.arcade.angleToPointer(player);





    var playerSpeed = 600;

    if(controls.left.isDown) {
        player.body.velocity.x = -playerSpeed;
    }
    if(controls.right.isDown) {
        player.body.velocity.x = playerSpeed;
    }
    if(controls.up.isDown) {
        player.body.velocity.y = -playerSpeed;
    }
    if(controls.down.isDown) {
        player.body.velocity.y = playerSpeed;
    }

    // Shoot bullets
    if (game.input.activePointer.isDown)
    {
        fire();
    }


}

var fireRate = 300;
var nextFire = 0;

function fire() {

    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstDead();

        bullet.reset(player.x - 8, player.y - 8);

        game.physics.arcade.moveToPointer(bullet, 600);
    }

}


function updateScore(score) {
    var $score = $('#score');
    $score.text(score);
}

function handleCollision(bullet, target) {
    console.log('target hit!');
    bullet.kill();
    score++;
    updateScore(score);
}
