var PessoasView  = function(memory) {
	
    this.initialize = function() {
        this.el = $('<div/>');
        
        this.el.on('click', '.btn-proximo-pessoas', this.proximo);
        this.el.on('click', '.btn-logout', app.logout);
    };
    
    this.render = function() {
    	this.el.html(app.cabecalhoTemplate());
    	
    	var pessoas = this.buscarPessoas(memory);
    	var usuario = app.store.getUsuario();
    	
    	//window.sessionStorage.setItem("pessoas", JSON.stringify(pessoas));
    	
    	this.el.append(PessoasView.conteudoTemplate({pessoas:pessoas, usuario:usuario}));
	    return this;
	};
	
	this.proximo = function(memory) {
		var pessoas = app.store.buscaEmpregadas(memory);
		
		app.store.setLimpezaDetalhe('faxineiras',pessoas);
		
		window.location="index.html#limpezaDetalhe";
	    return false;
	}
	
	this.buscarPessoas = function(memory) {
		var pessoas = app.store.buscaEmpregadas(memory);
		/*var pessoas = new Array();
		for (i = 0; i < 5; i++) { 
			var pessoa = new Object();
			pessoa.nome = 'lalala '+i;
			pessoa.imagem = 'profile-photo.jpg';
			pessoa.estrelas = 1;
			pessoa.habilidades = new Array('Geladeira', 'Janela');
			
			var recomendacao1 = new Object();
			recomendacao1.id = 1;
			recomendacao1.nome = 'Primeira';
			recomendacao1.descricao = 'Lalalala';
			recomendacao1.estrelas = 5;
			
			var recomendacao2 = new Object();
			recomendacao2.id = 2;
			recomendacao2.nome = 'Segunda';
			recomendacao2.descricao = 'Leleele';
			recomendacao2.estrelas = 4;
			
			pessoa.recomendacoes = new Array(recomendacao1, recomendacao2);
			pessoa.quantidadeRecomendacoes = pessoa.recomendacoes.length;
			pessoa.id = i;			
			
			pessoas.push(pessoa);
		}*/
		
		return pessoas;
	};
 
    this.initialize();
};

PessoasView.conteudoTemplate = Handlebars.compile($("#pessoas-tpl").html());
