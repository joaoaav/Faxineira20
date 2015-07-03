var PessoaDetalheView  = function(pessoa) {
	
    this.initialize = function() {
        this.el = $('body');
        this.el.on('click', '.btn-remover-pessoa', this.removerEmpregada);
        this.el.on('click', '.btn-logout', app.logout);
    };
    
    this.render = function() {
    	this.el.html(app.cabecalhoTemplate());
    	
    	var usuario = app.store.getUsuario();
    	this.el.find('.scroll').append(PessoaDetalheView.template({pessoa:pessoa, usuario:usuario}));
		return this;
	};
		
	this.removerEmpregada = function(event) {
	    event.preventDefault();
	    console.log('removerEmpregada');
	    
	    var id = $(this).attr('pessoaId');
	    
	    var pessoas = app.store.buscaEmpregadas(true);
	    
	    for (i = 0; i < pessoas.length; ++i) {
	    	if(pessoas[i].id == id){
	    		pessoas.splice(i, 1);
	    		break;
	    	}
	    }
	    
	    window.sessionStorage.setItem("pessoas", JSON.stringify(pessoas));
	    
	    window.location="index.html#pessoas";
	    return false;
	};
 
    this.initialize();
};

PessoaDetalheView.template = Handlebars.compile($("#pessoaDetalhe-tpl").html());
