var InicioView  = function() {
	
	var geocoder;
	var map;

	  
	this.initialize = function() {
        this.el = $('body');
        
        this.el.on('click', '.buscar-cep', this.buscaCep);
        this.el.on('click', '.buscar-localizacao', this.buscaLocalizacao);

        this.el.on('click', '.buscar-empregada-cep', this.buscaEmpregada);
        this.el.on('click', '.buscar-empregada-posicao', this.buscaEmpregada);
        this.el.on('click', '.buscar-empregada-usuario', this.buscaUsuario);

        this.el.on('click', '.btn-logout', app.logout);
        
    };
    
    this.render = function() {
    	this.el.html(app.cabecalhoTemplate());
    	
    	var usuario = app.store.getUsuario();
    	//console.log(usuario);
    	//$('.scroll').html();
    	this.el.find('.scroll').html(InicioView.conteudoTemplate(usuario));
	    //this.el.append(InicioView.conteudoTemplate(usuario));
	    
	    this.el.find('.buscar-empregada-cep').hide();
	    this.el.find('.buscar-empregada-posicao').hide();
	    return this;
	};
		
	this.buscaCep = function(event) {
	    event.preventDefault();
	    console.log('buscaCep');
	    
	    var cep = $('#cep-busca').val().trim();
	    
	    if (postcode_validate(cep)){
	    	
	    	var address = "http://maps.googleapis.com/maps/api/geocode/json?address="+cep+"&sensor=true";

	    	$.getJSON(address, function(response){
	    		if (response.status == "ZERO_RESULTS"){
	    			app.showAlert('CEP não encontrado',"Início");
	    			return false;
	    		}
	    		
	    		var endereco = new Object();
	    		
	    		//console.log(response.results);
	    		
	    	    $.each( response.results, function( i, item ) {
	    	    	
	    	    	$.each( item.address_components, function( ii, iitem ) {
	    	    		switch(iitem.types[0]) {
	    	    	    	case "postal_code":
	    	    	    		endereco.cep = iitem.long_name;
	    	    	    		break;
	    	    	    	case "neighborhood":
	    	    	    		endereco.bairro = iitem.long_name;
	    	    	    		break;
	    	    	    	case "locality":
	    	    	    		endereco.cidade = iitem.long_name;
	    	    	    		break;
	    	    	    	case "administrative_area_level_1":
	    	    	    		endereco.estado = iitem.long_name;
	    	    	    		break;
	    	    	    	case "country":
	    	    	    		endereco.pais = iitem.long_name;
	    	    	    		break;
	    	    		}
	    	    	});
	    	    	
	    	    	endereco.rua = '';
	    	    	endereco.completo = item.formatted_address;
	    	    	endereco.latitude = item.geometry.location.lat;
	    	    	endereco.longitude = item.geometry.location.lng;
	    	    });
	    	    
	    	    //window.sessionStorage.setItem("enderecoBusca", JSON.stringify(endereco));
	    	    app.store.setLimpezaDetalhe('endereco',endereco);
	    	    
	    	    //console.log(endereco);
	    	    //console.log(window.sessionStorage.getItem("enderecoBusca"));
	    	    //console.log(JSON.parse(window.sessionStorage.getItem("enderecoBusca")));
	    	    
	    	    mostrarEndereco(endereco);
	    	    return true;
	    	});
	    }else{
	    	return false;
	    }
	};
		
	this.buscaLocalizacao = function(event) {
	    event.preventDefault();
	    console.log('buscaLocalizacao');
	    
	    var options = { timeout: 10000, enableHighAccuracy: true, maximumAge: 90000 };
	    navigator.geolocation.getCurrentPosition(locationSuccess, 
	        function() {
	    		app.showAlert('Erro recebendo localização',"Início");
	        }, options
	    );
	    
	    return false;
	};
	
	this.buscaUsuario = function(event) {
	    event.preventDefault();
	    console.log('buscaUsuario');
	    
	    var usuario = app.store.getUsuario(); 
	    
	    var endereco = new Object();
	    endereco.cep = usuario.endereco.cep;
	    endereco.rua = usuario.endereco.rua;
		endereco.bairro = usuario.endereco.bairro;
		endereco.cidade = usuario.endereco.cidade;
		endereco.estado = usuario.endereco.estado;
		endereco.pais = usuario.endereco.pais;
		endereco.completo = '';
		endereco.latitude = '';
		endereco.longitude = '';

		app.store.setLimpezaDetalhe('endereco',endereco);
	    
		//InicioView.prototype = new InicioView();
		//InicioView.prototype.buscaEmpregada(event);
		this.buscaEmpregada(event);
		
	}.bind(this);;
	
	this.buscaEmpregada = function(event) {
		event.preventDefault();
	    console.log('buscaEmpregada');
	    
	    var pessoas = app.store.buscaEmpregadas(false);
	    //alert(pessoas.length);
	    
	    window.location="index.html#pessoas";
	    return true;
	};
	
	function postcode_validate(postcode)
	{
		//01001-000
		var regRange= /^(([0][0-1][0]{3}[-][0-9]{3})|([0]{4}[1][-][0-9]{3})|([9]{4}[1-9][-][0-9]{3})|([9]{4}[0][-][9][7][1-9])|([9]{4}[0][-][9][8-9][0-9]))$/;
		var regPostcode = /^([0-9]){5}([-])([0-9]){3}$/;

		if(regRange.test(postcode) == false){
			if(regPostcode.test(postcode) == false){	
				app.showAlert('CEP inválido','Início');
				return false;
			}else{	
				return true;	
			}	
		}else{	
			app.showAlert('CEP inválido','Início');
			return false;
		}

	}
	
	function mostrarEndereco (endereco) {
		geocoder = new google.maps.Geocoder();
		
		var lat = endereco.latitude;
	    var lng = endereco.longitude;
	    var latlng = new google.maps.LatLng(lat, lng);
	    //var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	    var mapOptions = {
	      zoom: 3,
	      center: latlng
	    }
	    
	    $('#mapaCep').show();
	    
	    map = new google.maps.Map(document.getElementById("mapaCep"), mapOptions);
	    
	    geocoder.geocode({'latLng': latlng}, function(results, status) {
	      if (status == google.maps.GeocoderStatus.OK) {
	        if (results[1]) {
	          map.setZoom(3);
	          marker = new google.maps.Marker({
	              position: latlng,
	              map: map
	          });

	          //alert(results[1].formatted_address);
	          $('#localizacaoCep').html(results[1].formatted_address);
	          $('#hidEnderecoCep').val(results[1].formatted_address);
	          $('#hidBairroCep').val(endereco.bairro);
	          $('#hidCidadeCep').val(endereco.cidade);
	          $('#hidEstadoCep').val(endereco.estado);
	          $('#hidCepCep').val(endereco.cep);
	          
	          $('.buscar-empregada-cep').show();
	          //infowindow.setContent(results[1].formatted_address);
	          //infowindow.open(map, marker);
	        } else {
	          app.showAlert('Nenhum endereço encontrado',"In&iacute;cio");
	          $('#buscar-empregada-cep').hide();
	          $('.mapaCep').hide();
	        }
	      } else {
	    	  app.showAlert('Geocoder falhou pelo motivo: ' + status,"In&iacute;cio");
	    	  $('#mapaCep').hide();
	    	  $('.buscar-empregada-cep').hide();
	      }
	    });
	}
	
	function locationSuccess (position) {
		//alert(1);
		//return true;
        /*try{

            // Retrive the cache
            var cache = localStorage.weatherCache && JSON.parse(localStorage.weatherCache);

            var d = new Date();

            // If the cache is newer than 30 minutes, use the cache
            if(cache && cache.timestamp && cache.timestamp > d.getTime() - 1*60*1000){
            	
            	var lat = position.coords.latitude;
            	var lon = position.coords.longitude;
	            
	            //$('.location', this.el).html(position.coords.latitude + ',' + position.coords.longitude);
	            var latlon=lat+","+lon; 
	            var img_url="http://maps.googleapis.com/maps/api/staticmap?center="+latlon+"&zoom=14&size=400x300&sensor=false";
	            document.getElementById("mapa").innerHTML="<img src='"+img_url+"' />";

                // Get the offset from UTC (turn the offset minutes into ms)
                var offset = d.getTimezoneOffset()*60*1000;
                var city = cache.data.city.name;
                var country = cache.data.city.country;

                $.each(cache.data.list, function(){
                   // alert(this);
                	// "this" holds a forecast object

                    // Get the local time of this forecast (the api returns it in utc)
                    //var localTime = new Date(this.dt*1000 - offset);

                    //addWeather(
                    //    this.weather[0].icon,
                    //    moment(localTime).calendar(),   // We are using the moment.js library to format the date
                    //    this.weather[0].main + ' <b>' + convertTemperature(this.main.temp_min) + '°' + DEG +
                    //                            ' / ' + convertTemperature(this.main.temp_max) + '°' + DEG+'</b>'
                    //);

                });

                // Add the location to the page
                $('#localizacao').html(city+', <b>'+country+'</b>');

                //weatherDiv.addClass('loaded');

                // Set the slider to the first slide
                //showSlide(0);

            }

            else{

                // If the cache is old or nonexistent, issue a new AJAX request

                var weatherAPI = 'http://api.openweathermap.org/data/2.5/forecast?lat='+position.coords.latitude+
                                    '&lon='+position.coords.longitude+'&callback=?'

                $.getJSON(weatherAPI, function(response){

                    // Store the cache
                    localStorage.weatherCache = JSON.stringify({
                        timestamp:(new Date()).getTime(),   // getTime() returns milliseconds
                        data: response
                    });
                    
                    alert(localStorage.weatherCache);

                    // Call the function again
                    locationSuccess(position);
                });
            }

        }
        catch(e){
            app.showAlert("We can't find information about your city!");
            window.console && console.error(e);
        }*/
		
		geocoder = new google.maps.Geocoder();
		
		var lat = position.coords.latitude;
	    var lng = position.coords.longitude;
	    var latlng = new google.maps.LatLng(lat, lng);
	    //var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	    var mapOptions = {
	      zoom: 3,
	      center: latlng
	    }
	    
	    $('#mapa').show();
	    
	    map = new google.maps.Map(document.getElementById("mapa"), mapOptions);
	    
	    geocoder.geocode({'latLng': latlng}, function(results, status) {
	      if (status == google.maps.GeocoderStatus.OK) {
	        if (results[1]) {
	          map.setZoom(3);
	          marker = new google.maps.Marker({
	              position: latlng,
	              map: map
	          });

	          //alert(results[1].formatted_address);
	          $('#localizacao').html(results[1].formatted_address);
	          
	          var endereco = new Object();
	          var res = results[1].formatted_address.split(',');
	          endereco.endereco = res[0].trim();
	          endereco.rua = res[0].trim();
	          endereco.bairro = res[1].trim();
	          endereco.cidade = res[2].trim();
	          endereco.estado = res[2].trim();
	          endereco.pais = res[3].trim();
	          endereco.cep = '';
	          
	          //window.sessionStorage.setItem("enderecoBusca", JSON.stringify(endereco));
	          app.store.setLimpezaDetalhe('endereco',endereco);
	          
	          $('#hidEnderecoPosicao').val(endereco.endereco);
	          $('#hidBairroPosicao').val(endereco.bairro);
	          $('#hidCidadePosicao').val(endereco.cidade);
	          $('#hidEstadoPosicao').val(endereco.estado);
	          $('#hidCepPosicao').val(endereco.cep);
	          
	          $('.buscar-empregada-posicao').show();
	        } else {
	          app.showAlert('Nenhum endereço encontrado',"In&iacute;cio");
	          $('#mapa').hide();
	    	  $('.buscar-empregada-posicao').hide();
	        }
	      } else {
	    	  app.showAlert('Geocoder falhou pelo motivo: ' + status,"In&iacute;cio");
	    	  $('#mapa').hide();
	    	  $('.buscar-empregada-posicao').hide();
	      }
	    });


    }
 
    this.initialize();
};

InicioView.conteudoTemplate = Handlebars.compile($("#inicio-tpl").html());
