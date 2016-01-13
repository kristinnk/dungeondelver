var player = {
	x: 0,
	y: 0,
	actual_x: 0,
	actual_y: 0,
	square_x: 0,
	square_y: 0,
	width: 32,
	height: 32,
	sprite_map: 0,
	step_count: 0,
	step_switch_limit: 9,
	step_type: 1,
	walking: false,
	idleAnimationTick: 0,
	idleAnimationStep: 0,
	view_range: 8,
	fog_texture: 0,
	black_fog_texture: 0,
	direction: 1 // 1 : front, 2: back, 3: left, 4: right
};


player.draw = function() {
	if (this.walking == true) {
		switch (this.direction) {
			case 1: if (player.step_type == 1) {
							canvas.drawImage(this.sprite_map, 0, 0, 32, 32, this.x, this.y, this.width, this.height);
						} else {
							canvas.drawImage(this.sprite_map, 0, 32, 32, 32, this.x, this.y, this.width, this.height);
						}
					break;
			case 2: if (player.step_type == 1) {
							canvas.drawImage(this.sprite_map, 32, 0, 32, 32, this.x, this.y, this.width, this.height);
						} else {
							canvas.drawImage(this.sprite_map, 32, 32, 32, 32, this.x, this.y, this.width, this.height);
						}
					break;
			case 3: if (player.step_type == 1) {
							canvas.drawImage(this.sprite_map, 0, 96, 32, 32, this.x, this.y, this.width, this.height);
						} else {
							canvas.drawImage(this.sprite_map, 32, 96, 32, 32, this.x, this.y, this.width, this.height);
						}
					break;
			case 4: if (player.step_type == 1) {
							canvas.drawImage(this.sprite_map, 0, 64, 32, 32, this.x, this.y, this.width, this.height);
						} else {
							canvas.drawImage(this.sprite_map, 32, 64, 32, 32, this.x, this.y, this.width, this.height);
						}
					break;
		}
	} else {

		switch(player.idleAnimationStep) {
			case 0:	canvas.drawImage(this.sprite_map, 64, 64, 32, 32, this.x, this.y, this.width, this.height);
					break;
			case 1:	canvas.drawImage(this.sprite_map, 64, 0, 32, 32, this.x, this.y, this.width, this.height);
					break;
			case 2:	canvas.drawImage(this.sprite_map, 64, 64, 32, 32, this.x, this.y, this.width, this.height);
					break;
			case 3:	canvas.drawImage(this.sprite_map, 96, 0, 32, 32, this.x, this.y, this.width, this.height);
					break;

		}
	//	canvas.drawImage(this.sprite_map, 64, 64, 32, 32, this.x, this.y, this.width, this.height);
	}
};
