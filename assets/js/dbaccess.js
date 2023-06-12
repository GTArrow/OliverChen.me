import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js';
import { getFirestore, collection, getDocs, addDoc, setDoc, doc} from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js';
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-auth.js";

$.extend(
    {
      redirectPost: function(location, args)
      {
          var form = $('<form></form>');
          form.attr("method", "get");
          form.attr("action", location);
  
          $.each( args, function( key, value ) {
              var field = $('<input></input>');
  
              field.attr("type", "hidden");
              field.attr("name", key);
              field.attr("value", value);
  
              form.append(field);
          });
          $(form).appendTo('body').submit();
      }
    });

if (!String.prototype.format) {
    String.prototype.format = function(...args) {
        return this.replace(/(\{\d+\})/g, function(a) {
        return args[+(a.substr(1, a.length - 2)) || 0];
        });
    }
}

const GetURLParameter = (sParam) => {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}
//If you see this, stop thinking about copying my API key and messing my database in your localhost. :)
const firebaseConfig = {
    apiKey: "AIzaSyDoA_EfJafLF9UluD65ne8VTiKCg2cOO80",
    authDomain: "oliverchenme-14268.firebaseapp.com",
    projectId: "oliverchenme-14268",
    storageBucket: "oliverchenme-14268.appspot.com",
    messagingSenderId: "407718051896",
    appId: "1:407718051896:web:ab3359c4b176377fad26cd"
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth(app);
signInAnonymously(auth)
  .then(() => {
    console.log("signed in");
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });

  

if($('#LHighestScore_1').length>0 || $('#LHighestScore_2').length>0 || $('#LHighestScore_3').length>0  || $('#LVleaderboard_1').length >0 || $('#LVleaderboard_2').length >0 || $('#LVleaderboard_3').length >0){
    window.onload = async function() {
        const Col = collection(db, 'LeaderBoard');
        const Snapshot = await getDocs(Col);

        // //Add extra field
        // for(var mydoc of Snapshot.docs){
        //     await setDoc(doc(db, "LeaderBoard", mydoc.id), {GameID: 1}, {merge: true});
        // }
        const MyList = Snapshot.docs.map(doc => doc.data());

        if(MyList.length>0){
            
            var NewList;
            if($('#LHighestScore_1').length>0 || $('#LVleaderboard_1').length >0){
                NewList = MyList.filter(item => item.GameID === 1 && !isNaN(item.Score) && parseInt(item.Score)<400);
                BindLeaderBoardList(NewList, 1);
            }
            if($('#LHighestScore_2').length>0 || $('#LVleaderboard_2').length >0){
                NewList = MyList.filter(item => item.GameID === 2 && !isNaN(item.Score) && parseInt(item.Score)<400);
                BindLeaderBoardList(NewList, 2);
            }
            if($('#LHighestScore_3').length>0  || $('#LVleaderboard_3').length >0){
                NewList = MyList.filter(item => item.GameID === 3 && !isNaN(item.Score) && parseInt(item.Score)<400);
                BindLeaderBoardList(NewList, 3);
            }
        }
    }
}

window.updateUserScore = async function(GameID){
    var name = $("#TBName").val();
    var score = $("#HScore").val();
    var level = $("#HLevel").val();
    console.log(score)
    console.log(level)
    var option = {
        Name: name,
        Score: score,
        GameID: parseInt(GameID),
    };
    if(level!==null && level!==undefined){
        if(level===''){
            level ='0';
        }
        option.MaxLevel = level;
    }
    if(!isNaN(score) && parseInt(score)<400){
        await addDoc(collection(db,'LeaderBoard'),option);
        window.location.href = '../leaderboard/index.html';
        //window.location.href = 'game_end/index.html?score='+score;
    }
}


function BindLeaderBoardList(MyList, GameID){
    var CurScore = GetURLParameter('score');
    $('#LCurScore').text(CurScore);
    if(MyList.length>0){
        if(GameID===3){
            MyList.sort((a,b)=>(b.MaxLevel-a.MaxLevel == 0)? (a.Score-b.Score): (b.MaxLevel-a.MaxLevel));
        }
        else{
            MyList.sort((a,b)=>b.Score-a.Score);
        }
        let name = MyList[0].Name.substring(0, 15);
        var index=1;
        if(GameID===3){
            $('#LHighestScore_'+GameID).text('Name: {0} / Level: {1} / Steps: {2}'.format(name, MyList[0].MaxLevel ,MyList[0].Score));
        }else{
            $('#LHighestScore_'+GameID).text('Name: {0} / Score: {1}'.format(name, MyList[0].Score));
        }
        var total =10;
        var content;
        for(const item of MyList){
            name = item.Name.substring(0, 15);
            if(index>total){
                return;
            }
            if(GameID===3){
                content = 'Rank {0} --- Name: {1} ---- Max Level: {2} --- Total Steps: {3}'.format(index,name, item.MaxLevel, item.Score);
            }else{
                content = 'Rank {0} --- Name: {1} ---- Score: {2}'.format(index,name, item.Score);
            }
            if(index<=3){
                $('#l{0}_{1}'.format(index, GameID)).text(content);
            }else{
                $('#LVleaderboard_'+GameID).append("<li class='list-group-item list-group-item-danger'>"+content+"</li>");
            }
            index++;
        }
    }
}
