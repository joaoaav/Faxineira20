var InicioView  = function() {
	
    this.initialize = function() {
        this.el = $('<div/>');
        
        this.el.on('click', '.buscar-cep', this.buscaCep);
        
    };
    
    this.render = function() {
    	this.el.html(app.cabecalhoTemplate());
	    this.el.append(InicioView.conteudoTemplate());
	    return this;
	};
		
	this.buscaCep = function(event) {
	    event.preventDefault();
	    console.log('buscaCep');
	    
	    alert($('#cep-busca').val());
	    sessionStorage.setItem('cepFiltro',$('#cep-busca').val());
	    
	    window.location="index.html#filtro";
	    return true;
	};
 
    this.initialize();
};

InicioView.conteudoTemplate = Handlebars.compile($("#inicio-tpl").html());
