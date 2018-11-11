function load_game() {
	var dim_x = 9;
	var dim_y = 9;
	var num_mines = 10;

	/*
	 * Don't disturb the dimensions or # of mines during play
	 */
	var tmp_dim_x = 9;
	var tmp_dim_y = 9;
	var tmp_num_mines = 10;

	var locked = false;
	var num_selected = 0;
	var grid,mine_count;

	var num_flagged = 0;

	/*
	 * Begin elements on page
	 */

	 // Listen for changes to the size of board/# of mines drop down
	$("#board_size").change(function (e) {
		board_size = e["currentTarget"]["selectedIndex"];

		/*
		 * Taken directly from MS Mine Sweeper
		 */
		if(board_size == "0") {
			tmp_dim_x = 9;
			tmp_dim_y = 9;
			tmp_num_mines = 10;
		} else if(board_size == "1") {
			tmp_dim_x = tmp_dim_y = 16;
			tmp_num_mines = 40;
		} else {
			tmp_dim_x = 16;
			tmp_dim_y = 30;
			tmp_num_mines = 99;
		}
	});

	// If someone clicks to generate the board
	$("#gen_board").live("click", function (e) {
		e.preventDefault();

		// Initialize the grid and mount_count array
		obj = createGrid(dim_x, dim_y, num_mines);
		grid = obj[0];
		mine_count = obj[1];
		dim_x = tmp_dim_x;
		dim_y = tmp_dim_y;
		num_mines = tmp_num_mines;
		num_selected = 0;
		num_flagged = 0;
		locked = false;
		draw_grid(dim_x,dim_y);
	});

	// If someone clicks our first cheat
	$("#c").live("click", function (e) {
		e.preventDefault();

		if($(this).attr("rel") == "0") {
			$(this).attr("rel","1")
			draw_grid_nofog(mine_count,grid,dim_x,dim_y);
		} else {
			$(this).attr("rel","0");
			redraw_grid(dim_x,dim_y,grid,mine_count);
		}
	});

	// If someone clicks our second cheat
	$("#u").live("click", function (e) {
		e.preventDefault();

		if($(this).attr("rel") == "0") {
			$(this).attr("rel","1");
			draw_grid_cheat(grid,mine_count,dim_x,dim_y);
		} else {
			$(this).attr("rel","0");
			redraw_grid(dim_x,dim_y,grid,mine_count);
		}
	});

	// If someone left or right-clicks on a square
	$("a.square").live("mousedown", function (e) {
		e.preventDefault();
		id = $(this).attr("id");
		sq = grid[id];
		count = mine_count[id];

		if(sq["clicked"] || locked) {
			return;
		}

		switch (e.which) {
			case 1:
				if(sq["flagged"] || sq["clicked"]) {
					// I am ignoring you
				} else if(sq["has_mine"]) {
					//Kaboom
					$(this).html("X");
					alert("YOU LOSE, TRY AGAIN");
					locked = true;
				} else {
					//Redraw grid
					sq.clicked = true;
					$(this).html(count);

					if(count == 0) {
						num_selected += wave(id,dim_x,dim_y,mine_count,grid);
					} else {
						num_selected += 1;
					}

					if(win(num_selected,dim_x,dim_y,num_mines)) {
						alert("YOU ARE A WINNER, PLAY AGAIN");
						locked = true;
					}
				}
				break;
			case 3:
				if(sq.flagged) {
					// Test to see if we've enabled the cheat
					if($("#u").attr("rel") == "1" && sq["has_mine"]) {
						$(this).html("X-X");
					} else {
						$(this).html("#!#");
					}
					$(this).attr("class","square");
					$(this).attr("id",sq.id);
					sq["flagged"] = false;
					num_flagged -= 1;
				} else if(num_flagged < num_mines) {
					$(this).html("<|");
					sq["flagged"] = true;
					num_flagged +=1 ;

					if(num_flagged == num_mines && test_flagged(grid, num_mines)) {
						alert("YOU ARE A WINNER, PLAY AGAIN");
						locked = true;
					}
				}
				break;
			default:
				break;
		}
	});

	if (window.addEventListener) {
		// hax spells out "xyzzy"
		// konami up-up-down-down-left-right-left-right-b-a
		var keys = [], hax = "88,89,90,90,89", konami = "38,38,40,40,37,39,37,39,66,65";
		window.addEventListener("keydown", function (e) {
			keys.push(e.keyCode);
			if (keys.toString().indexOf(hax) >= 0) {
				$("#i").html("<a href=\"#\" id=\"c\" rel=\"0\">+</a>");
				$("#i").css("display","inherit");
				keys = [];
			} else if (keys.toString().indexOf(konami) >= 0) {
				$("#i").html("<a href=\"#\" id=\"u\" rel=\"0\">@</a>");
				$("#i").css("display","inherit");
				keys = [];
			};
		}, true);
	};
}

function win(num_selected,dim_x,dim_y,num_mines) {
	return num_selected == (dim_x * dim_y - num_mines);
}

function test_flagged(grid, num_mines) {
	var l = grid.length;
	mine_count = 0;
	for(var i = 0; i < l; i+=1) {
		if(grid[i]["flagged"] && grid[i]["has_mine"]) {
			mine_count += 1;
		}
	}
	if(mine_count == num_mines) {
		return true;
	}
	return false;
}

