//init page
$(function(){
	initClearInputs();
	//hero slideshow
	$("#slideshow").hero({
		textSpeed:1000,
		imageSpeed: 2000,
		pause:6000,
		paging:true,
		titles:false,
		prevAndNext:false,
		divider:true
	});
});




//init clear inputs
function initClearInputs(){
	clearFormFields({
		clearInputs: true,
		clearTextareas: true,
		passwordFieldText: false,
		addClassFocus: "focus",
		filterClass: "default"
	});
}


//clear inputs
function clearFormFields(o){
	if (o.clearInputs == null) o.clearInputs = true;
	if (o.clearTextareas == null) o.clearTextareas = true;
	if (o.passwordFieldText == null) o.passwordFieldText = false;
	if (o.addClassFocus == null) o.addClassFocus = false;
	if (!o.filterClass) o.filterClass = "default";
	if(o.clearInputs) {
		var inputs = document.getElementsByTagName("input");
		for (var i = 0; i < inputs.length; i++ ) {
			if((inputs[i].type == "text" || inputs[i].type == "password") && inputs[i].className.indexOf(o.filterClass) == -1) {
				inputs[i].valueHtml = inputs[i].value;
				inputs[i].onfocus = function ()	{
					if(this.valueHtml == this.value) this.value = "";
					if(this.fake) {
						inputsSwap(this, this.previousSibling);
						this.previousSibling.focus();
					}
					if(o.addClassFocus && !this.fake) {
						this.className += " " + o.addClassFocus;
						this.parentNode.className += " parent-" + o.addClassFocus;
					}
				}
				inputs[i].onblur = function () {
					if(this.value == "") {
						this.value = this.valueHtml;
						if(o.passwordFieldText && this.type == "password") inputsSwap(this, this.nextSibling);
					}
					if(o.addClassFocus) {
						this.className = this.className.replace(o.addClassFocus, "");
						this.parentNode.className = this.parentNode.className.replace("parent-"+o.addClassFocus, "");
					}
				}
				if(o.passwordFieldText && inputs[i].type == "password") {
					var fakeInput = document.createElement("input");
					fakeInput.type = "text";
					fakeInput.value = inputs[i].value;
					fakeInput.className = inputs[i].className;
					fakeInput.fake = true;
					inputs[i].parentNode.insertBefore(fakeInput, inputs[i].nextSibling);
					inputsSwap(inputs[i], null);
				}
			}
		}
	}
	if(o.clearTextareas) {
		var textareas = document.getElementsByTagName("textarea");
		for(var i=0; i<textareas.length; i++) {
			if(textareas[i].className.indexOf(o.filterClass) == -1) {
				textareas[i].valueHtml = textareas[i].value;
				textareas[i].onfocus = function() {
					if(this.value == this.valueHtml) this.value = "";
					if(o.addClassFocus) {
						this.className += " " + o.addClassFocus;
						this.parentNode.className += " parent-" + o.addClassFocus;
					}
				}
				textareas[i].onblur = function() {
					if(this.value == "") this.value = this.valueHtml;
					if(o.addClassFocus) {
						this.className = this.className.replace(o.addClassFocus, "");
						this.parentNode.className = this.parentNode.className.replace("parent-"+o.addClassFocus, "");
					}
				}
			}
		}
	}
	function inputsSwap(el, el2) {
		if(el) el.style.display = "none";
		if(el2) el2.style.display = "inline";
	}
}


(function($){  
$.fn.extend({
	hero: function(options) {  
		//Set the default values, use comma to separate the settings
		var defaults = {  
			textSpeed:1000,
			imageSpeed:1000,
			pause:3000,
			autoPlay:true,
			divider:true,
			prevAndNext:true,
			paging:false,
			titles:false
		}  
		
		var options =  $.extend(defaults, options);
		
		//Iterate over the current set of matched elements  
		return this.each(function() {  
			var obj = $(this); //Assign current element to variable
			var currentSlide = 0; //keep track of what slide we are on
			var divs = obj.children("div",obj)//target all the divs
			var timer = null//used as our timing interval
			
			//add divs to hold images, descriptions, and controls
			obj.prepend("<div class='hero-controls'><ul></ul></div>");
			obj.prepend("<div class='hero-descriptions'><ul></ul></div>");
			if(options.divider === true){
				obj.prepend("<div class='hero-divider'></div>");	
			}
			obj.prepend("<div class='hero-images'><ul></ul></div>");
			
			//create variable for each object
			var descriptionsDiv = $(".hero-descriptions", obj);
			var imagesDiv = $(".hero-images", obj);
			var controlsDiv = $(".hero-controls", obj);
			
			//loop through the divs and move them to their appropriate container div
			for (var i=0; i<divs.length; i++){
				if($(divs[i]).hasClass("hero-image") === true){
					$(divs[i]).remove().appendTo(imagesDiv.children("ul")).wrap("<li></li>");
				}else if($(divs[i]).hasClass("hero-description") === true){
					$(divs[i]).remove().appendTo(descriptionsDiv.children("ul")).wrap("<li></li>");
				}else if($(divs[i]).hasClass("hero-title") === true){
					if(options.titles === false){
						$(divs[i]).remove();
					}else if(options.pagging === true){
						$(divs[i]).remove();
					}else if(options.titles === true){
						$(divs[i]).remove().appendTo(controlsDiv.children("ul")).wrap("<li class='hero-paging'></li>");
					}
				}
			}
			
			//Variable for images and description items
			var heroImages = $(".hero-images li", obj); 
			var heroDescriptions = $(".hero-descriptions li", obj);
			
			//Add paging to controls
			if(options.paging === true){
				for (var j=0; j<heroImages.length; j++){
					number = j + 1;
					controlsDiv.children("ul").append("<li class='hero-paging'><a href=#>"+ number +"</a></li>");
				}
			}
			
			//add paging and title on click functionality
			if(options.paging === true || options.titles === true){
				var heroPaging = $(".hero-controls .hero-paging a", obj);
				for (var k=0; k<heroPaging.length; k++){
					heroPaging[k].number = k;
					$(heroPaging[k]).click(function(){
						currentSlide = this.number;
						options.autoPlay = false;
						slideshow();
						return false;
					});
				}	
			}
			
			//hide the previous image and description and show the new ones
			function slideshow(){
				clearInterval(timer);
				$(".hero-images .current", obj).fadeOut(options.imageSpeed).removeClass("current");
				$(".hero-descriptions .current", obj).fadeOut(options.textSpeed).removeClass("current");
				$(heroDescriptions[currentSlide]).fadeIn(options.textSpeed).addClass("current");
				$(heroImages[currentSlide]).fadeIn(options.imageSpeed).addClass("current");
				if(options.autoPlay === true){
					timer = setTimeout(nextSlide, options.pause);
				}
				if(options.paging === true){
					$(".hero-controls .current", obj).removeClass("current");
					$(heroPaging[currentSlide]).parent().addClass("current");
				}else if(options.titles === true){
					$(".hero-controls .current", obj).removeClass("current");
					$(heroPaging[currentSlide]).parent().parent().addClass("current");
				}
			}
			
			//add one to the slide count then play the slideshow
			function nextSlide(){
				//console.log("nextSlide");
				currentSlide++;
				//check to see if you are at the last slide and reset to the first
				if(currentSlide >= heroImages.length){
					currentSlide = 0;
				}
				slideshow();
			}
			
			//remove one from the slide count then play the slideshow
			function prevSlide(){
				//console.log("prevSlide");
				currentSlide--;
				//check to see if you are the first slide and reset to the last
				if(currentSlide < 0){
					currentSlide = heroImages.length-1;	
				}
				slideshow();
			}
			
			slideshow();
			
			//Add previous and next buttons and add on click functionality
			if(options.prevAndNext === true){
				$(".hero-controls ul", obj).prepend("<li class='hero-prev'><a href='#'>Previous</a></li>");
				$(".hero-controls ul", obj).append("<li class='hero-next'><a href='#'>Next</a></li>");
				
				var prevBtn = $(".hero-prev a", obj);
				var nextBtn = $(".hero-next a", obj);
				
				$(nextBtn).click(function(){
					options.autoPlay = false;
					nextSlide();
					return false;
				});
				
				$(prevBtn).click(function(){
					options.autoPlay = false;
					prevSlide();
					return false;
				});
			}
			
		});  
	}  
});       
})(jQuery); 
$(function(){
	$(".hero-link").each(function(){
		var islinkthere = $(this).attr('href');
		if(islinkthere.length == 0){
			$(this).remove();	
		}
	});	
});
