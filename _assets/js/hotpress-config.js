$(function () {
    //check login info display member-nav if logged in, otherwise display public
	var loggedin = window.ISLOGGEDIN;
	// if (loggedin == 1) {
	// 	$(".member").css({
	// 		"display": "inline-block"
	// 	});
	// 	$(".guest").css({
	// 		"display": "none"
	// 	});
		
		
	}
	
	//remove the UL if catalogues are not found inside sub catalogues
	if($(".catalogueItemNotFound").length){$('.catalogueItemNotFound').parent().remove()};	

    //change shoping cart buttons -- depends on client
	var $cart = $(".cartSummaryItem");
	if($cart.text() == "Shopping cart is empty."){
		$cart.html('<a href="/OrderRetrievev2.aspx" class="nav-cart">Shopping Cart</a>');	
		$cart.addClass("defaultcart");
	}else{
		$cart.removeClass("defaultcart");
	}

    
	
	//--- All Other Nav Items ---//
	var subPathArray = window.location.pathname.split( '.com' ); // create an array based upon the pathname(yoursite.com/page/subpage would become pathArray[page/subpage])
	var wholePathArray = subPathArray[0];// get just the pathname - This will equal the paths of our links
	var linkNav = $("ul > li > a"); // target all links within an unordered list. this will mostly just be navigation
	// cycle through each link. If the href equals the our pathname add the class selected
	for (var i=0; i<linkNav.length; i++){
		var hrefLinks = $(linkNav[i]).attr("href");	
		if(hrefLinks == wholePathArray){
			$(linkNav[i]).parent().addClass("selected");
		}
	}			

    //end selected state


	//Add Class to Even TR Elements
	$("table.alt tr:odd").children().addClass("odd");

});
	// Get the number of the month 
	function getMonthNumber(monthName){
		var monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];	
		for(var i=0; i<monthList.length; i++){
			if(monthList[i] === monthName){
				return i;
			}
		}
		return -1;
	}
	// Create a javascript date
	function bcDateToJsDate(bcDate){
		var bcDateParts = bcDate.split('-');
		var day = bcDateParts[0];
		var month = getMonthNumber(bcDateParts[1]);
		var year = bcDateParts[2];
		var hour = 0;
		var minute = 0;
		var second = 0;
		var millisecond = 0;
		var realDate = new Date(year,month,day,hour,minute,second,millisecond); 
		return realDate;
	}
	// Output the date in this format Jan 1, 1990
	function toShortMonthDate(jsDate){
		var shortMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		return shortMonth[jsDate.getMonth()] + " " + jsDate.getDate() + ", " + jsDate.getFullYear();
	}
	// Output the date in this format January 1, 1990
	function toLongMonthDate(jsDate){
		var longMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		return longMonth[jsDate.getMonth()] + " " + jsDate.getDate() + ", " + jsDate.getFullYear();
	}
	// Output the date in this format 1/1/1980 or 1-1-1980 or 1.1.1980 or 1|1|1980 or...
	function toPureNumberDate(jsDate, separator){
		if(separator == undefined){
			var separator = "/";	
		}
		return jsDate.getMonth()+1 + separator + jsDate.getDate() + separator + jsDate.getFullYear();
	}
	// Put our new date function to work
	$(function() {	
		$('span.event-date').each(function() {	
			var bcDateText = $(this).text(); // get the text of the date
			var newJsDate = bcDateToJsDate(bcDateText); // uses the javascript date function to split and order our date
    		$(this).html(toPureNumberDate(newJsDate, "-")); // re-write the date in the format we select. To change the separator just add an - after newJsDate so it would be (newJsDate,"-")
			
		});
	});