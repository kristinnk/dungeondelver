function enemy(I) {
	I.square_x = 0;
	I.square_y = 0;
	I.last_x = 0;
	I.last_y = 0;
	I.width = 32;
	I.height = 32;
	I.sprite_map = new Image();
	I.step_count = 0;
	I.step_switch_limit = 9;
	I.step_type = 1;
	I.speed = 2;
	I.walking = false;
	I.view_range = 7;
	I.direction = 1; // 1 : front, 2: back, 3: left, 4: right
	I.hasCollided = false;
	I.AIType = 1; // The type of pathfinding and actions the enemy performas.
	I.load_sprite = function() {
		this.sprite_map.src = "images/zombie.png";
	};

	I.draw = function() {
	this.square_x = Math.round(this.x/32);
	this.square_y = Math.round(this.y/32);
	if (this.square_x < (player.square_x+player.view_range-1) &&
	    this.square_x > (player.square_x-player.view_range+1)) {	
		if (this.square_y < (player.square_y+player.view_range-1) &&
		    this.square_y > (player.square_y-player.view_range+1)) {	
			canvas.drawImage(this.sprite_map, 0, 0, 32, 32, this.x+camera.offset_x, this.y+camera.offset_y, this.width, this.height);
			
			switch(this.direction) {	
				case 1: canvas.fillStyle = "#0000FF";
    					canvas.fillRect(this.x+camera.offset_x, this.y+camera.offset_y+32, 32, 32);
					break;
				case 2: canvas.fillStyle = "#0000FF";
    					canvas.fillRect(this.x+camera.offset_x, this.y+camera.offset_y-32, 32, 32);
					break;
				case 3: canvas.fillStyle = "#0000FF";
    					canvas.fillRect(this.x+camera.offset_x-32, this.y+camera.offset_y, 32, 32);
					break;
				case 4: canvas.fillStyle = "#0000FF";
    					canvas.fillRect(this.x+camera.offset_x+32, this.y+camera.offset_y, 32, 32);
				break;
			}


			}
		}
	};

	I.update = function() {
		//AI here.
		//Collision data
		if (this.AIType == 0) {
			this.last_x = this.x;
			this.last_y = this.y;

			if (this.hasCollided == true) {
			switch(this.direction) {	
			case 1: if (Math.random() < 0.8) { 
					this.y -= this.speed;
				}
				break;
			case 2: if (Math.random() < 0.8) { 
					this.y += this.speed;
				}
				break;
			case 3: if (Math.random() < 0.8) { 
					this.x += this.speed;
				}
				break;
			case 4: if (Math.random() < 0.8) { 
					this.x -= this.speed;
				}
				break;
			}
			this.hasCollided = false;
			}

			//Currently ROUGH. TODO: Implement A*.
			this.square_x = Math.round(this.x/32);
			this.square_y = Math.round(this.y/32);
			if (this.x < player.actual_x) {
				this.direction = 4
				this.x += this.speed;
			}
			if (this.x > player.actual_x) {
				this.direction = 3;
				this.x -= this.speed;
			}
			if (this.y < player.actual_y) {
				this.direction = 1;
				this.y += this.speed;
			}
			if (this.y > player.actual_y) {
				this.direction = 2;
				this.y -= this.speed;
			}

			var colRange = 1; //How far to check for collisions.
			for (var i = (this.square_x-colRange); i < (this.square_x+colRange); i++) {
				for (var j = (this.square_y-colRange); j < (this.square_y+colRange); j++) {
					if (map.tiles[i][j] == 0) {
					box.x = i*32;
					box.y = j*32;
					box.width = 32;
					box.height = 32;
					if (collides(box, this)) {	
						var decider_x = Math.abs(this.square_x - i);
						var decider_y = Math.abs(this.square_y - j);
						console.log("x: %d y: ", decider_x, decider_y);
				//		this.hasCollided = true;				
						
						if (decider_y == 0) {
		  				  this.x = this.last_x;
						}
						if (decider_x == 0) {
						  this.y = this.last_y;
						}
						if (decider_y == 0 && decider_x == 0) {
						  this.y = this.last_y;
						  this.x = this.last_x;
						}
					}
				}
			}
			}			
			
		};// end of AIType == 0

		if (this.AIType == 1) { // Basic one step shortest distance type AI, faulty

			//console.log("Blah");
		 	this.square_x = Math.round(this.x/32);
			this.square_y = Math.round(this.y/32);
				
			for (var d = -1; d < 2; d++) {
				for (var f = -1; f < 2; f++) {									
					if (map.tiles[this.square_x+d][this.square_y+f] > 0) {


						enemy_box.x = this.x + (d*32);
						enemy_box.y = this.y + (f*32);
						enemy_box.width = 32;
						enemy_box.height = 32;						
						
						player_box.x = player.actual_x-16;
	        			player_box.y = player.actual_y-16;
	        			player_box.width = player.width;
	        			player_box.height = player.height; 
			

						if (!collision) {
						var dist_to_player = distance(enemy_box, player_box);						

						if (dist_to_player < best_cell.dist) {
							best_cell.dist = dist_to_player;
							best_cell.x = enemy_box.x;
							best_cell.y = enemy_box.y;
						}
						}
					}
				}				
			}
//			console.log("dist : %d", best_cell.dist);

		 	this.square_x = Math.round(this.x/32);
			this.square_y = Math.round(this.y/32);


			best_cell.dist = 99999;

			if (this.x < best_cell.x) {
				this.direction = 4;
				this.x += this.speed;
			}
			if (this.x > best_cell.x) {
				this.direction = 3;
				this.x -= this.speed;
			}
			if (this.y < best_cell.y) {
				this.direction = 1;
				this.y += this.speed;
			}
			if (this.y > best_cell.y) {
				this.direction = 2;
				this.y -= this.speed;
			}

		} // end of AIType == 1
	}

	if (this.AIType == 2) {
	/*
	fyrir hverja hlið við óvininn (fyrir upp, niður, vinstri, hægri): 
  		Færa óvininn einn pixel í átt að viðkomandi átt.
		tékka collision á átta reitina í kring
			123
			4E5
			678
		ef collision, hunsa reitinn
		ef ekki collision, færa í opið sett
	  fyrir hvern reit í opna settinu
	    reikna vegalengd til player
	  velja reitinn með stystu vegalengdina til player, færa óvin í þá átt.
  */
	}
	return I;
};



 