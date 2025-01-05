export default function processArtAddFrmData(event) {
    event.preventDefault();
    const articleData = {
        title: document.getElementById("title1").value.trim(),
        content: document.getElementById("content1").value.trim(),
        author: document.getElementById("author1").value.trim(),
        imageLink: document.getElementById("imageLink1").value.trim(),
        tags: document.getElementById("tags1").value.trim()
    }
    if (auth2.isSignedIn.get()){
        articleData.author = auth2.currentUser.get().getBasicProfile().getGivenName();
    }
    if (!articleData.author) {
        articleData.author = "Anonym";
    }
    else {
        articleData.author = document.getElementById("author1").value.trim();
    }
    if (!articleData.imageLink) {
        delete articleData.imageLink;
    }
    if (!articleData.tags) {
        delete articleData.tags;
    }
    else {
        articleData.tags = articleData.tags.split(",");
        articleData.tags = articleData.tags.map(tag => tag.trim());
        articleData.tags = articleData.tags.filter(tag => tag);
        if (articleData.tags.length == 0) {
            delete articleData.tags;
        }
        function reqListener() {
            console.log(this.status);
            if(this.status == 201){
                alert("Dáta boli odoslané.");
            }
            else {
                alert("Nastala chyba.");
                console.log("Niečo je s response");
                console.log(this.responseText);
            }
        }
        const url = `https://wt.kpi.fei.tuke.sk/api/article`
        var ajax = new XMLHttpRequest();
        ajax.addEventListener("load", reqListener);
        ajax.open("POST", url, false);
        ajax.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        ajax.send(JSON.stringify(articleData));
        document.getElementById('btn').disabled = true;
        document.getElementById('btn').value = "sent";
        window.location.hash = "#welcome";
    }
}