export default function processOpnFrmData(event) {
    event.preventDefault();

    let content = document.getElementById("contentik").checked;
    const like = document.getElementById('like').checked;
    const dislike = document.getElementById('dislike').checked;
    let likey;

    if (like == true) {
        likey = "Stránka sa mi páči."
    }
    else if (dislike == true) {
        likey = "Stránka sa mi nepáči."
    }

    if (content == true) {
        content = "Chcel/-a by som viac na danú tému."
    }
    else if (content == false) {
        content = "Stačilo mi."
    }
    const newOpinion = {
        namer: document.getElementById("namer").value.trim(),
        email: document.getElementById("email").value.trim(),
        comment: document.getElementById("review_text").value.trim(),
        url: document.getElementById("url").value.trim(),
        like: likey,
        contentik: content,
        keyWord: document.getElementById("key_word").value.trim(),
        created: new Date()
    }
    if (auth2.isSignedIn.get()){
        newOpinion.namer = auth2.currentUser.get().getBasicProfile().getGivenName();
    }
/*
    const newOpinion = {
        namer: namen,
        email: emaile,
        comment: commentc,
        url: urlu,
        like: likey,
        contentik: content,
        keyWord: keyWordk,
        created: new Date()
    };*/

    let opinions = [];

    if(localStorage.myPageComments) {
        opinions = JSON.parse(localStorage.myPageComments);
    }
    opinions.push(newOpinion);
    localStorage.myPageComments = JSON.stringify(opinions);
    window.location.hash="#opinions";
}