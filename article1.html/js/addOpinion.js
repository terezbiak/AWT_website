export default function processOpnFrmData(event) {
    event.preventDefault();

    const namen = document.getElementById("name").value.trim();
    const commentc = document.getElementById("review_text").value.trim();
    let content = document.getElementById("content1").checked;
    const emaile = document.getElementById("email").value.trim();
    const urlu = document.getElementById("url").value.trim();
    const like = document.getElementById('like').checked;
    const dislike = document.getElementById('dislike').checked;
    const keyWordk = document.getElementById("key_word").value.trim();
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
        name: namen,
        email: emaile,
        comment: commentc,
        url: urlu,
        like: likey,
        content1: content,
        keyWord: keyWordk,
        created: new Date()
    };

    let opinions = [];

    if(localStorage.myPageComments) {
        opinions = JSON.parse(localStorage.myPageComments);
    }
    opinions.push(newOpinion);
    localStorage.myPageComments = JSON.stringify(opinions);
    window.location.hash="#opinions";
}