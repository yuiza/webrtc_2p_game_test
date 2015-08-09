
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

		if(game.paused){
			startGame();
			titleText.text = '';
		}
	}

	var _dataPool = new DataPool();

	recv.on('data', function(data){
		//command -> DataPool
		if(data.type === 'locate'){
			_dataPool.setx(data.x);
			_dataPool.sety(data.y);
			_dataPool.setcom(data.c);
		}else if(data.type === 'score'){
			p2score = data.s;
		}
	});
});


//共有アクセスクラス
var DataPool = (function(){
	var x;
	var y;
	var command;
	var score;

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

	DataPool.prototype.gets = function(){
		return score;
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

	DataPool.prototype.sets = function(c){
		score = c;
	};

	return DataPool;
})();


//Game
var player;
var player2;
var cursors;
var stars;
//var star;
var limitTime;
var platforms;
var enemyCommand;
var PlayerCommand;

var p1score = 0;
var p2score = 0;

var p1scoreText;
var p2scoreText;

var titleText;

function preload() {
	"use strict";

	game.load.image('sky', 'images/sky.png');
	game.load.image('ground', 'images/platform.png');
	game.load.image('step', 'images/step.png')
	game.load.image('star', 'images/star.png');
	game.load.spritesheet('dude', 'images/dude.png', 32, 48);
	game.load.spritesheet('dude2', 'images/dude2.png', 32, 48);
}

function create() {
	"use strict";


	//set limit time
	limitTime = 0;
	//set keyboard
	cursors = game.input.keyboard.createCursorKeys();

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
	
	p1scoreText = game.add.text(16, 16, 'Player1 score: 0', { fontSize: '32px', fill: '#000' });
	p2scoreText = game.add.text(game.world.width * 0.65, 16, 'Player2 score: 0', { fontSize: '32px', fill: '#000' });

	titleText = game.add.text(game.world.width * 0.4, game.world.height/2, '', { fontSize: '32px', fill: '#345' });


	//星
	stars = game.add.group();
	stars.enableBody = true;


	//platformsグループに張り出し(ledge)を追加
	// var ledge = platforms.create(400, 400, 'ground');
	// ledge.body.immovable = true;

	var ledge = platforms.create(-150, 180, 'ground');
	ledge.body.immovable = true;

	ledge = platforms.create(game.world.width * 0.75, 400, 'ground');
	ledge.body.immovable = true

	ledge = platforms.create(game.world.width /2 - 50, game.world.height * 0.6, 'step');
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

	for (var i = 0; i < 15; i++){
		createStar(i * 56);
	}

}

function update() {
	"use strict";

	if(!conn){
		stopGame();
		titleText.text = 'Player wait...';
	}

	//playerとplatformの衝突判定
	game.physics.arcade.collide(player, platforms);
	game.physics.arcade.collide(player2, platforms);

	game.physics.arcade.collide(stars, platforms);
	game.physics.arcade.overlap(player, stars, p1Star, null, this);
	game.physics.arcade.overlap(player2, stars, p2Star, null, this);


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
}

var ememyControl = function() {
	var x = enemyCommand.getx();
	var y = enemyCommand.gety();
	var c = enemyCommand.getcom();
	var s = enemyCommand.gets();

	// if(player2.body.touching.down){
	// 	player2.body.velocity.x = 0;
	// }

	player2.body.x = x;
	player2.body.y = y;

	player2.frame = c;

};

function createStar(x){
	var star = stars.create(x, 0, 'star');
	star.body.gravity.y = 300;
	star.body.bounce.y = 0.6 + Math.random() *0.2;
}


function p1Star(player, star){
	"use strict";
	star.kill();
	createStar(Math.floor(Math.random() * 12) *56);
	p1score += 10;
	p1scoreText.text = 'Player1 Score: ' + p1score;

	conn.send({
		type: 'score',
		s: p1score, 
	});

	if(p1score === 100){
		gameEnd('player1');
	}
}

function p2Star(player2, star){
	"use strict";
	star.kill();
	createStar(Math.floor(Math.random() * 12) *56);
	//p2score += 10;
	p2scoreText.text = 'Player2 Score: ' + p2score;

	if(p2score === 100){
		gameEnd('player2');
	}

}

function stopGame(){
	game.paused = true;
}

function startGame(){
	game.paused = false;
}

function gameEnd(p){
	setTimeout(function(){
		conn.send({
			type: 'score',
			s: p1score, 
		});
	},0);
	var player = p;
	stopGame();
	titleText.text = 'Winner [ ' + player + ' ]';
}

