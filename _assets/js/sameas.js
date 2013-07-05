
$("document").ready(function() {
    $("#sameas").click(function() {
        if ($(this).attr("checked")) {
            $("#BillingAddress").val($("#ShippingAddress").val());
            $("#BillingCity").val($("#ShippingCity").val());
            $("#BillingState").val($("#ShippingState").val());
            $("#BillingZip").val($("#ShippingZip").val());
            $("#BillingCountry").val($("#ShippingCountry").val());
        }
    });	
});