var PessoasView  = function() {
	
    this.initialize = function() {
        this.el = $('<div/>');
    };
    
    this.render = function() {
    	this.el.html(app.cabecalhoTemplate());
	    this.el.append(PessoasView.conteudoTemplate());
	    
	    //alert(sessionStorage.getItem('cepFiltro'));
	    //app.showAlert(sessionStorage.getItem('cepFiltro'),"Filtro")
	    
	    return this;
	};
 
    this.initialize();
};

PessoasView.conteudoTemplate = Handlebars.compile($("#pessoas-tpl").html());
