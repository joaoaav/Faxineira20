var LoginView  = function() {
	
	this.initialize = function() {
        this.el = $('body');
        
        this.el.on('click', '.btn-login', this.login);
    };
    
    this.render = function() {
    	this.el.html(app.cabecalhoTemplate());
	    this.el.find('.scroll').html(LoginView.conteudoTemplate());
	    
	    return this;
	};
		
	this.login = function(event) {
	    event.preventDefault();
	    console.log('login');
	    
	    var usuario = $('#login-usuario').val().trim();
	    var senha = $('#login-senha').val().trim();
	    
	    if (usuario == null || usuario == ''){
	    	app.showAlert('Favor digitar o usuário',"Login");
			return false;
	    }
	    
	    if (senha == null || senha == ''){
	    	app.showAlert('Favor digitar a senha',"Login");
			return false;
	    }
	    
	    if (usuario == 'joao' && senha == 'joao'){
	    	var user = new Object();
	    	user.logado = '1';
	    	user.id = 1;
	    	user.nome = 'João';
	    	user.endereco = new Object();
	    	user.endereco.rua = 'Rua 1';
	    	user.endereco.bairro = 'Bairro 1';
	    	user.endereco.cidade = 'Cidade 1';
	    	user.endereco.estado = 'Estado 1';
	    	user.endereco.pais = 'Pais 1';
	    	user.endereco.cep = '02151-981';
	    	
	    	app.store.setUsuario(user);
	    	
	    	parent.history.back();
	    	return true;
	    }else{
	    	app.showAlert('Usuário inválido',"Login");
			return false;
	    }
	};
 
    this.initialize();
};

LoginView.conteudoTemplate = Handlebars.compile($("#login-tpl").html());
