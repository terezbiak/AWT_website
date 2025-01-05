export default class articleFormsHandler {

    constructor(articlesServerUrl) {
        this.serverUrl=articlesServerUrl;
    }

    assignFormAndArticle(formElementId, cssClass2hideElement,articleId,offset,totalCount){
        this.cssCl2hideElm  = cssClass2hideElement;
        const artForm=document.getElementById(formElementId);
        this.formElements=artForm.elements;

        if(articleId>=0){
            artForm.onsubmit= (event)=>this.processArtEditFrmData(event);
            this.articleId = articleId;
            this.offset = offset;
            this.totalCount = totalCount;
        }else{
            //functionality for adding a new article can go here
        }

    }

    processArtEditFrmData(event) {
        event.preventDefault();

        const articleData = {
            title: this.formElements.namedItem("title").value.trim(),
            content: this.formElements.namedItem("content").value.trim(),
            author: this.formElements.namedItem("author").value.trim(),
            imageLink: this.formElements.namedItem("imageLink").value.trim(),
            tags: this.formElements.namedItem("tags").value.trim()
        };

        if (!(articleData.title && articleData.content)) {
            window.alert("Please, enter article title and content");
            return;
        }
        if (auth2.isSignedIn.get()){
            articleData.author = auth2.currentUser.get().getBasicProfile().getGivenName();
        }
        if (!articleData.author) {
            articleData.author = "Anonymous";
        }

        if (!articleData.imageLink) {
            delete articleData.imageLink;
        }

        if (!articleData.tags) {
            delete articleData.tags;
        } else {
            articleData.tags = articleData.tags.split(",");
            articleData.tags = articleData.tags.map(tag => tag.trim());
            articleData.tags = articleData.tags.filter(tag => tag);

            if (articleData.tags.length == 0) {
                delete articleData.tags;
            }
        }

        const postReqSettings =
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify(articleData)
            };

        fetch(`${this.serverUrl}/article/${this.articleId}`, postReqSettings)  //now we need the second parameter, an object wih settings of the request.
            .then(response => {      //fetch promise fullfilled (operation completed successfully)
                if (response.ok) {    //successful execution includes an error response from the server. So we have to check the return status of the response here.
                    return response.json(); //we return a new promise with the response data in JSON to be processed
                } else { //if we get server error
                    return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`)); //we return a rejected promise to be catched later
                }
            })
            .then(responseJSON => { //here we process the returned response data in JSON ...
                window.alert("Updated article successfully saved on server");
            })
            .catch(error => { ////here we process all the failed promises
                window.alert(`Failed to save the updated article on server. ${error}`);

            })
            .finally(() => window.location.hash = `#article/${ this.articleId}/${ this.offset}/${ this.totalCount}`);

    }
}

