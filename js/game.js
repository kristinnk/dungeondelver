var FPS;
var canvasElement;
var canvas;

var room_tree = [];
var enemy_list = [];
var new_section = 0;

var logo = 0;

var gameRunning = false;
var showAbout = false;
var menu_selection = 0;
var menu_selection_delay = 2;
var menu_delay_counter = 0;

var camera = {
  x: 0,
  y: 0,
  width: 800,
  height: 600,
  offset_x: 0,
  offset_y: 0
};

var box = {
  x: 0,
  y: 0,
  width: 32,
  height: 32
}

var player_box = {
  x: 0,
  y: 0,
  width: 32,
  height: 32
}

function spawn_a_new_enemy() {
  var number_of_rooms = map.room_item_list.length;
  var chosen_room = Math.floor(Math.random()*number_of_rooms)
  var spawn_room = map.room_item_list[chosen_room];  
  var spawn_point = { x: (spawn_room.x*32) + (Math.floor(spawn_room.width*32)/2),
                      y: (spawn_room.y*32) + (Math.floor(spawn_room.height*32)/2) };
  enemy_list.push(enemy({
    x: spawn_point.x,
    y: spawn_point.y
  }));
  enemy_list[enemy_list.length-1].load_sprite();
}

function spawn_player() {
  var number_of_rooms = map.room_item_list.length;
  var chosen_room = Math.floor(Math.random()*number_of_rooms)
  var spawn_room = map.room_item_list[chosen_room];  
  var spawn_point = { x: -(spawn_room.x*32) + (Math.floor(spawn_room.width*32)/2),
                      y: -(spawn_room.y*32) + (Math.floor(spawn_room.height*32)/2) };
  camera.x = spawn_point.x; 
  camera.y = spawn_point.y;   
  console.log("x:", spawn_point.x);
  console.log("y:", spawn_point.y);
}

function draw() {
if (gameRunning) {
    canvas.save();
    canvas.fillStyle = "#000000";
    canvas.fillRect(0, 0, canvasElement.width, canvasElement.height);    
    map.draw();    
    canvas.translate(400, 300);
    player.draw();  
    canvas.restore();        
    for (var i = 0; i < enemy_list.length; i++) {
      enemy_list[i].draw();
    }    
    map.draw_line_of_sight();
    canvas.drawImage(misc_sprites.user_interface, 0, 476); // temporary user interface placeholder
    if (text_duration_counter < 40) {
      drawText(canvas, 432, 280, "Oh no!");
    }
    if (text_duration_counter < 120 && text_duration_counter > 40) {
     drawText(canvas, 432, 280, "I am lost!"); 
    }
    if (text_duration_counter < 240 && text_duration_counter > 140) {
     drawText(canvas, 432, 280, "Wait! What was that sound?"); 
    }
  } else if (gameRunning == false && showAbout == false){ // Menu time    
    canvas.fillStyle = "#000000";
    canvas.fillRect(0, 0, canvasElement.width, canvasElement.height);    
    for (var i = 0; i < 25; i++) {
      for (var j = 0; j < 19; j++) {
        canvas.drawImage(env_textures.rock_walls_dark, 0, 0, 32, 32, i*32, j*32, 32, 32);
      }
    }
    canvas.drawImage(misc_sprites.logo, 0, 0, 128, 64, 336, 160, 128, 64);
    switch(menu_selection) {
      case 0: canvas.drawImage(misc_sprites.new_game_selected, 0, 0, 128, 32, 336, 250, 128, 32);
              canvas.drawImage(misc_sprites.about_normal, 0, 0, 128, 32, 336, 290, 129, 32);
              break;
      case 1: canvas.drawImage(misc_sprites.new_game_normal, 0, 0, 128, 32, 336, 250, 128, 32);
              canvas.drawImage(misc_sprites.about_selected, 0, 0, 128, 32, 336, 290, 129, 32);
              break;
      
      default: break;
    }    
  } else if (gameRunning == false && showAbout == true) { 
    canvas.fillStyle = "#000000";
    canvas.fillRect(0, 0, canvasElement.width, canvasElement.height); 
    for (var i = 0; i < 25; i++) {
      for (var j = 0; j < 19; j++) {
        canvas.drawImage(env_textures.rock_walls_dark, 0, 0, 32, 32, i*32, j*32, 32, 32);
        
        //canvas.font = '100px, "Arial"';
        //canvas.fillStyle = "FFF";
        drawText(canvas, 220, 200, "A work in progress by:");
        //canvas.fillText("A work in progress by", 320, 240);
        drawText(canvas, 220, 216, "Kristinn E. Kristmundsson");
        drawText(canvas, 220, 320, "kristinnes @ gmail.com");

        drawText(canvas, 220, 440, "Press enter to return to the main menu <");
      }
    }
  }
}

function update() {
  if (gameRunning) {
    var last_step_count = player.step_count;
    text_duration_counter++;
    /*
    if (text_duration_counter == 10) {
      text_duration_counter = 0; 
    }
    */
    var last_x = camera.x;
    var last_y = camera.y;
    var step_distance = 4;
    if (keydown.a) {
      player.direction = 3;
      camera.x += step_distance;    
      player.walking = true;
      player.step_count += 1;
    }
    if (keydown.d) {
      player.direction = 4;
      camera.x -= step_distance;    
      player.walking = true;
      player.step_count += 1;
    }
    if (keydown.w) {
      player.direction = 2;
      camera.y += step_distance;    
      player.walking = true;
      player.step_count += 1;
    }
    if (keydown.s) {
      player.direction = 1;
      camera.y -= step_distance;    
      player.walking = true;
      player.step_count += 1;
    }
    if (keydown.e) {
      spawn_a_new_enemy();
    }
    if (keydown.space) {
      console.log("enemy length: ", enemy_list.length);
      //console.log("camera_x:", camera.x);
      //console.log("camera_y:", camera.y);
    }
    if (last_step_count == player.step_count) {
      player.walking = false;
    }
    if (player.walking == false) {
      player.idleAnimationTick += 1;
      if (player.idleAnimationTick == 100)
      {
        player.idleAnimationStep = 0;
      }
      
      if (player.idleAnimationTick == 200)
      {
        player.idleAnimationStep = 1;
      }

      if (player.idleAnimationTick == 300)
      {
        player.idleAnimationStep = 2;
      }

      if (player.idleAnimationTick == 400)
      {
        player.idleAnimationStep = 3;
        player.idleAnimationTick = 0;
      }
    }
  // Check if player is going out of bounds
    player.actual_x = -camera.x + 400;
    player.actual_y = -camera.y + 300;
    for (var v = 1; v < map.xTiles-1; v++) {
      for (var d = 1; d < map.yTiles-1; d++) {  
      
        box.x = v*32;
        box.y = d*32;
        box.width = 32;
        box.height = 16;
      
        player_box.x = player.actual_x;
        player_box.y = player.actual_y;
        player_box.width = player.width;
        player_box.height = player.height;    
      
        if (map.tiles[v][d] == 0) {
          if (collides(box, player_box)) {                    
            camera.x = last_x;
            camera.y = last_y;
          }      
        }
      }
    }

    if (player.step_count > player.step_switch_limit) {
      player.step_count = 0;
      if (player.step_type == 0) {
        player.step_type = 1;
      } else {
        player.step_type = 0;
      }
    }

    enemy_list.forEach(function(item){
  	 item.update();
    });

  } else if (gameRunning == false && showAbout == false){ // If we are at the menu
    menu_delay_counter += 1;
      if (menu_delay_counter > menu_selection_delay) {
        if (keydown.w) {
          menu_selection = 0;
        }
        if (keydown.s) {
          menu_selection = 1;
        }
        if (keydown.up) {
          menu_selection = 0;
        }
        if (keydown.down) {
          menu_selection = 1;      
        }
        if (keydown.return) {
          menu_delay_counter = 0;
          switch (menu_selection) {
          case 0: gameRunning = true;
                  break;  
          case 1: showAbout = true;
                  break;
          }
          if (menu_selection == 0) {
            gameRunning = true;
          }
          if (menu_selection == 1) {
            showAbout = true;
          }
        } 
      }
      }
      else if (gameRunning == false && showAbout == true) {
        menu_delay_counter += 1;
        if (menu_delay_counter > menu_selection_delay) {
        if (keydown.return) { 
          menu_delay_counter = 0;
          showAbout = false;
        } 
      }
    }

}

function startGameLoop() {	
		var gameloopId;
    console.log('Generating map.');
    map.generate();
    spawn_player();
    console.log('Starting game loop');
		clearInterval(gameloopId);    
		gameloopId = setInterval( function(){        
				update();
				draw();
		}, 1000/FPS );		
}

window.onload = function() {	
  //test code, remove when done
  //if ((navigator.userAgent.indexOf('iPhone') != -1) || (navigator.userAgent.indexOf('iPod') != -1) || (navigator.userAgent.indexOf('iPad') != -1)) {
  if (navigator.userAgent.indexOf('iPad') != -1) {    
    console.log("iPad detected.");
  } else {
    console.log("not an iPad.");
  }

  console.log('Loading variables.');
	FPS = 30;
	canvasElement = document.getElementById("mainCanvas");
	canvas = canvasElement.getContext("2d");  

  console.log('Loading sprites.');
  console.log('Creating map array');

  map.tiles = new Array(map.xTiles+1);
  for (var i = 0; i < map.xTiles; i++) {
    map.tiles[i] = new Array(map.yTiles+1);
  }

  map.fog_tiles = new Array(map.xTiles*2+1);
  for (var i = 0; i < map.xTiles*2; i++) {
    map.fog_tiles[i] = new Array(map.yTiles+1);
  }

  map.neutral_tile = new Image();
  map.neutral_tile.src = "images/stone_tile32.jpg";  
  map.corridor_tile = new Image();
  map.corridor_tile.src = "images/corridor_tile32.jpg";
  map.rock_tile = new Image();
  map.rock_tile.src = "images/unmined_rocks32.jpg";
  map.room_item_list = new Array();

  env_textures.rock_walls = new Image();
  env_textures.rock_walls.src = "images/rock_wall_tiles.png";
  env_textures.wood_floor = new Image();
  env_textures.wood_floor.src = "images/wood_floorboards.png";
  env_textures.flat_stone_tile = new Image();
  env_textures.flat_stone_tile.src = "images/flat_stone_tile.png";
  env_textures.rock_walls_dark = new Image();
  env_textures.rock_walls_dark.src = "images/rock_wall_tiles_dark.png";

  player.sprite_map = new Image();
  player.sprite_map.src = "images/dave.png";
  player.fog_texture = new Image();
  player.fog_texture.src = "images/fog.png";
  player.black_fog_texture = new Image();
  player.black_fog_texture.src = "images/black_fog.png";

  enemy.sprite_map = new Image();
  enemy.sprite_map.src = "images/zombie.png";

  misc_sprites.logo = new Image();
  misc_sprites.logo.src = "images/logo.png";
  misc_sprites.about_normal = new Image();
  misc_sprites.about_normal.src = "images/about.png";
  misc_sprites.about_selected = new Image();
  misc_sprites.about_selected.src = "images/About_flash.png";
  misc_sprites.new_game_normal = new Image();
  misc_sprites.new_game_normal.src = "images/new_game.png";
  misc_sprites.new_game_selected = new Image();
  misc_sprites.new_game_selected.src = "images/new_game_flash.png";
  misc_sprites.user_interface = new Image();
  misc_sprites.user_interface.src = "images/temp_ui.png";
  
  loadText();

  startGameLoop();	

}




