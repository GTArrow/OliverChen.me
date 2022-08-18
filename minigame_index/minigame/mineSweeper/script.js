$(document).ready(function(){
    window.console && console.log("It's loaded");
});
$(window).on('load',(function(){
    var rows=16;
    var columns=30;
    var bombs=99;
    var totalBombs=0;
    var string='';
    var won=0;
    var first=1;
    var gotAir=0;
    function createTable() {
        gotAir=0;
        if(!first){
            rows=parseInt(document.getElementById("rows").value);
            columns=parseInt(document.getElementById("columns").value);
            bombs=parseInt(document.getElementById("bombs").value)%(rows*columns);
        }
        current=0;
        won=0;
        totalBombs=bombs;
        string='<h1>Minesweeper</h1><div id="minesweeper">';
        $('#board').html('');
        string+='<table cellspacing=0 cellpadding=0 style="height:'+(rows*24)+'px; width: '+(columns*24)+'px">';
        for (var i = 1; i <= rows; ++i) {
            string+='<tr>';
            for (var j = 1; j <= columns; ++j) {
                ++current;
                string+='<td class="covered" id="'+current+'"></td>';
            }
            string+='</tr>';
        }
        string+='</table><div id="inputs"><p>Rows<br><input id="rows" value="'+rows+'"></p><p>Columns<br><input id="columns" value="'+columns+'"></p><p>Bombs<br><input id="bombs" value="'+bombs+'"></p><p><input type="button" id="tableGenerator" value="Generate"></p></div>';
        string+='</div><br><span id="totalBombs">' + totalBombs + ' bombs</span>';
        $('#board').html(string);
        for(var i=0;i<bombs;++i){
            var newBomb = Math.floor(Math.random()*(rows*columns)+1);
            if(!($('#'+newBomb).hasClass('isBomb'))){
                $('#'+newBomb).addClass('isBomb');
            }else{
                --i;
            }
        }
        first=0;
    }
    createTable();
    $.fn.flag=function(){
        document.oncontextmenu = new Function ("return false");
        if($(this).hasClass('covered')){
            $(this).removeClass('covered');
            $(this).addClass('flagged');
            $(this).html(' <i class="fas fa-flag"></i> ');
            --totalBombs;
            if(totalBombs==0){
                var cells=rows*columns;
                var offset=0;
                for(var i=1; i<=cells; ++i){
                    if($('#'+i).hasClass('isBomb')&&$('#'+i).hasClass('flagged')){
                        offset=offset;
                    }else if($('#'+i).hasClass('isBomb')&&!($('#'+i).hasClass('flagged'))){
                        offset+=1;
                    }
                }
                if(!offset){
                    $('#totalBombs').html('<span id="win">You win! [x]</span>')
                    won=1;
                }else{
                    $('#totalBombs').html('<span id="bugs">You have '+offset+' flags off</span>')
                }
            }else{
                $('#totalBombs').html(totalBombs+' bombs');
            }
        }else{
            $(this).removeClass('flagged');
            $(this).addClass('covered');
            $(this).text('');
            ++totalBombs;
            $('#totalBombs').html(totalBombs+' bombs');
        }
    };
    $.fn.uncover = function(){
        if(!($(this).hasClass('flagged'))){
            if($(this).hasClass('isBomb')&&won==0){
                if(gotAir==1){
                    $('.isBomb').removeClass('covered');
                    $('.isBomb').addClass('bomb');
                    $('.isBomb').html(' <i class="fas fa-bomb"></i>');
                    won=-1;
                    $('#totalBombs').html('<span class="bugs">Play again! [X]</span>');
                }else{
                    $(this).flag();
                }
            }else if(!($(this).hasClass('isBomb'))&&won==0){
                $(this).removeClass('covered');
                $(this).addClass('air');
                gotAir=1;
                var position=parseInt($(this).attr('id'));
                var content=0;
                var cell1=position-columns-1;
                var cell2=position-columns;
                var cell3=position-columns+1;
                var cell4=position-1;
                var cell5=position+1;
                var cell6=position+columns-1;
                var cell7=position+columns;
                var cell8=position+columns+1;
                var leftEdge=cell1%columns==0;
                var rightEdge=cell3%columns==1;
                if($('#'+(cell1)).hasClass('isBomb')&&!leftEdge) ++content;
                if($('#'+(cell2)).hasClass('isBomb'))            ++content;
                if($('#'+(cell3)).hasClass('isBomb')&&!rightEdge)++content;
                if($('#'+(cell4)).hasClass('isBomb')&&!leftEdge) ++content;
                if($('#'+(cell5)).hasClass('isBomb')&&!rightEdge)++content;
                if($('#'+(cell6)).hasClass('isBomb')&&!leftEdge) ++content;
                if($('#'+(cell7)).hasClass('isBomb'))            ++content;
                if($('#'+(cell8)).hasClass('isBomb')&&!rightEdge)++content;
                switch(content){
                    case 0: content='';break;
                    case 1: $(this).css('background-color','#FFEDED');break;
                    case 2: $(this).css('background-color','#FFDBDB');break;
                    case 3: $(this).css('background-color','#FFC2C2');break;
                    case 4: $(this).css('background-color','#FCACAC');break;
                    case 5: $(this).css('background-color','#FF9C9C');break;
                    case 6: $(this).css('background-color','#FF8787');break;
                    case 7: $(this).css('background-color','#FC7777');break;
                    case 8: $(this).css('background-color','#FF5C5C');break;
                }
                $(this).text(content);
                if(content==0){
                    if($('#'+cell1).hasClass('covered')&&!leftEdge) $('#'+cell1).uncover();
                    if($('#'+cell2).hasClass('covered'))            $('#'+cell2).uncover();
                    if($('#'+cell3).hasClass('covered')&&!rightEdge)$('#'+cell3).uncover();
                    if($('#'+cell4).hasClass('covered')&&!leftEdge) $('#'+cell4).uncover();
                    if($('#'+cell5).hasClass('covered')&&!rightEdge)$('#'+cell5).uncover();
                    if($('#'+cell6).hasClass('covered')&&!leftEdge) $('#'+cell6).uncover();
                    if($('#'+cell7).hasClass('covered'))            $('#'+cell7).uncover();
                    if($('#'+cell8).hasClass('covered')&&!rightEdge)$('#'+cell8).uncover();
                }
            }
        }
    }
    $('#board').on('mousedown', '.covered, .flagged', function(event){
        switch(event.which){
            case 1: $(this).uncover();break;
            case 3: $(this).flag();break;
        }
    });
    $('#board').on('click', '.bugs, #win, #tableGenerator', function(){
        createTable();
    });
    $('#board').on('dblclick', '.air', function(){
                var position=parseInt($(this).attr('id'));
                var cell1=position-columns-1;
                var cell2=position-columns;
                var cell3=position-columns+1;
                var cell4=position-1;
                var cell5=position+1;
                var cell6=position+columns-1;
                var cell7=position+columns;
                var cell8=position+columns+1;
                var leftEdge=cell1%columns==0;
                var rightEdge=cell3%columns==1;
                if(!leftEdge) $('#'+cell1).uncover();
                              $('#'+cell2).uncover();
                if(!rightEdge)$('#'+cell3).uncover();
                if(!leftEdge) $('#'+cell4).uncover();
                if(!rightEdge)$('#'+cell5).uncover();
                if(!leftEdge) $('#'+cell6).uncover();
                              $('#'+cell7).uncover();
                if(!rightEdge)$('#'+cell8).uncover();
    });
}))