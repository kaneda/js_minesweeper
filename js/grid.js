/*
 * A grid is made of squares
 * Each squares knows it's location and state
 */
function Square(loc_x, loc_y, has_mine) {
	this.loc_x = loc_x;
	this.loc_y = loc_y;
	this.has_mine = has_mine;
	this.clicked = false;
	this.flagged = false;
}

/*
 * Create a Grid of Squares
 */
function createGrid(dim_x, dim_y, num_mines) {
		var num_mines_remaining = num_mines;
		var num_spaces = dim_x * dim_y;

		var grid = new Array();
		var mine_count = new Array();

		/*
		 * Initialize mine_count array
		 */

    for(var i = 0; i < num_spaces; i+=1) {
		  mine_count[i] = 0;
    }

		for(var loc = 0; loc < num_spaces; loc++) {
			var hasMine = randoMine(num_mines_remaining, num_spaces-loc);
			if(hasMine) {
				num_mines_remaining-=1;
				update_mines(loc,mine_count,dim_x,dim_y);
			}
			grid[loc] = new Square(loc%dim_x,Math.floor(loc/dim_y),hasMine);
		}

		// This only works in JS1.7+
		return [grid,mine_count];
}

/*
 * There's probably a faster way to do this
 */
function update_mines(loc, mine_count, dim_x, dim_y) {
	// I'm a mine!
	mine_count[loc] += 1;

	// Calculate this once
	hor_pos = loc % dim_x;
	vert_pos = Math.floor(loc / dim_y);

	// Upper left
	if(vert_pos > 0 && hor_pos > 0) {
		mine_count[loc - dim_x-1]+=1;
	}

	// Top
	if(vert_pos > 0) {
		mine_count[loc - dim_x] += 1;
	}

	// Upper right
	if(vert_pos > 0 && hor_pos + 1 < dim_x) {
		mine_count[loc - dim_x + 1] += 1;
	}

	// Left
	if(hor_pos > 0) {
		mine_count[loc - 1] += 1;
	}

	// I'm already set

	// Right
	if(hor_pos + 1 < dim_x) {
		mine_count[loc + 1] += 1;
	}

	// Bottom left
	if(vert_pos < dim_y && hor_pos > 0) {
		mine_count[loc + dim_x - 1] += 1;
	}

	// Bottom
	if(vert_pos < dim_y) {
		mine_count[loc + dim_x] += 1;
	}

	// Bottom right
	if(vert_pos < dim_y && hor_pos + 1 < dim_x) {
		mine_count[loc + dim_x + 1] += 1;
	}
}

/*
 * For perfect shuffling every time, use Knuths!
 */
function randoMine(mines_remaining, spaces_remaining) {
	prob = mines_remaining / spaces_remaining;

	if(Math.random() <= prob) {
		return true;
	}

	return false;
}

/*
 * Draw the grid when super konami mode @ is enabled
 */
function draw_grid_cheat(grid, mine_count, dim_x, dim_y) {
	$("#gameBoard").html('');

	var max = parseInt(dim_x, 10) * parseInt(dim_y, 10);

	var tr = document.createElement("TR");
	$("#gameBoard").append(tr);

	for(var j = 0; j < max; j=j+1) {
		var textNode = "#!#";
		if(grid[j]["has_mine"]) {
			textNode = "X-X";
		} else if(grid[j]["clicked"]) {
			textNode = mine_count[j];
		} else if(grid[j]["flagged"]) {
			textNode = "<|";
		}
		var td = document.createElement("TD");
		var a = document.createElement("A");
		a.setAttribute("href", "#");
		a.setAttribute("id",j);
		a.setAttribute("class","square");
		a.appendChild(document.createTextNode(textNode));

		td.appendChild(a);
		tr.appendChild(td);

		if((j > 0 && (j + 1) % dim_x == 0)) {
			tr = document.createElement("tr");
			$("#gameBoard").append(tr);
		}
	}
	$("#gameBoard").trigger("update");
}

/*
 * Draw the grid when MS cheats + are enabled
 */
function draw_grid_nofog(mine_count, grid, dim_x, dim_y) {
	$("#gameBoard").html('');

	var max = dim_x * dim_y;

	var tr = document.createElement("TR");
	$("#gameBoard").append(tr);

	for(var j = 0; j < max; j++) {
		var textNode = mine_count[j];
		if(grid[j]["clicked"]) {
			textNode += "#";
		} else if(grid[j]["flagged"]) {
			textNode = "<|";
		}

		var td = document.createElement("TD");
		var a = document.createElement("A");
		a.setAttribute("href", "#");
		a.setAttribute("id", j);
		a.setAttribute("class", "square");
		a.appendChild(document.createTextNode(textNode));

		td.appendChild(a);
		tr.appendChild(td);

		if((j > 0 && (j + 1) % dim_x == 0)) {
			tr = document.createElement("tr");
			$("#gameBoard").append(tr);
		}
	}
	$("#gameBoard").trigger("update");
}

/*
 * Redraw the grid with the mines already selected shown
 */
function redraw_grid(dim_x, dim_y, grid, mine_count) {
	$("#gameBoard").html('');

	var max = dim_x * dim_y;

	var tr = document.createElement("TR");
	$("#gameBoard").append(tr);

	for(var j = 0; j < max; j++) {
		var textNode = "#!#"
		if(grid[j].clicked) {
			textNode = mine_count[j];
		} else if(grid[j]["flagged"]) {
			textNode = "<|";
		}

		var td = document.createElement("TD");
		var a = document.createElement("A");
		a.setAttribute("href", "#");
		a.setAttribute("id", j);
		a.setAttribute("class", "square");
		a.appendChild(document.createTextNode(textNode));

		td.appendChild(a);

		if((j > 0 && j % dim_x == 0)) {
			tr = document.createElement("tr");
			$("#gameBoard").append(tr);
		}

		tr.appendChild(td);
	}
	$("#gameBoard").trigger("update");
}

/*
 * Draw a fresh grid
 */
function draw_grid(dim_x, dim_y) {
	$("#gameBoard").html('');

	var max = dim_x * dim_y;

	var tr = document.createElement("TR");
	$("#gameBoard").append(tr);

	for(var j = 0; j < max; j++) {
		var td = document.createElement("TD");
		var a = document.createElement("A");
		a.setAttribute("href", "#");
		a.setAttribute("id", j);
		a.setAttribute("class", "square");
		a.appendChild(document.createTextNode("#!#"));

		td.appendChild(a);

		if((j > 0 && j % dim_x == 0)) {
			tr = document.createElement("tr");
			$("#gameBoard").append(tr);
		}

		tr.appendChild(td);
	}
	$("#gameBoard").trigger("update");
}

/*
 * JS hates recursion, this had to be rewritten.
 * Hope you don't mind I used a queue.
 */
function wave(id,dim_x,dim_y,mine_count,grid) {
	var queue = new Queue();

	// octal -_-
	queue.enqueue(parseInt(id, 10));

	var n_dim_x = parseInt(dim_x, 10);
	var n_dim_y = parseInt(dim_y, 10);

	var num_selected = 0;

	// Instead of having to check " || c_id == id" each time just uncheck
	grid[id]["clicked"] = false;
	while(!queue.isEmpty()) {
		c_id = queue.dequeue();
		if((grid[c_id] && !grid[c_id]["clicked"]) && (mine_count[c_id] == "0" || mine_count[c_id] == 0)) {
			$("#"+c_id).html("0");
			grid[c_id]["clicked"] = true;
			num_selected += 1;
		} else {
			continue;
		}

		// Calculate this once
		hor_pos = c_id%n_dim_x;
		vert_pos = Math.floor(c_id / n_dim_y);

		//up
		if(vert_pos > 0) {
			queue.enqueue(c_id - n_dim_x);
		}

		//left
		if(hor_pos > 0) {
			queue.enqueue(c_id - 1);
		}

		//down
		if(vert_pos + 1 < dim_y) {
			queue.enqueue(c_id + n_dim_x);
		}

		//right
		if(hor_pos + 1) {
			queue.enqueue(c_id + 1);
		}
	}

	return num_selected;
}

