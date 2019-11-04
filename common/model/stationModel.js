class Station {

    constructor(details) {
        this.nom = details.nom;
        this.ville = details.ville;
        this.location = details.location;
        this.serviceClient = details.service_client;
        this.responsable = details.tmg;
        this.gerant = details.gerant;
    }
}