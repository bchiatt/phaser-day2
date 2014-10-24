var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var content = [
    " ",
    "unicorns are epic",
    "but no one knew why",
    "or where they came from",
    " ",
    "until now",
    " ",
    "click button to find out",
];

function preload(){
  game.load.spritesheet('button', '/assets/buttons/button_sprite_sheet.png', 193, 71);
  game.load.spritesheet('boom', '/assets/misc/explode1.png', 128, 128);
  game.load.image('background','/assets/demoscene/pink-raster.png');
  game.load.image('smoke','/assets/sprites/spinObj_03.png');
  game.load.image('wabbit','/assets/sprites/wabbit.png');
  game.load.atlasJSONHash('bot', '/assets/sprites/running_bot.png', '/assets/sprites/running_bot.json');
  game.load.audio('runPast', '/assets/audio/SoundEffects/explode1.wav');
}

var button, background, wabbit, bot, bot2, botTween, bot2Tween, botReset, bot2Reset, fx, boom, emitter, text,
    index = 0,
    line = '';

function create(){
  game.physics.startSystem(Phaser.Physics.ARCADE);

  game.stage.backgroundColor = '#182d3b';
  background = game.add.tileSprite(0, 0, 800, 600, 'background');

  fx = game.add.audio('runPast', 1, false);

  button = game.add.button(30, 180, 'button', actionOnClick, this, 2, 1, 0);
  button.onInputOver.add(over, this);
  button.onInputOut.add(out, this);

  bot = game.add.sprite(840, 540, 'bot');
  bot2 = game.add.sprite(-60, 600, 'bot');
  wabbit = game.add.sprite(840, 540, 'wabbit');

  game.physics.enable([bot, bot2], Phaser.Physics.ARCADE);

  bot.body.bounce.x = 1;
  bot.animations.add('run');
  bot.animations.play('run', 15, true);
  botReset = game.add.tween(bot);
  botReset.to({ x: 840 }, 1);


  bot2.body.bounce.x = 1;
  bot2.anchor.setTo(0.5, 1);
  bot2.scale.x = -1;
  bot2.animations.add('run');
  bot2.animations.play('run', 15, true);
  bot2Reset = game.add.tween(bot2);
  bot2Reset.to({ x: -60 }, 1);

  emitter = game.add.emitter(0, 0, 100);
  emitter.makeParticles('smoke');
  emitter.gravity = -100;
  emitter.x = 400;
  emitter.y = 580;

  text = game.add.text(30, 80, '', { font: "30pt Courier", fill: "#ffffff", stroke: "#119f4e", strokeThickness: 4 });

  nextLine();
}

function update(){
  game.physics.arcade.collide(bot, bot2, collisionHandler, null, this);
}

function over() {
  console.log('button over');
}

function out() {
  console.log('button out');
}

function actionOnClick(){
  if(!bot.body.gravity.x){
    bot.body.gravity.x = -400;
    bot2.body.gravity.x = 400;
    bot.body.velocity.x = -200;
    bot2.body.velocity.x = 200;
  }else{
    bot.body.gravity.x = null;
    bot2.body.gravity.x = null;
    bot.body.velocity.x = null;
    bot2.body.velocity.x = null;
    botReset.start();
    bot2Reset.start();
    startWabbitHop();
  }
}

function updateLine(){
  if (line.length < content[index].length){
    line = content[index].substr(0, line.length + 1);
    // text.text = line;
    text.setText(line);
  }else{
    //  Wait 2 seconds then start a new line
    game.time.events.add(Phaser.Timer.SECOND * 1, nextLine, this);
  }
}

function collisionHandler(){
  fx.play('');

  emitter.start(true, 5000, null, 30);

  boom = game.add.sprite(400, 540, 'boom');
  boom.animations.add('explode');
  boom.anchor.setTo(0.5, 0.5);
  boom.scale.setTo(3);
  boom.animations.play('explode', 20, false);
  clear = game.add.tween(boom.alpha);
  clear.to(0, 1, Phaser.Easing.Linear.None);
  console.log('boom');
}

function nextLine() {
  index++;

  if (index < content.length){
    line = '';
    game.time.events.repeat(80, content[index].length + 1, updateLine, this);
  }
}

function startWabbitHop(){
  var wabbitHop = game.add.tween(wabbit);

  wabbitHop.to({ x: game.world.width / 2 }, 1000 + Math.random() * 3000, Phaser.Easing.Bounce.In);
  //wabbitHop.onComplete.add(startBounceTween, this);
  wabbitHop.start();
}
