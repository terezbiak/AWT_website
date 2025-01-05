let auth2 = {};

function renderUserInfo(googleUser, htmlElmId) {
    document.getElementById("hide").style.display = "none";
    document.getElementById("userName1").style.display = "none";
    const profile = googleUser.getBasicProfile();
    document.getElementById()
    const htmlStringSk=
        `
            <p>Používateľ prihlásený</p>
            <ul>
                <li> ID: ${profile.getId()}
                <li>  Plné meno: ${profile.getName()}
                <li>  Krstné meno: ${profile.getGivenName()}
                <li>  Priezvisko: ${profile.getFamilyName()}
                <li>  URL obrázka: ${profile.getImageUrl()}
                <li>  Email: ${profile.getEmail()}
            </ul>
        `;
    const htmlStringEn=
        `
            <p>User logged in.</p>
            <ul>
                <li> ID: ${profile.getId()}
                <li>  Full name: ${profile.getName()}
                <li>  Given name: ${profile.getGivenName()}
                <li>  Family name: ${profile.getFamilyName()}
                <li>  Image URL: ${profile.getImageUrl()}
                <li>  Email: ${profile.getEmail()}
            </ul>
        `;
    //Id z profile.getId() sa nema pouzivat na komunikaciu s vlastnym serverom (you should not use the id from profile.getId() for communication with your server)
    document.getElementById("userStatus").innerHTML=htmlStringSk;
}

function renderLogOutInfo(htmlElmId) {
    const htmlString=
        `
                <p>Používateľ nie je prihlásený</p>
                `;
    document.getElementById(htmlElmId).innerHTML=htmlString;
}

function signOut() {
    if(auth2.signOut) auth2.signOut();
    if(auth2.disconnect) auth2.disconnect();
    // document.getElementById("userName").innerHTML=user.getBasicProfile().getName();
}

function userChanged(user){
    // document.getElementById("userName").innerHTML=user.getBasicProfile().getName();

    var userInfoElm = document.getElementById("userStatus");
    var userNameInputElm = document.getElementById("author");

    if(userInfoElm ){
        renderUserInfo(user,"userStatus");
    }else if (userNameInputElm){
        userNameInputElm.value=user.getBasicProfile().getName();
    }
}

var updateSignIn = function() {
    var sgnd = auth2.isSignedIn.get();
    if (sgnd) {
        // window.location.reload();
        document.getElementById("SignInButton").classList.add("hiddenElm");
        document.getElementById("SignedIn").classList.remove("hiddenElm");
        document.getElementById("userName").innerHTML=auth2.currentUser.get().getBasicProfile().getGivenName();
        document.getElementById("userName1").innerHTML=auth2.currentUser.get().getBasicProfile().getName();
        document.getElementById("hide").style.display = "block";
        document.getElementById("userName1").style.display = "none";
        document.getElementById("userName").style.display = "block";

    }else{
        document.getElementById("SignInButton").classList.remove("hiddenElm");
        document.getElementById("SignedIn").classList.add("hiddenElm");
        document.getElementById("hide").style.display = "none";
        document.getElementById("userName1").style.display = "none";
        document.getElementById("userName").style.display = "none";
    }

    var userInfoElm = document.getElementById("userStatus");
    var userNameInputElm = document.getElementById("author1");

    if(userInfoElm ){
        if (sgnd) {
            renderUserInfo(auth2.currentUser.get(),"userStatus");

        }else{
            renderLogOutInfo("userStatus");
        }
    }else if (userNameInputElm){
        if (sgnd) {
            userNameInputElm.value=auth2.currentUser.get().getBasicProfile().getName();
        }else{
            userNameInputElm.value="";
        }
    }

}

function startGSingIn() {
    gapi.load('auth2', function() {
        gapi.signin2.render('SignInButton', {
            'width': 180,
            // 'height': 50,
            'longtitle': true,
            'theme': 'light',
            'onsuccess': onSuccess,
            'onfailure': onFailure
        });
        gapi.auth2.init().then( //zavolat po inicializácii OAuth 2.0  (called after OAuth 2.0 initialisation)
            function (){
                console.log('init');
                auth2 = gapi.auth2.getAuthInstance();
                auth2.currentUser.listen(userChanged);
                auth2.isSignedIn.listen(updateSignIn);
                auth2.then(updateSignIn);
            });
    });

}

function onSuccess(googleUser) {
    console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
}
function onFailure(error) {
    console.log(error);
}