class Message {

    constructor(details) {
        this.source = details.source;
        this.destinaires = details.destinaires;
        this.objet = details.objet;
        this.content = details.content;
        this.attachments = details.attachments;
    }
}