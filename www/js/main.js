var app = {

    showAlert: function (message, title) {
		if (navigator.notification) {
        	navigator.notification.alert(message, null, title, 'OK');
    	} else {
        	alert(title ? (title + ": " + message) : message);
    	}
	},
	
	logout: function(event) {
		app.store.logout();
		location.reload();
		return true;
	},
    
    registerEvents: function() {
		$(window).on('hashchange', $.proxy(this.route, this));
		
		$('body').on('click', 'a[voltar="true"]', function(event) {
			window.sessionStorage.setItem("voltar", "1");
			parent.history.back();
	    	return false;
        });
		
		//$('body').on('mousedown', 'a', function(event) {
            //$(event.target).addClass('tappable-active');
        //});
        
		//$('body').on('mouseup', 'a', function(event) {
            //$(event.target).removeClass('tappable-active');
        //});
	},
		
	route: function() {
	    var self = this;
	    var hash = window.location.hash;	    
	    
	    //alert(hash);
	    //alert(this.homePage);
	    if (!hash) {
//	    	alert(1);
	        if (this.homePage) {
	            this.slidePage(this.homePage);
	        } else {
	            this.homePage = new HomeView(this.store).render();
	            this.slidePage(this.homePage);
	        }
	        return;
	    }else{
	    	var home = hash.match(app.homeURL);
	    	if (home) {
	    		this.homePage = new HomeView(this.store).render();
	            this.slidePage(this.homePage);
	    	}
	    }
	    
	    //carrega página inicial da busca
	    var inicio = hash.match(app.inicioURL);
	    if (inicio) {
	    	//alert(1);
	        self.slidePage(new InicioView().render());
	    }
	    
	    //carrega página de login
	    var login = hash.match(app.loginURL);
	    if (login) {
	    	//alert(1);
	        self.slidePage(new LoginView().render());
	    }
	    
	    //carrega página de faxineiras inicial
	    var pessoas = hash.match(app.pessoasURL);
	    if (pessoas) {
	    	self.slidePage(new PessoasView(true).render());
	    }
	    
	    //carrega página de detalhes da faxineira
	    var pessoaDetalhe = hash.match(app.pessoaDetalheURL);
	    if (pessoaDetalhe) {
	    	this.store.buscaPorId(Number(pessoaDetalhe[1]), function(pessoa) {
	            self.slidePage(new PessoaDetalheView(pessoa).render());
	        });
	    }
	    
	    //carrega página de detalhes da limpeza
	    var limpezaDetalhe = hash.match(app.limpezaDetalheURL);
	    if (limpezaDetalhe) {
	    	self.slidePage(new LimpezaDetalheView().render());
	    }
	},
	
	initialize: function() {
		var self = this;
		
		this.homeURL = /^#homePage/;
		this.inicioURL = /^#inicio/;
		this.loginURL = /^#login/;
		this.pessoasURL = /^#pessoas/;
		this.pessoaDetalheURL = /^#pessoaDetalhe\/(\d{1,})/;
		this.limpezaDetalheURL = /^#limpezaDetalhe/;
		
		this.registerEvents();
		//this.store = new MemoryStore(function() {
		this.store = new MemoryStore(function() {
    		self.route();
		});
    		
	},
    
	slidePage: function(page) {
 
	    var currentPageDest,
	        self = this;
		 
	    // If there is no current page (app just started) -> No transition: Position new page in the view port
	    if (!this.currentPage) {
	        $(page.el).attr('class', 'page stage-center');
	        $('body').append(page.el);
	        this.currentPage = page;
	        return;
	    }
	 
	    // Cleaning up: remove old pages that were moved out of the viewport
	    $('.stage-right, .stage-left').not('.homePage').remove();
	    
	    var voltar = window.sessionStorage.getItem("voltar");
	    //alert(voltar);
	    
	    if (page === app.homePage) {
	        // Always apply a Back transition (slide from left) when we go back to the search page
	        $(page.el).attr('class', 'page stage-left');
	        currentPageDest = "stage-right";
	    } else if (voltar == "1") {
	    	// Always apply a Back transition (slide from left) when using back button
	    	$(page.el).attr('class', 'page stage-left');
	        currentPageDest = "stage-right";
	        window.sessionStorage.setItem("voltar","0");
	    }else{
	        // Forward transition (slide from right)
	        $(page.el).attr('class', 'page stage-right');
	        currentPageDest = "stage-left";
	    }
	 
	    $('body').append(page.el);
	 
	    // Wait until the new page has been added to the DOM...
	    setTimeout(function() {
	        // Slide out the current page: If new page slides from the right -> slide current page to the left, and vice versa
	        $(self.currentPage.el).attr('class', 'page transition ' + currentPageDest);
	        // Slide in the new page
	        $(page.el).attr('class', 'page stage-center transition');
	        self.currentPage = page;
	    });
	 
	},

};

app.cabecalhoTemplate = Handlebars.compile($("#cabecalho-tpl").html());
app.custoLimpeza = 12;
app.custoMaterial = 5;

app.initialize();

Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
	switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});