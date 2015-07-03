var LimpezaDetalheView  = function() {
	
	var geocoder;
	var map;

	  
	this.initialize = function() {
        this.el = $('body');
        
        this.el.on('change', '#quantidade-horas', this.mudaQuantidadeHoras);
        this.el.on('change', '.materialLimpeza', this.mudaMaterialLimpeza);
        this.el.on('change', '.frequencia', this.mudaFrequencia);
        this.el.on('change', '.data-inicio', this.mudaDataInicio);
        this.el.on('change', '.hora-inicio', this.mudaDataInicio);

        this.el.on('change', '#extra0', this.mudaRoupa);
        this.el.on('change', '#extra1', this.mudaAnimais);
        this.el.on('change', '#extra2', this.mudaGeladeira);

        this.el.on('click', '.btn-logout', app.logout);
    };
    
    this.render = function() {
    	this.el.html(app.cabecalhoTemplate());

    	var usuario = app.store.getUsuario();
    	var reserva = app.store.getLimpezaDetalhe();
    	
    	//sempre constroi o custo com valor default
    	//if (reserva.custo == null){
    		reserva.custo = new Object();
    		reserva.custo.limpeza = app.custoLimpeza * 2;
    		reserva.custo.material = 0;
    		reserva.custo.total = app.custoLimpeza * 2;
    	//}
    		
    	reserva.detalhes = new Object();
    	reserva.detalhes.frequencia = 0 //0=1 vez, 1=semana, 2=quinzenal, 3=outro
    	reserva.detalhes.quantidadeHoras = 2;
    	reserva.detalhes.dataInicio = null;
    	reserva.detalhes.materialLimpeza = 0;
    	reserva.detalhes.extra = new Array();
    	app.store.setLimpezaDetalhe('detalhes',reserva.detalhes);
    	
	    this.el.find('.scroll').append(LimpezaDetalheView.conteudoTemplate({usuario:usuario}));
	    this.el.find('.limpeza-detalhe').append(LimpezaDetalheView.resumoTemplate(reserva));
	    
	    return this;
	};
	
	this.mudaFrequencia = function(event) {
		event.preventDefault();
		console.log('mudaFrequencia');
		
		var frequencia = '';
		switch($(this).val()) {
		    case '0':
		    	frequencia = "Uma vez";
		        break;
		    case '1':
		    	frequencia = "Semanal";
		        break;
		    case '2':
		    	frequencia = "Quinzenal";
		        break;
		    case '3':
		    	frequencia = "Outro";
		        break;
		    default:
		        frequencia = '';
		}

		$('.resumo-frequencia').text(frequencia);
	}
	
	this.mudaDataInicio = function(event) {
		event.preventDefault();
		console.log('mudaDataInicio');
		
		var data = $('.data-inicio').val();
		var hora = $('.hora-inicio').val();
		if (data != '' && hora != ''){
			$('.resumo-data').text(data + ' ' + hora);
		}
		return true;
	}
	
	this.mudaRoupa = function(event) {
		event.preventDefault();
		console.log('mudaRoupa');
		
		if ($(this).attr('checked')){
	    	$('.resumo-extra').append('<span class="resumo-extra-passsar">Passar roupa, </spam>');
	    }else{
	    	$('.resumo-extra-passsar').remove();
	    }
		
		mudaExtra(this, 3);
	}
	
	this.mudaAnimais = function(event) {
		event.preventDefault();
		console.log('mudaAnimais');
		
		if ($(this).attr('checked')){
	    	$('.resumo-extra').append('<span class="resumo-extra-animais">Tenho animais, </spam>');
	    }else{
	    	$('.resumo-extra-animais').remove();
	    }
		
		mudaExtra(this, 1);
	}
	
	this.mudaGeladeira = function(event) {
		event.preventDefault();
		console.log('mudaGeladeira');
		
		if ($(this).attr('checked')){
	    	$('.resumo-extra').append('<span class="resumo-extra-geladeira">Limpar geladeira, </spam>');
	    }else{
	    	$('.resumo-extra-geladeira').remove();
	    }
		
		mudaExtra(this, 2);
	}
	
	function mudaExtra(el, quantidade) {
	    //event.preventDefault();
	    console.log('mudaExtra');
	    
	    
	    var reserva = app.store.getLimpezaDetalhe();
	    var horas = $('#quantidade-horas').val();
	    if ($(el).attr('checked')){
	    	horas = Math.floor(horas) + Math.floor(quantidade);
	    	reserva.detalhes.extra.push($(el).val())
	    }else{
	    	horas = Math.floor(horas) - Math.floor(quantidade);
	    	reserva.detalhes.extra.splice($(el).val(), 1);
	    }
	    
	    //alert(horas);
	    
	    $('#quantidade-horas').val(horas);
	    
	    var custoLimpeza = horas * app.custoLimpeza;
	    
	    reserva.custo.limpeza = custoLimpeza;
	    reserva.custo.total = reserva.custo.limpeza + reserva.custo.material;
	    app.store.setLimpezaDetalhe('custo',reserva.custo);
	    app.store.setLimpezaDetalhe('detalhes',reserva.detalhes);
	    
	    $('#custo-limpeza').html('R$ '+reserva.custo.limpeza);
	    $('#custo-total').html('R$ '+reserva.custo.total);
	    return true;
	};
		
	this.mudaQuantidadeHoras = function(event) {
	    event.preventDefault();
	    console.log('mudaQuantidadeHoras');
	    
	    var reserva = app.store.getLimpezaDetalhe();
	    
	    var valor = $(this).val();
	    var custoLimpeza = valor * app.custoLimpeza;
	    
	    reserva.custo.limpeza = custoLimpeza;
	    reserva.custo.total = reserva.custo.limpeza + reserva.custo.material;
	    app.store.setLimpezaDetalhe('custo',reserva.custo);
	    
	    reserva.detalhes.quantidadeHoras = valor;
	    app.store.setLimpezaDetalhe('detalhes',reserva.detalhes);
	    
	    $('#custo-limpeza').html('R$ '+reserva.custo.limpeza);
	    $('#custo-total').html('R$ '+reserva.custo.total);
	    
	    $('.resumo-quantidade-horas').text(valor+' horas');
	    return true;
	};
		
	this.mudaMaterialLimpeza = function(event) {
	    event.preventDefault();
	    console.log('mudaMaterialLimpeza');
	    
	    var reserva = app.store.getLimpezaDetalhe();
	    
	    var material = $(this).val();
	    
	    if (material == 0){
	    	reserva.custo.material = app.custoMaterial;
	    	$('.booking_details_materials_item').show();
	    	reserva.detalhes.materialLimpeza = 1;
	    	$('.resumo-material-limpeza').text('Sim');
	    }else{
	    	reserva.custo.material = 0;
	    	$('.booking_details_materials_item').hide();
	    	reserva.detalhes.materialLimpeza = 0;
	    	$('.resumo-material-limpeza').text('Não');
	    }
	    reserva.custo.total = reserva.custo.limpeza + reserva.custo.material;
	    app.store.setLimpezaDetalhe('custo',reserva.custo);
	    
	    app.store.setLimpezaDetalhe('detalhes',reserva.detalhes);
	    
	    $('#custo-material').html('R$ '+reserva.custo.material);
	    $('#custo-total').html('R$ '+reserva.custo.total);
	    
	    
	    return true;
	};
 
    this.initialize();
};

LimpezaDetalheView.conteudoTemplate = Handlebars.compile($("#limpeza-detalhe-tpl").html());
LimpezaDetalheView.resumoTemplate = Handlebars.compile($("#resummo-tpl").html());
