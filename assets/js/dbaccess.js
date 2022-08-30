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

  

if($('#LHighestScore_1').length>0 || $('#LHighestScore_2').length>0 || $('#LVleaderboard_1').length >0 || $('#LVleaderboard_2').length >0){
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
                NewList = MyList.filter(item => item.GameID == 1 && !isNaN(item.Score) && parseInt(item.Score)<400);
                BindLeaderBoardList(NewList, 1);
            }
            if($('#LHighestScore_2').length>0 || $('#LVleaderboard_2').length >0){
                NewList = MyList.filter(item => item.GameID == 2 && !isNaN(item.Score) && parseInt(item.Score)<400);
                BindLeaderBoardList(NewList, 2);
            }
        }
    }
}

window.updateUserScore = async function(GameID){
    var name = $("#TBName").val();
    var score = $("#LScore").text();
    if(!isNaN(score) && parseInt(score)<400){
        await addDoc(collection(db,'LeaderBoard'),{
            Name: name,
            Score: score,
            GameID: parseInt(GameID),
        });
        window.location.href = 'game_end/index.html?score='+score;
    }
}


function BindLeaderBoardList(MyList, GameID){
    var CurScore = GetURLParameter('score');
    $('#LCurScore').text(CurScore);
    if(MyList.length>0){
        MyList.sort((a,b)=>b.Score-a.Score);
        var index=1;
        
        $('#LHighestScore_'+GameID).text('Name: {0} / Score: {1}'.format(MyList[0].Name, MyList[0].Score));
        var total =10;
        var content;
        for(const item of MyList){
            if(index>total){
                return;
            }
            content = 'Rank {0} --- Name: {1} ---- Score: {2}'.format(index,item.Name, item.Score);
            if(index<=3){
                $('#l{0}_{1}'.format(index, GameID)).text(content);
            }else{
                $('#LVleaderboard_'+GameID).append("<li class='list-group-item list-group-item-danger'>"+content+"</li>");
            }
            index++;
        }
    }
}
