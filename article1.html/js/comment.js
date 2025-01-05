export function commenty(){
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


}