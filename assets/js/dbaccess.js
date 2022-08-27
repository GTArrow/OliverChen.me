import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js';
import { getFirestore, collection, getDocs, addDoc} from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js';

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

window.onload = async function() {
    const Col = collection(db, 'LeaderBoard');
    const Snapshot = await getDocs(Col);
    const MyList = Snapshot.docs.map(doc => doc.data());
    var index=1;
    if(MyList.length>0){
        MyList.sort((a,b)=>b.Score-a.Score);
        var CurScore = GetURLParameter('score');
        $('#LCurScore').text(CurScore);
        $('#LHighestScore').text('Name: {0} / Score: {1}'.format(MyList[0].Name, MyList[0].Score));
        var total =10;
        var content;
        for(const item of MyList){
            if(index>total){
                return;
            }
            content = 'Rank {0} --- Name: {1} ---- Score: {2}'.format(index,item.Name, item.Score);
            if(index<=3){
                $("#l"+index).text(content);
            }else{
                $('#LVleaderboard').append("<li class='list-group-item list-group-item-danger'>"+content+"</li>");
            }
            index++;
        }
    }
}

window.updateUserScore = async function(){
    var name = $("#TBName").val();
    var score = $("#LScore").text();
    await addDoc(collection(db,'LeaderBoard'),{
        Name: name,
        Score: score
    });
    var redirect = 'game_end';
    //$.redirectPost(redirect);
    window.location.href = 'game_end/index.html?score='+score;
}