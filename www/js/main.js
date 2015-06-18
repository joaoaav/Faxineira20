var app = {

    showAlert: function (message, title) {
		if (navigator.notification) {
        	navigator.notification.alert(message, null, title, 'OK');
    	} else {
        	alert(title ? (title + ": " + message) : message);
    	}
	},
    
    registerEvents: function() {
		$(window).on('hashchange', $.proxy(this.route, this));
		
		$('body').on('mousedown', 'a', function(event) {
            $(event.target).addClass('tappable-active');
        });
        
		$('body').on('mouseup', 'a', function(event) {
            $(event.target).removeClass('tappable-active');
        });
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
	    
	    //carrega página de filtro inicial
	    var filtro = hash.match(app.filtroURL);
	    if (filtro) {
	    	self.slidePage(new FiltroView().render());
	    }
	    var match = hash.match(app.detailsURL);
	    if (match) {
	    	alert(2);
	        this.store.findById(Number(match[1]), function(employee) {
	            self.slidePage(new EmployeeView(employee).render());
	        });
	    }
	},
	
	initialize: function() {
		var self = this;
		
		this.detailsURL = /^#employees\/(\d{1,})/;
		this.homeURL = /^#homePage/;
		this.inicioURL = /^#inicio/;
		this.filtroURL = /^#filtro/;
		
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
	 
	    if (page === app.homePage) {
	        // Always apply a Back transition (slide from left) when we go back to the search page
	        $(page.el).attr('class', 'page stage-left');
	        currentPageDest = "stage-right";
	    } else {
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

app.initialize();