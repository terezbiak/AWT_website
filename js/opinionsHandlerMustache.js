import OpinionsHandler from "./opinionsHandler.js";
import Mustache from "./mustache.js";

export default class OpinionsHandlerMustache extends OpinionsHandler{

    constructor(opinionsFormElmId, opinionsListElmId,templateElmId) {

        //call the constructor from the superclass:
        super(opinionsFormElmId, opinionsListElmId);

        //get the template:
        this.mustacheTemplate=document.getElementById(templateElmId).innerHTML;
    }

    opinion2html(opinion){

        const opinionView ={
            name: opinion.name,
            url: opinion.url,
            comment: opinion.comment,
            like: opinion.like?"Stránka sa mi páči":"Stránka sa mi nepáči",
            keyWord: opinion.keyWord,
            createdDate: (new Date(opinion.created)).toDateString(),
            content: opinion.content?"Chcel/-a by som viac na danú tému.":"Stačilo mi."
        };

        return Mustache.render(this.mustacheTemplate,opinionView);

    }
}