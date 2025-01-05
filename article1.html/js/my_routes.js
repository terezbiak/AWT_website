import processOpnFrmData from "./addOpinion.js";
import articleFormsHandler from "./articleFormsHandler.js";
import processArtAddFrmData from "./addArt.js"


export default [
    {
        hash: "welcome",
        target: "router-view",
        getTemplate:(targetElm) =>
            document.getElementById(targetElm).innerHTML =
                document.getElementById("template-welcome").innerHTML
    },
    {
        hash: "articles",
        target: "router-view",
        getTemplate: fetchAndDisplayArticles
    },
    {
        hash: "opinions",
        target: "router-view",
        getTemplate: createOpinion
    },
    {
        hash: "addOpinion",
        target: "router-view",
        getTemplate: (targetElm) => {
            document.getElementById(targetElm).innerHTML = document.getElementById("template-addOpinion").innerHTML;
            document.getElementById("review").onsubmit = processOpnFrmData;
        }
    },
    {
        hash: "about",
        target: "router-view",
        getTemplate:(targetElm) =>
            document.getElementById(targetElm).innerHTML = document.getElementById("template-about").innerHTML
    },
    {
        hash:"article",
        target:"router-view",
        getTemplate: fetchAndDisplayArticleDetail
    },
    {
        hash: "artDelete",
        target: "router-view",
        getTemplate: deleteArticle
    },
    //NEW
    {
        hash:"artEdit",
        target:"router-view",
        getTemplate: editArticle
    },
    {
        hash:"commSend",
        target:"router-view",
        getTemplate:addNewComment
    },
    {
        hash:"artInsert",
        target:"router-view",
        getTemplate: (targetElm) => {
            document.getElementById(targetElm).innerHTML =
                document.getElementById("template-article-add").innerHTML;
            if(auth2.isSignedIn.get()){
                document.getElementById("author1").value = auth2.currentUser.get().getBasicProfile().getName();
            }
            document.getElementById("articleFormAdd").onsubmit = processArtAddFrmData;
        }
    },
/*    {
        hash:"comments",
        target: "router-view",
        getTemplate:
    }*/

];

const urlBase = "https://wt.kpi.fei.tuke.sk/api";
const articlesPerPage = 20;

function createHtmlForMainPage(targetElm, curPage, totalCount) {
    curPage = parseInt(curPage);
    totalCount = parseInt(totalCount);
    const dataForRendering = {
        currentPage:curPage,
        pageCount:totalCount
    };
    if(curPage>1) {
        dataForRendering.prevPage=curPage-1;
    }
    if(curPage<totalCount){
        dataForRendering.nextPage=curPage+1;
    }

    document.getElementById(targetElm).innerHTML = Mustache.render(
        document.getElementById("template-main").innerHTML,
        dataForRendering
    );
}

function createOpinion(targetElm){
    const opinionsFromStorage = localStorage.myPageComments;
    let opinions=[];

    if(opinionsFromStorage) {
        opinions=JSON.parse(opinionsFromStorage);
        opinions.forEach(opinion => {
            opinion.created = (new Date(opinion.created)).toDateString();
        });
    }

    document.getElementById(targetElm).innerHTML = Mustache.render(
        document.getElementById("template-opinions").innerHTML,
        opinions
    );
}

function fetchAndDisplayArticles(targetElm, curPage, totalCountFromHash){
    curPage=Number(curPage);
    totalCountFromHash=Number(totalCountFromHash);
    let urlQuery = "";

    let offset;
    let articles =[];
    let total;

    let idsArray = [];

    let arrayForIDSArray = {
        idcko:[]
    };



    let data4rendering={
        currPage:curPage,
        pageCount:totalCountFromHash,
        Articles:articles,
        idecka:arrayForIDSArray,
    };
    console.log(data4rendering);
    if(curPage>1){
        data4rendering.prevPage=curPage-1;
    }
    if(curPage<totalCountFromHash){
        data4rendering.nextPage=curPage+1;
    }

    offset=(data4rendering.currPage*20)-20;

    if (offset && totalCountFromHash){
        urlQuery=`?offset=${offset}&max=${articlesPerPage}`;
    }else{
        urlQuery=`?max=${articlesPerPage}`;
    }

    const url = `${urlBase}/article${urlQuery}`;
//    const url = `${urlBase}/article${urlQuery}&tag=rod draka`;

    let urlArray = [];


    function reqListener () {
        articles = JSON.parse(this.responseText);
        data4rendering.Articles = articles;

        for (let i = 0; i < 20; i++){
            try{
                //priradíme si id-čka z artiklov, aby sme s nimi vedeli pracovať
                idsArray.push(data4rendering.Articles.articles[i].id);
            }
            catch (e){
                break;
            }
        }
        //vytvoríme si url ku každému elementu v poli idsArray
        idsArray.forEach(e=>urlArray.push("https://wt.kpi.fei.tuke.sk/api/article/"+e));

        let articlesContent = []                //tu si nahrám kontent z url
        let cont;                               //pomocná premenná ku kontentu
//        console.log(url);
        function reww(){
            if (this.status == 200) {
                //načítavanie dát z url, ktoré sme si vytvorili v policko.forEach...
                cont = JSON.parse(this.responseText);
                //nahranie výsledku do poľa
                articlesContent.push(cont.content);
            }
            else{
                console.log("error")
            }
        }
        var ajax1 = new XMLHttpRequest();
        ajax1.addEventListener("load", reww);
        for(let i = 0;i<urlArray.length;i++){
            try{
                //nahrávanie zo servera všetkých vhodných údajov
                ajax1.open("GET", urlArray[i], false);
//                console.log(urlArray[i])
                ajax1.send();
            }
            catch (e){
                break;
            }
        }
//        console.log("urlArray");

        for(let i in idsArray){ //pre každé i v poli poličko
            let item = idsArray[i];
            arrayForIDSArray.idcko.push({
                "idcko":item   //si nahráme do idečka id daného artiklu
            })
        }
        for(let i = 0; i<20; i+=1){
            try{
                data4rendering.Articles.articles[i].content = articlesContent[i];
            }
            catch (e){
                break;
            }
        }

        data4rendering.idecka = arrayForIDSArray;
        data4rendering.nemamId = idsArray;

        total = data4rendering.Articles.meta.totalCount;  // počet článkov
        data4rendering.pageCount = parseInt(total/20)+1;

        if (this.status == 200) {
            addArtDetailLink2ResponseJson(data4rendering);
            document.getElementById(targetElm).innerHTML =
                Mustache.render(
                    document.getElementById("template-articles").innerHTML,
                    data4rendering
                );

        } else {
            const errMsgObj = {errMessage:this.responseText};
            document.getElementById(targetElm).innerHTML =
                Mustache.render(
                    document.getElementById("template-articles-error").innerHTML,
                    errMsgObj
                );
        }
    }
//    console.log(url);
//    console.log("url")
    var ajax = new XMLHttpRequest();
    ajax.addEventListener("load", reqListener);
    ajax.open("GET", url, true);
    ajax.send();
}

function addArtDetailLink2ResponseJson(data4rendering){
    data4rendering.Articles.articles = data4rendering.Articles.articles.map(
        article =>(
            {
                ...article,
                detailLink:`#article/${article.id}/${data4rendering.currPage}/${data4rendering.pageCount}/1/4`
            }
        )
    );
}

function fetchAndDisplayArticleDetail(targetElm,artIdFromHash,offsetFromHash,totalCountFromHash, curPage, totalCountOfComments) {
    fetchAndProcessArticle(...arguments,false);
}

function fetchAndProcessArticle(targetElm,artIdFromHash,offsetFromHash,totalCountFromHash,currentPage, totalComments, forEdit){

    let responseJSON;

    let data4rendering = {
        response:responseJSON,
    };
    const url = `${urlBase}/article/${artIdFromHash}`;
    console.log("forEdit", forEdit);
    function reqListener () {
        if (this.status == 200) {
            responseJSON = JSON.parse(this.responseText)
            console.log("som tu")
            if(forEdit){
                console.log("som v edite")
                data4rendering.formTitle="Article Edit";
                data4rendering.submitByTitle = "Save Article";
                data4rendering.response = responseJSON;
                data4rendering.author = responseJSON.author;
                data4rendering.title = responseJSON.title;
                data4rendering.imageLink = responseJSON.imageLink;
                data4rendering.content = responseJSON.content;
                data4rendering.tags = responseJSON.tags;
                console.log("som v edite - na konci")

                document.getElementById(targetElm).innerHTML =
                    Mustache.render(
                        document.getElementById("template-article-form").innerHTML,
                        data4rendering
                    );
                if(!window.artFrmHandler){
                    window.artFrmHandler= new articleFormsHandler("https://wt.kpi.fei.tuke.sk/api");
                }
                window.artFrmHandler.assignFormAndArticle("articleForm","hiddenElm",artIdFromHash,offsetFromHash,totalCountFromHash);
            }
            else{
                console.log("elseeeeeee")
                responseJSON.backLink=`#articles/${offsetFromHash}/${totalCountFromHash}`;
                responseJSON.editLink= `#artEdit/${responseJSON.id}/${offsetFromHash}/${totalCountFromHash}/1/1`;
                responseJSON.deleteLink= `#artDelete/${responseJSON.id}/${offsetFromHash}/${totalCountFromHash}`;
                responseJSON.addCommLink=`#commSend/${responseJSON.id}/${offsetFromHash}/${totalCountFromHash}`;
                data4rendering.response = responseJSON;

                let totalCount = Number(totalCountFromHash);
                data4rendering.totalCount = totalCount;
                data4rendering.offset = Number(offsetFromHash);

                //COMMENTY
                let currComm = Number(currentPage);
                data4rendering.currPage = currComm;
                data4rendering.commentsCount = Number(totalComments);

                if (currComm>1) {
                    data4rendering.prevPage = currComm - 1;
                }
                if (currComm<totalComments){
                    data4rendering.nextPage = currComm + 1;
                }
                data4rendering.id = artIdFromHash;

                function ReqListenerComm() {
                    if (this.status === 200) {
                        let JSONcomment = JSON.parse(this.responseText);
                        data4rendering.comments = JSONcomment.comments;
                        data4rendering.commentsCount = Math.ceil(JSONcomment.meta.totalCount/2);
                        console.log("d4r",data4rendering)
                    }
                }
                let pom = (currComm*2)-2;

                const urlCom = `http://wt.kpi.fei.tuke.sk/api/article/${artIdFromHash}/comment/?max=2&offset=${pom}`;
                console.log(urlCom, "urlCOm")
                var ajax = new XMLHttpRequest();
                ajax.addEventListener("load",ReqListenerComm);
                ajax.open("GET", urlCom, false);
                ajax.send();

                document.getElementById(targetElm).innerHTML =
                    Mustache.render(
                        document.getElementById("template-article").innerHTML,
                        data4rendering
                    );
            }
        } else {
            const errMsgObj = {errMessage:this.responseText};
            document.getElementById(targetElm).innerHTML =
                Mustache.render(
                    document.getElementById("template-articles-error").innerHTML,
                    errMsgObj
                );
        }
    }
    console.log(url, "url");
    var ajax = new XMLHttpRequest();
    ajax.addEventListener("load", reqListener);
    ajax.open("GET", url, true);
    ajax.send();
}

//NEW
function editArticle(targetElm,artIdFromHash,offsetFromHash,totalCountFromHash,currentPage, totalComments) {
    fetchAndProcessArticle(...arguments,true);
}

function deleteArticle(targetElm, artIdFromHash, offsetFromHash, totalCountFromHash) {
    const url = `${urlBase}/article/${artIdFromHash}`;
//    console.log(offsetFromHash, "offsetFromHash-začiatok delete");
    const postReqSettings =
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            }
        };

    fetch(url, postReqSettings)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
            }
        })
        .catch(error => {
            const errMsgObj = {errMessage: error};
            document.getElementById(targetElm).innerHTML =
                Mustache.render(
                    document.getElementById("template-articles-error").innerHTML,
                    errMsgObj
                );
        })
        .finally(() => {
            window.location.href = `#articles/${offsetFromHash}/${totalCountFromHash}`;
//            console.log(offsetFromHash, "offsetFromHash-koniec delete");
        });
}

function addNewComment(targetElm,artIdFromHash,offsetFromHash,totalCountFromHash, curPage, totalCountOfComments) {
    console.log(offsetFromHash, "offsetFromHash");
    console.log(totalCountFromHash, "totalCountFromHash");
    console.log(curPage, "curPage");
    console.log(totalCountOfComments, "totalCountOfComments");

    const newComment = {
        text: document.getElementById("commentContent").value.trim(),
        author: document.getElementById("commentAuthor").value.trim(),
    }
    if (auth2.isSignedIn.get()){
        newComment.author = auth2.currentUser.get().getBasicProfile().getGivenName();
    }
    function reqListener() {
        if (this.status == 201) {
            console.log(this.responseText);
        }
        else {
            alert("CHYBA!");
            console.log("NIE JE DOBRÝ RESPONSE");
            console.log(this.responseText);
        }
    }

    const url = `https://wt.kpi.fei.tuke.sk/api/article/${artIdFromHash}/comment`
    var ajax = new XMLHttpRequest();
    ajax.addEventListener("load", reqListener);
    ajax.open("POST", url, false);
    ajax.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    ajax.send(JSON.stringify(newComment));
//    window.location.hash = "#welcome";
    window.location.hash = `#article/${artIdFromHash}/${offsetFromHash}/${totalCountFromHash}`;
    document.getElementById("sendComment").onclick = document.getElementById("addCommentForm").reset();
}

