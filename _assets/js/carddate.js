$("document").ready(function() {
    var t = new Date();
    $("#CardExpiryMonth")[0].selectedIndex = parseInt(t.getMonth());
    $("#CardExpiryYear").val(t.getFullYear());
});