	$(document).ready(function(){
		var oh=$("#wall").height();
		var ow=$("#wall").width();
		var oscore=$("#forScore");
		var canvas = document.getElementById("gridCanvas");
		var ctx = canvas.getContext("2d");

		var snake_array=[];
		var food;
		var nextS="right";
		var score=0;
		var cw=20;
		var cx=10;
		var cy=6;
		var speed=200;

		init();

		function init(){
			create_snake();
			create_food();

			if(typeof game_loop != "undefined") clearInterval(game_loop);
			game_loop = setInterval(paint_snake, speed);
		}
		function create_snake(){
			var len=5; 
			for (var i = len-1; i >= 0; i--) {
				snake_array.push({x:i,y:0});
			};
		}
		function create_food(){
			food={
				x:Math.round(Math.random()*(ow-cw)/cw),
				y:Math.round(Math.random()*(oh-cw)/cw)
			} 
			/*food={
				x:snake_array[3].x,
				y:snake_array[3].y
			}*/
			while(testing_food_fail(food)){
				food={
				x:Math.round(Math.random()*(ow-cw)/cw),
				y:Math.round(Math.random()*(oh-cw)/cw)
				}
			}

			food_cell(food.x,food.y);
		}
		function testing_food_fail(foodT){
			for(var index=0; index<snake_array.length;index++){
				/*console.log(foodT.x+" "+foodT.y+" vs "+snake_array[index].x+" "+snake_array[index].y);*/
				if(foodT.x==snake_array[index].x && foodT.y==snake_array[index].y){
					return true;
				}
			}
			return false;
		}
		function paint_snake(){

			 var sx=snake_array[0].x;
			 var sy=snake_array[0].y;

			 if(nextS=="right") sx++;
			 else if(nextS=="left") sx--;
			 else if(nextS=="up") sy--;
			 else if(nextS=="down") sy++;


			 if (sx==food.x && sy==food.y) {
			 	var tail={x:sx,y:sy};
			 	score++;
			 	if(speed>60){
			 		speed-=3;
			 	}else{
			 		speed=60;
			 	}
			 	if(typeof game_loop != "undefined") clearInterval(game_loop);
			    game_loop = setInterval(paint_snake, speed);
			 	create_food();
			 	oscore.html(score);
			 }else{

			 	var old_tail=snake_array.pop();
			 	var tail=old_tail;
			 	clear_cell(old_tail.x,old_tail.y);
			 	tail.x=sx;
			 	tail.y=sy;
			 }
			
			 snake_array.unshift(tail);

			if(sx>=30){
				snake_array[0].x=0;
			}
			else if(sx<0){
				snake_array[0].x=29;
			}
			else if(sy>=25){
				snake_array[0].y=0;
			}
			else if(sy<0){
				snake_array[0].y=24;
			}

			for (var i = 0; i < snake_array.length; i++) {
				var sa=snake_array[i];
				snake_cell(sa.x,sa.y);
			};

			for (var j = 1; j < snake_array.length; j++) {
				var cell_x=snake_array[j].x;
				var cell_y=snake_array[j].y;
				if(sx==cell_x&&sy==cell_y){

					var highestScore=score;			
					exit();
					setTimeout(function() { $("#LScore").text(score); },100);
					$('#myModal').modal({
						backdrop: 'static',
						keyboard: false
					});
					return;
				}
			};
		}

		//reset
		function reset(){

			for (var k = 0; k < snake_array.length; k++) {
				clear_cell(snake_array[k].x,snake_array[k].y);
			};

			snake_array=[];

			clear_cell(food.x,food.y);

			nextS="right";
			//reset score and so on
			score=0;
			oscore.html(score);
			speed=200;

			init();
		}
		function exit(){

			speed=99999;
			if(typeof game_loop != "undefined") clearInterval(game_loop);
			game_loop = setInterval(paint_snake, speed);

		}

		$(document).keydown(function(e){
			var key=e.which;
			//alert(e.keyCode); 
			if(key=="37"&&nextS!="right") nextS="left";
			else if(key=="38"&&nextS!="down") nextS="up";
			else if(key=="39"&&nextS!="left") nextS="right";
			else if(key=="40"&&nextS!="up") nextS="down";
		})

		$(".dirUp").on('click',function(){
			if(nextS!="down") nextS="up";
		})
		$(".dirRight").on('click',function(){
			if(nextS!="left") nextS="right";
		})
		$(".dirDown").on('click',function(){
			if(nextS!="up") nextS="down";
		})
		$(".dirLeft").on('click',function(){
			if(nextS!="right") nextS="left";
		})
		/*
		//Speed Up:
		$(".speedUp").on('click',function(){
			if(speed>0){
				speed-=70;
			}else{
				alert("The Highest SPEED!")
			}
			if(typeof game_loop != "undefined") clearInterval(game_loop);
			game_loop = setInterval(paint_snake, speed);
		})
		//speed down
		$(".speedDown").on('click',function(){
			if(speed<500){
				speed+=70;
			}else{
				alert("The Lowest SPEED!")
			}
			if(typeof game_loop != "undefined") clearInterval(game_loop);
			game_loop = setInterval(paint_snake, speed);
		}) */

		//reset；
		$(".reset_span").on('click',function(){
			reset();
		})

		function snake_cell(x,y){
			ctx.fillStyle='white';
			ctx.fillRect(x*cx,y*cy,cx-1,cy-1);
		}

		function food_cell(x,y){
			ctx.fillStyle='yellow';
			ctx.fillRect(x*cx,y*cy,cx-1,cy-1);
		}
		function clear_cell(x,y){
			ctx.fillStyle='#444';
			ctx.fillRect(x*cx,y*cy,cx-1,cy-1);
		}
	});