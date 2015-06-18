var HomeView = function(store) {
	
    this.initialize = function() {
        // Define a div wrapper for the view. The div wrapper is used to attach events.
        this.el = $('<div/>');
        //this.el.on('click', '.inicio-btn', this.inicioPesquisa);
    };
    
    this.render = function() {
	    this.el.html(app.cabecalhoTemplate());
	    this.el.append(HomeView.template());
	    return this;
	};
	
	this.inicioPesquisa = function(event) {
	    event.preventDefault();
	    console.log('inicioPesquisa');
	    this.el = $('<div/>');
	    $('.scroll').html(HomeView.templateInicio());
	    return false;
	};
	
	
 
    this.initialize();
};

HomeView.template = Handlebars.compile($("#home-tpl").html());
HomeView.templateInicio = Handlebars.compile($("#inicio-tpl").html());
