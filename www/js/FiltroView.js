var FiltroView  = function() {
	
    this.initialize = function() {
        this.el = $('<div/>');
    };
    
    this.render = function() {
    	this.el.html(app.cabecalhoTemplate());
	    this.el.append(FiltroView.conteudoTemplate());
	    
	    alert(sessionStorage.getItem('cepFiltro'));
	    app.showAlert(sessionStorage.getItem('cepFiltro'),"test")
	    
	    return this;
	};
 
    this.initialize();
};

FiltroView.conteudoTemplate = Handlebars.compile($("#filtro-tpl").html());
