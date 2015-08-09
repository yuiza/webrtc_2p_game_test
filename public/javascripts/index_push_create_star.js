
//webrtc
var peer;
var conn;
var roomId = document.getElementById("create").value;
var join = document.getElementById("join").value;

if(roomId)
	peer = new Peer(roomId, { key: 'gj6od1nfegtoi529', debug: 3, config: { 'iceServers': [ {url: 'stun:stun.l.google.com:19302'} ] } });

if(join)
	peer = new Peer({ key: 'gj6od1nfegtoi529', debug: 3, config: { 'iceServers': [ {url: 'stun:stun.l.google.com:19302'} ] } });


var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });




//指定IDでWebRTC
peer.on('open', function(id){
	console.log('my id', id);
});

//受信
peer.on('connection', function receiver(recv){
	"use strict";

	if(!conn){
		conn = peer.connect(recv.peer);
	}

	var _dataPool = new DataPool();

	recv.on('data', function(data){
		//command -> DataPool
		if(data.type === 'locate'){
			_dataPool.setx(data.x);
			_dataPool.sety(data.y);
			_dataPool.setcom(data.c);
		}
	});
});


//共有アクセスクラス
var DataPool = (function(){
	var x;
	var y;
	var command;

	function DataPool(){};

	DataPool.prototype.getx = function(){
		return x;
	};

	DataPool.prototype.gety = function(){
		return y;
	};

	DataPool.prototype.getcom = function(){
		return command;
	};


	DataPool.prototype.setx = function(c){
		x = c;
	};

	DataPool.prototype.sety = function(c){
		y = c;
	};

	DataPool.prototype.setcom = function(c){
		command = c;
	};

	return DataPool;
})();


//Game
var player;
var player2;
var cursors;
var space;
var stars;
var diams;
var star;
var diam;
var limitTime;
var platforms;
var enemyCommand;
var PlayerCommand;

function preload() {
	"use strict";

	game.load.image('sky', 'images/sky.png');
	game.load.image('ground', 'images/platform.png');
	game.load.image('star', 'images/star.png');
	game.load.image('diam', 'images/diamond.png');
	game.load.spritesheet('dude', 'images/dude.png', 32, 48);
	game.load.spritesheet('dude2', 'images/dude2.png', 32, 48);
}

function create() {
	"use strict";


	//set limit time
	limitTime = 0;
	//set keyboard
	cursors = game.input.keyboard.createCursorKeys();
	//set Space key
	space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


	//set Data(command) pool
	enemyCommand = new DataPool();

	//物理エンジンON
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	//背景
	game.add.sprite(0,0,'sky');

	//プラットフォームグループ生成
	platforms = game.add.group();

	//プラットフォームオブジェクトはすべて物理エンジンON
	platforms.enableBody = true;

	//プラットフォームグループに地面追加
	var ground = platforms.create(0, game.world.height - 64, 'ground');
	//地面のサイズをゲーム幅にフィット
	ground.scale.setTo(2,2);
	//地面固定
	ground.body.immovable = true;
	

	//星
	stars = game.add.group();
	stars.enableBody = true;
	stars.physicsBodyType = Phaser.Physics.ARCADE;
	stars.createMultiple(32, 'star');
	// stars.setAll('anchor.x', 0);
	// stars.setAll('anchor.y', 0);
	// stars.setAll('outOfBoundsKill', true);
	// stars.setAll('checkWorldBounds', true);

	//ダイヤ
	diams = game.add.group();
	diams.enableBody = true;
	diams.physicsBodyType = Phaser.Physics.ARCADE;
	diams.createMultiple(32, 'diams');
	// diams.setAll('anchor.x', 0);
	// diams.setAll('anchor.y', 0);
	// dimas.setAll('outOfBoundsKill', true);
	// dimas.setAll('checkWorldBounds', true);


	//platformsグループに張り出し(ledge)を追加
	var ledge = platforms.create(400, 400, 'ground');
	ledge.body.immovable = true;

	ledge = platforms.create(-150, 250, 'ground');
	ledge.body.immovable = true;


	if(roomId){
		//Player
		player = game.add.sprite(32, game.world.height - 150, 'dude');

		game.physics.arcade.enable(player);

		player.body.bounce.y = 0.2;
		player.body.gravity.y = 300;
		player.body.collideWordBounds = true;

		player.animations.add('left', [0,1,2,3], 10, true);
		player.animations.add('right', [5,6,7,8], 10, true);


		//player2
		player2 = game.add.sprite(game.world.width - 64, game.world.height - 150, 'dude2');

		game.physics.arcade.enable(player2);

		player2.body.bounce.y = 0.2;
		player2.body.gravity.y = 300;
		player2.body.collideWordBounds = true;

		player2.animations.add('left', [0,1,2,3], 10, true);
		player2.animations.add('right', [5,6,7,8], 10, true);

		enemyCommand.setx(game.world.width - 64);
		enemyCommand.sety(game.world.height - 150)

	}else if(join){
		//Player2
		player2 = game.add.sprite(32, game.world.height - 150, 'dude');

		game.physics.arcade.enable(player2);

		player2.body.bounce.y = 0.2;
		player2.body.gravity.y = 300;
		player2.body.collideWordBounds = true;

		player2.animations.add('left', [0,1,2,3], 10, true);
		player2.animations.add('right', [5,6,7,8], 10, true);


		//player
		player = game.add.sprite(game.world.width - 64, game.world.height - 150, 'dude2');

		game.physics.arcade.enable(player);

		player.body.bounce.y = 0.2;
		player.body.gravity.y = 300;
		player.body.collideWordBounds = true;

		player.animations.add('left', [0,1,2,3], 10, true);
		player.animations.add('right', [5,6,7,8], 10, true);

		enemyCommand.setx(32);
		enemyCommand.sety(game.world.height - 150)

		if(join){
			conn = peer.connect(join);
		}
	}

}

function update() {
	"use strict";

	//playerとplatformの衝突判定
	game.physics.arcade.collide(player, platforms);
	game.physics.arcade.collide(player2, platforms);

	game.physics.arcade.collide(stars, platforms);
	game.physics.arcade.overlap(player, stars, bumpStar, null, this);



	game.physics.arcade.collide(diams, platforms);
	game.physics.arcade.overlap(player2, diams, bumpDiam, null, this);


	ememyControl();

	//playerの移動速度リセット
	if(player.body.touching.down){
		player.body.velocity.x = 0;
	}

	cursors = game.input.keyboard.createCursorKeys();

	if(player.body.x < 800 -32 && player.body.x > 5){
		if(cursors.left.isDown){
			//左
			player.body.velocity.x = -150;
			player.animations.play('left');

			if(conn){
				conn.send({
					type: 'locate',
					x: player.body.x,
					y: player.body.y,
					c: player.frame
				});
			}
		}else if(cursors.right.isDown){
			
			//右
			player.body.velocity.x = 150;
			player.animations.play('right');
			if(conn){
				conn.send({
					type: 'locate',
					x: player.body.x,
					y: player.body.y,
					c: player.frame
				});
			}
		}else{
			
			//そのまま
			player.animations.stop();

			if(player.animations.name === 'left'){
				player.frame = 0;
			}else{
				player.frame = 5;
			}

			if(conn){
				conn.send({
					type: 'locate',
					x: player.body.x,
					y: player.body.y,
					c: player.frame
				});
			}
		}
	}else if(player.body.x > 800 -32 || player.body.x === 800-32 && player.body.x > 20){
		player.body.x = 800 -33;
		player.animations.stop();
	}else if(player.body.x < 5 || player.body.x == 5){
		player.body.x = 6;
		player.animations.stop();
	}

	//上矢印キー && プレイヤー地面 is Jump
	if(cursors.up.isDown && player.body.touching.down){
		
		player.body.velocity.y = -350;

		if(conn){
			conn.send({
				type: 'locate',
				x: player.body.x,
				y: player.body.y,
			});
		}
	}

	//Pushed spacekey create star
	if(space.isDown){
		if(game.time.now > limitTime && stars.total < 5){
			star = stars.getFirstExists(false);
			if(star){
				if(player.animations.name === 'left'){
					star.reset(player.body.x + 32 , player.body.y);
					star.body.velocity.y = player.body.y;
				}else if(player.animations.name === 'right'){
					star.reset(player.body.x - 32, player.body.y);
					star.body.velocity.y = player.body.y;
				}
				limitTime = game.time.now + 300;
			}

			if(conn){
				conn.send({
					type: 'locate',
					command: 'S'
				});
			}
		}
	}

}

var ememyControl = function() {
	var x = enemyCommand.getx();
	var y = enemyCommand.gety();
	var c = enemyCommand.getcom();


	// if(player2.body.touching.down){
	// 	player2.body.velocity.x = 0;
	// }

	player2.body.x = x;
	player2.body.y = y;

	if(c !== 'S')
		player2.frame = c;

	// Pushed spacekey create star
	if(c === 'S'){
		diam = stars.getFirstExists(false);
		console.log(player2.animations.name);
		if(diam){
			if(player2.frame < 4){
				diam.reset(player2.body.x + 32 , player2.body.y);
				diam.body.velocity.y = player2.body.y;
			}else if(plaer2.frame > 4){
				diam.reset(player2.body.x - 32, player2.body.y);
				diam.body.velocity.y = player2.body.y;
			}
		}
	}

};

function bumpStar(p, o){
	"use strict";
	star.kill();
}
function bumpDiam(p, o){
	"use strict";
	diam.kill();
}
