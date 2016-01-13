var map = {
  xTiles: 100,
  yTiles: 70,
  tiles: 0,
  fog_tiles: 0,
  room_item_list: 0,
  min_rooms: 5,
  max_rooms: 7,
  neutral_tile: 0,
  corridor_tile: 0,
  rock_tile: 0
};

var room_config = {
	min_width: 12,
	min_height: 12,
	max_width: 20,
	max_height: 20
};

var env_textures = {
	rock_walls: 0,
	rock_walls_dark: 0,
	wood_floor: 0,
	flat_stone_tile: 0
}

var misc_sprites = {
	logo: 0,
	about_normal: 0,
	about_selected: 0,
	new_game_normal: 0,
	new_game_selected: 0,
	user_interface: 0
}


map.generate = function() {		
	// Empty the map  
	for (var i = 0; i < this.xTiles-1; i++) {
		for (var j = 0; j < this.yTiles-1; j++) {
			map.tiles[i][j] = 0;
		}
	}
	//var number_of_rooms = 1;
	var number_of_rooms = Math.round(Math.random()*(map.max_rooms - map.min_rooms)+map.min_rooms);
	var generate_rooms = true;
	while(generate_rooms) {
		// Set up room				
		var ok = false;		
		
		while(!ok) {
			var room_collision = false;
			var room_item = {};
			room_item.width = Math.round(Math.random()*(room_config.max_width-room_config.min_width)+room_config.min_width);
			room_item.height = Math.round(Math.random()*(room_config.max_height-room_config.min_height)+room_config.min_height);
			room_item.x = Math.round(Math.random()*(map.xTiles-2-room_item.width-1));
			room_item.y = Math.round(Math.random()*(map.yTiles-2-room_item.height-1));
			
			// Check collisions
			for (var r = 0; r < map.room_item_list.length; r++)
			{
				if (collides(room_item, map.room_item_list[r])) {
					room_collision = true;
					break;
				}				
			}
			if (!room_collision) {
				ok = true;
			}			
		}
		map.room_item_list.push(room_item);			

			// Place room on map and create one square of space around the room
			room_item.x += 1;
			room_item.y += 1;
			room_item.width -= 2;
			room_item.height -= 2;					
		
		if (number_of_rooms < map.room_item_list.length) {
			generate_rooms = false; 
		}
	}
	// Generate the corridors
	
	var corridor_count = map.room_item_list.length;
	var connected_rooms = [];

	for (var i = 0; i < corridor_count; i++) {
		// get rooms
		var RoomA = map.room_item_list[i];
		var RoomBNum = i;

		while (RoomBNum == i) {
			RoomBNum = Math.floor((Math.random()*map.room_item_list.length));			
		}

		var RoomB = map.room_item_list[RoomBNum];
		var sideStepChance = 5;

		var pointA = { 	x: (RoomA.x + Math.floor(RoomA.width/2)),
						y: (RoomA.y + Math.floor(RoomA.height/2))};

		var pointB = { 	x: (RoomB.x + Math.floor(RoomB.width/2)),
						y: (RoomB.y + Math.floor(RoomB.height/2))};

	 while (pointB.x !== pointA.x || pointB.y !== pointA.y) {	 	
	        var num = Math.random()*100;	    
	        if (num < sideStepChance){
	            if (pointB.x !== pointA.x){
	                if(pointB.x > pointA.x){
	                    pointB.x--;
	                }else{
	                    pointB.x++;                   
	                }
	            }
	        }else if(pointB.y !== pointA.y){
	                if(pointB.y > pointA.y){
	                    pointB.y--;
	                }else{
	                    pointB.y++;                   
	                }
	        }	        

	        if(pointB.x < map.xTiles && pointB.y < map.yTiles){
	           connected_rooms.push({x:pointB.x, y:pointB.y});
	        }
	    }
	}
	
	// Draw corridors
	for(i = 0; i < connected_rooms.length; i++) {
		map.tiles[connected_rooms[i].x][connected_rooms[i].y] = 2;
	}

	// Draw rooms
	map.room_item_list.forEach(function(room_item) {
			for (var j = room_item.x; j < (room_item.x + room_item.width); j++) {
				for (var k = room_item.y; k < (room_item.y + room_item.height); k++) {
					map.tiles[j][k] = 1;
				}
			}	
		});
}

function room(I) {
  return I;
}

map.mark_line_of_sight = function(x0, x1, y0, y1) {
	map.fog_tiles[x0][y0] = 0;
}

map.draw_line_of_sight = function() {
	var tileSize = 32;
	player.square_x = Math.round(player.actual_x/32);
	player.square_y = Math.round(player.actual_y/32);	

	// Generate fog	
	for (var i = 0; i < this.xTiles-1; i++) {
		for (var j = 0; j < this.yTiles-1; j++) {
			if (i < (player.square_x+player.view_range+1)	&&
    			i > (player.square_x-player.view_range-1)) {
    			if (j < (player.square_y+player.view_range-1)	&&
    				j > (player.square_y-player.view_range+1)) {
						map.fog_tiles[i][j] = 2;
				}
			}
		}
	}

	for (var x_counter = (player.square_x-player.view_range); x_counter < player.square_x+player.view_range; x_counter++) {
		for (var y_counter = (player.square_y-player.view_range); y_counter < player.square_y+player.view_range; y_counter++) {
			try {
				
				var x0 = player.square_x;
				var x1 = x_counter;
				var y0 = player.square_y;
				var y1 = y_counter;

				var dx = Math.abs(x1-x0);
			    var dy = Math.abs(y1-y0);
			    var sx = (x0 < x1) ? 1 : -1;
			    var sy = (y0 < y1) ? 1 : -1;
	  		    var err = dx-dy;
	  		    var length_counter = 0;

				while(true){				
			     if (length_counter < player.view_range/2) {
			     	map.fog_tiles[x0][y0] = 0;
			 	 } else {
			 	 	map.fog_tiles[x0][y0] = 1;
			 	 }
			     if ((x0==x1) && (y0==y1)) break;			     			     
			     if (length_counter == player.view_range) break;
			     if (map.tiles[x0][y0] == 0) break;
			     var e2 = 2*err;
			     if (e2 >-dy){ err -= dy; x0  += sx; }
			     if (e2 < dx){ err += dx; y0  += sy; }
			     length_counter++;
			   }
			} catch(err) {};		
		}
	}

	for (var i = 0; i < this.xTiles; i++) {
	    for (var j = 0; j < this.yTiles; j++) {  
	    	if (i < (player.square_x+player.view_range)	&&
			i > (player.square_x-player.view_range)) {
			if (j < (player.square_y+player.view_range)	&&
				j > (player.square_y-player.view_range)) {  	
			    	var draw_x = (i*tileSize)+(camera.x);
			    	var draw_y = (j*tileSize)+(camera.y);     	
					switch (this.fog_tiles[i][j]) {
						case 1: canvas.drawImage(player.fog_texture, 0, 0, 32, 32, draw_x, draw_y, 32, 32);
								break;
						case 2: canvas.drawImage(player.black_fog_texture, 0, 0, 32, 32, draw_x, draw_y, 32, 32);
								break;
						default: break;
					}
				}
			}
	    }    
  	}
}

  

map.draw = function() {
  var tileSize = 32;
  var offsetX = camera.x;
  var offsetY = camera.y;
  camera.offset_x = offsetX;
  camera.offset_y = offsetY; // TODO: use camera.offset instead of offset in the code below.
  for (var i = 0; i < this.xTiles; i++) {
    for (var j = 0; j < this.yTiles; j++) {    	
    	var draw_x = (i*tileSize)+(camera.x);
    	var draw_y = (j*tileSize)+(camera.y);     
    	if (i < (player.square_x+player.view_range-1)	&&
    		i > (player.square_x-player.view_range+1)) {
    		if (j < (player.square_y+player.view_range-1)	&&
    			j > (player.square_y-player.view_range+1)) {
				switch (this.tiles[i][j]) {
					case 0: if (i > 0 && j > 0) {
								if (this.tiles[i][j+1] > 0 ||
									this.tiles[i][j-1] > 0 ||
									this.tiles[i+1][j] > 0 ||
									this.tiles[i-1][j] > 0 ||
									this.tiles[i-1][j+1] > 0 ||
									this.tiles[i-1][j-1] > 0 ||
									this.tiles[i+1][j+1] > 0 ||
									this.tiles[i+1][j-1] > 0 ) {
									if (this.tiles[i][j+1] != 0 ) {			
											canvas.drawImage(env_textures.rock_walls, 32, 0, 32, 32, draw_x, draw_y, 32, 32);
									} else {
										canvas.drawImage(env_textures.rock_walls, 0, 0, 32, 32, draw_x, draw_y, 32, 32);
									}	
								} 
							}
							break;
					case 1: canvas.drawImage(env_textures.wood_floor, 0, 0, 32, 32, draw_x, draw_y, 32, 32);
							break;
					case 2: canvas.drawImage(env_textures.flat_stone_tile, 0, 0, 32, 32, draw_x, draw_y, 32, 32);
							break;
					default: break;
				}
			}
		}
    }    
  }  
}
