import processOpnFrmData from "./addOpinion.js";

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
//        getTemplate:(targetElm) =>
//            document.getElementById(targetElm).innerHTML =
//                document.getElementById("template-articles").innerHTML
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
    }

];

function createHtmlForMainPage(targetElm, curPage, totalCount) {
    curPage = parseInt(curPage);
    totalCount = parseInt(totalCount);
    const dataForRendering = {
        curPage:curPage,
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
//max 10
/*
function fetchAndDisplayArticles(targetElm){
    const url = "https://wt.kpi.fei.tuke.sk/api/article";

    function reqListener () {
        // stiahnuty text
        console.log(this.responseText)
        if (this.status == 200) {
            document.getElementById(targetElm).innerHTML =
                Mustache.render(
                    document.getElementById("template-articles").innerHTML,
                    JSON.parse(this.responseText)
                );
        } else {
            alert("Došlo k chybe: " + this.statusText);
        }

    }
    console.log(url)
    var ajax = new XMLHttpRequest();
    ajax.addEventListener("load", reqListener);
    ajax.open("GET", url, true);
    ajax.send();
    console.log("send")
}
*/
//20*64+x

function fetchAndDisplayArticles(targetElm,curPage,totalCount){
    let pom;
    let articles =[];
    let total;

    curPage=parseInt(curPage);
    totalCount=parseInt(totalCount);
    console.log(totalCount);

    let data4rendering={
        curPage:curPage,
        pageCount:totalCount,
        Articles:articles
    };

    if(curPage>1){
        data4rendering.prevPage=curPage-1;
    }
    if(curPage<totalCount){
        data4rendering.nextPage=curPage+1;
    }
    pom=(data4rendering.curPage*20)-20;
    const url = "https://wt.kpi.fei.tuke.sk/api/article?max=20&offset="+pom;
    console.log(url);
    function reqListener () {
//        console.log(this.responseText);
        articles = JSON.parse(this.responseText);
        data4rendering.Articles = articles;
        total = data4rendering.Articles.meta.totalCount;
        data4rendering.pageCount = parseInt(total/20)+1;
        console.log(data4rendering.pageCount, "pageCount");
        if (this.status == 200) {
            document.getElementById(targetElm).innerHTML =
                Mustache.render(
                    document.getElementById("template-articles").innerHTML,
                    data4rendering
                );
        } else {
            alert("chyba: " + this.statusText);
        }
    }

    console.log(data4rendering)
//    console.log(url)
    var ajax = new XMLHttpRequest();
    ajax.addEventListener("load", reqListener);
    ajax.open("GET", url, true);
    ajax.send();
//    console.log("send");
}
