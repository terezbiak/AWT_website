/**
 * Class for  handling a list (an array) of visitor opinions in local storage
 * The list is filled from a form and rendered to html
 * A template literal is used to render the opinions list
 * @author Stefan Korecko (2021)
 */
export default class OpinionsHandler {

    /**
     * constructor
     * @param opinionsFormElmId - id of a form element where a new visitor opinion is entered
     * @param opinionsListElmId - id of a html element to which the list of visitor opinions is rendered
     */
    constructor(opinionsFormElmId, opinionsListElmId){ //("opnFrm","opinionsContainer")
        this.opinions = [];
        this.opinionsElm = document.getElementById(opinionsListElmId);
        this.opinionsFrmElm = document.getElementById("review");

    }

    /**
     * initialisation of the list of visitor opinions and form submit setup
     */
    init(){
        if (localStorage.myPageComments) {
            this.opinions = JSON.parse(localStorage.myPageComments);
        }
        this.opinionsElm.innerHTML = this.opinionArray2html(this.opinions);
        this.opinionsFrmElm.addEventListener("submit", event => this.processOpnFrmData(event));
    }

    /**
     * Processing of the form data with a new visitor opinion
     * @param event - event object, used to prevent normal event (form sending) processing
     */
    processOpnFrmData(event){
        //1.prevent normal event (form sending) processing
        event.preventDefault();

        //2. Read and adjust data from the form (here we remove white spaces before and after the strings)
        const nopName = this.opinionsFrmElm.elements["name"].value.trim(); // this.opinionsFrmElm.elements["login"] can be used, too
        const nopOpn = this.opinionsFrmElm.elements["review_text"].value.trim(); // this.opinionsFrmElm.elements["comment"] can be used, too
        const nopContent = this.opinionsFrmElm.elements["content"].checked;
        const nopEmail = this.opinionsFrmElm.elements["email"].value.trim();
        const nopURL = this.opinionsFrmElm.elements["url"].value.trim();
        const nopLike = this.opinionsFrmElm.elements["like"].value.trim();
        const nopKeyWord = this.opinionsFrmElm.elements["key_word"].value.trim();

        //3. Verify the data
        if(nopName=="" || nopOpn=="" || nopEmail=="" || nopKeyWord==""){
            window.alert("Vaše meno, email, spätná väzba a kľúčové slovo sú povinné");
            return;
        }

        //3. Add the data to the array opinions and local storage
        const newOpinion =
            {
                name: nopName,
                email: nopEmail,
                comment: nopOpn,
                url: nopURL,
                like: nopLike,
                content: nopContent,
                keyWord: nopKeyWord,
                created: new Date()
            };

        console.log("New opinion:\n "+JSON.stringify(newOpinion));

        this.opinions.push(newOpinion);

        localStorage.myPageComments = JSON.stringify(this.opinions);


        //4. Update HTML
        this.opinionsElm.innerHTML+=this.opinion2html(newOpinion);



        //5. Reset the form
        this.opinionsFrmElm.reset(); //resets the form
    }

    /**
     * creates html code for one opinion using a template literal
     * @param opinion - object with the opinion
     * @returns {string} - html code with the opinion
     */
    opinion2html(opinion){

        const opinionTemplate=
            `
			<section>
			   <h3>${opinion.name} <i>(${(new Date(opinion.created)).toDateString()})</i></h3>
               <p>${opinion.url}</p> 
			   <p>${opinion.comment}</p>
			   <p>${opinion.like?"Stránka sa mi páči":"Stránka sa mi nepáči"}</p>
			   <p>${opinion.keyWord}</p>
			   <p>${opinion.content?"Chcel/-a by som viac na danú tému.":"Stačilo mi."}</p>
			</section>`;
        return opinionTemplate;
    }

    /**
     * creates html code for all opinions in an array using the opinion2html method
     * @param sourceData -  an array of visitor opinions
     * @returns {string} - html code with all the opinions
     */
    opinionArray2html(sourceData){

        let htmlWithOpinions="";

        for(const opn of sourceData){
            htmlWithOpinions += this.opinion2html(opn);
        }

        return htmlWithOpinions;

    }

}



