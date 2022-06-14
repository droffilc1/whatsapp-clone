firebase.auth().onAuthStateChanged((user)=>{

    //check if user is logged in
    if(user){

        //get the id of the logged in user
        let userId = user.uid;

        //getting the timestamp
        const timeStamp = new Date();

        //pull all users
        firebase.firestore().collection("users").get().then((querySnapshot)=>{

            let content = '';

            querySnapshot.forEach((doc) =>{

                let userName = doc.data().userName;
                let phoneNumber = doc.data().phoneNumber;
                let userId = doc.data().userId;

                content += '<div class="messUserCont" onclick="viewUser(\''+userId+'\')">';
                    content += '<div class="messImgCont">';
                        content += '<p '+phoneNumber+'></p>';
                    content += '</div>';
                    content += '<div>';
                        content += '<h6> ' + userName + '</h6>';
                        content += '<p><i class="fa fa-envelope-o" aria-hidden="true"></i></p>'
                    content += '</div>';
                content += '</div>';

            })

            $("#showAllUsers").append(content)
        })


        ///run view user function
       window.viewUser =  function(value){

            //getting user base on the above userid

            firebase.firestore().collection("users").doc(value).get().then((doc)=>{

                let userName = doc.data().userName;
                let phoneNumber = doc.data().phoneNumber;

                document.getElementById("messageUserName").innerText = userName;
                document.getElementById("messageUserPic").innerText = phoneNumber
            })


            

            //send message
            document.getElementById("messageButton").onclick = function(){

                let messageInput = document.getElementById("messageInput").value;

                let sendMessage = firebase.firestore().collection("messages").doc();
                sendMessage.set({

                    messageTo: value,
                    messageFrom: userId,
                    timeStamp:timeStamp,
                    docId:sendMessage.id,
                    isRead:"false",
                    message:messageInput


                }).then(()=>{
                    window.location.href ="home.html" +"?" + value;
                })
            }

            //window.location.href ="messages.html" +"?" + value;

        }


        ///view messages
        let readMsgUserId = decodeURIComponent(window.location.search);
        let readMsgUserIdRcd = readMsgUserId.substring(1);


        firebase.firestore().collection("users").doc(readMsgUserIdRcd).get().then((doc)=>{
            let userName = doc.data().userName;
            let phoneNumber = doc.data().phoneNumber;

            document.getElementById("messageUserName").innerText = userName;
            document.getElementById("messageUserPic").innerText = phoneNumber
        })

        //read messages
        firebase.firestore().collection("messages").get().then((querySnapshot)=>{
            let content = '';
            querySnapshot.forEach((doc)=>{

                let message = doc.data().message;
                let messageFrom = doc.data().messageFrom;
                let messageTo = doc.data().messageTo;

                if(messageFrom == userId && messageTo == readMsgUserIdRcd){
                    content += '<div class="myMsgSent">'
                        content += '<p>' + message+'</p>'
                    content += '</div>'

                }else if(messageTo == userId && messageFrom == readMsgUserIdRcd ){
                    content += '<div class="myMsgReceived">'
                        content += '<p>' + message+'</p>'
                    content += '</div>'
                }

            
            })
            $("#allMessages").append(content);
        })


        // pull all messages

        firebase.firestore().collection("messages").get().then((querySnapshot)=> {
            querySnapshot.forEach((doc)=> {
                let message = doc.data().message;
                let messageFrom = doc.data().messageFrom;
                let messageTo = doc.data().messageTo;
                let timeStamp = doc.data().timeStamp;                
                let date = timeStamp.toDate()

                if(messageFrom === user.uid) {

                    let content = '';

                    content += `<div class="sentmessage">`
                    content += `<p>${message}</p>`
                    content += `<h5>${date}</h5>`
                    content += `</div>`



                    $("#sentholder").append(content)             
                    
                }

                if(messageTo === user.uid) {

                    let content = '';

                    content += `<div class="incomingmessage">`
                    content += `<p>${message}.</p>`
                    content += `<h5>${date}</h5>`
                    content += ` </div>`

                    $("#incomingmessages").append(content);                       
                   
                }
            })
        })



        


    }else{
        window.location.href = "register.html"
    }
})