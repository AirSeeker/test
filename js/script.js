


var recivedData, addedData;
var jqXHR = $.getJSON('https://api.myjson.com/bins/3uoya');
 jQuery.support.cors = true;
jqXHR.complete(function(response) {
	recivedData = response.responseJSON;
	var header = $('h1').text();
	$('h1').html(header+ "</br><i> status: "+ Object.keys(recivedData).length +" company's loaded</i>");
	var output = '<ul>';
	for (var key in recivedData) {
		output += '<li>' + recivedData[key].name + " | " + recivedData[key].money + "K$"+ '</li>';
		}
		output += '</ul>';
	$("#info").html(output);
});


$.ajax({
    url:"https://api.myjson.com/bins/3uoya",
    type:"PUT",
    data:'{"key_updated":"value_updated"}',
    contentType:"application/json; charset=utf-8",
    dataType:"json",
    success: function(data, textStatus, jqXHR){
    	alert("done!");
    }
});  




$('#view').click(function () {
	$ajaxUtils.sendGetRequest('/data/data.json', function (res) {
		var message = res.name + " " + res.money + " " + res.parent + " " + res.child + " " + Object.keys(res).length;
		var output = '<ul>';
		for (var key in res) {
			output += '<li>' + res[key].name + '</li>';
		}
		output += '</ul>';
		$("#info").html(output);
	});
});

$('#add').click(function () {
	console.log(recivedData);
});

$('#edit').click(function () {
	$ajaxUtils.sendGetRequest('/data/data.json', function (res) {
		var message = res.name + " " + res.money + " " + res.parent + " " + res.child + " " + Object.keys(res).length;
		$("#info").text(message);
	});
});

$('#delete').click(function () {
	$ajaxUtils.sendGetRequest('/data/data.json', function (res) {
		var message = res.name + " " + res.money + " " + res.parent + " " + res.child + " " + Object.keys(res).length;
		$("#info").text(message);
	});
});