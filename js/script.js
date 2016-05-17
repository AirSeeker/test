var recivedData, addedData;


///////////////////////////////////////////////////////////////////////////////
/////////////////////////POST && REVIEW////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
function postdata() {
	$.ajax({
	    url:"https://api.myjson.com/bins/3uoya",
	    type:"PUT",
	    data: JSON.stringify(addedData),
	    contentType:"application/json; charset=utf-8",
	    dataType:"json",
	    success: function(data, textStatus, jqXHR){
	    	alert("done!");
	    	reviewdata();
	    }
	});
};

function reviewdata() {
	var jqXHR = $.getJSON('https://api.myjson.com/bins/3uoya');
 	jQuery.support.cors = true;
	jqXHR.complete(function(response) {
		recivedData = response.responseJSON;
		addedData = recivedData;
		$('h1').html("Company organizer"+ "</br><i> status: "+ Object.keys(recivedData).length +" company's loaded</i>");
		var output = '<ul>';
		var list = '<option data-id="">none</option>';
		for (var key in recivedData) {
			list += '<option data-index="'+ key +'" data-id="'+recivedData[key].id+'">' + recivedData[key].name + '</option>';
			output += '<li data-id="'+recivedData[key].id+'" data-money="'+recivedData[key].money+'">' + recivedData[key].name + " | " + recivedData[key].money + "K$"+ '</li>';
		}
		output += '</ul>';
		$("#info").html(output);
		$('.parent, .child, .company').html(list);
	});
};

///////////////////////////////////////////////////////////////////////////////
/////////////////////////EDIT//////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

var dad, companyIndex;
$('.picker').click(function () {
	dad = $(this).parent().parent().parent().parent().attr('id');
	companyIndex = $('#'+dad+' .company option:selected').data('index');
	var companyObject = recivedData[companyIndex];
	var name = companyObject.name;
	$('#'+dad+' #company_name').val(name);
	var money = companyObject.money;
	$('#'+dad+' #company_money').val(money);
	var parent = companyObject.parent;
	$('#'+dad+' .parent option[data-id="'+parent+'"]').prop('selected', true);
	var child = companyObject.child; 
	$('#'+dad+' .child option[data-id="'+child+'"]').prop('selected', true);
});

$('.submit_edit').click(function () {
	//slice before submit
	console.log(addedData[companyIndex]);
	addedData.splice(companyIndex, 1);
	console.log(addedData);
	var freeId = [];
	for(var i=0; i<addedData.length; i++){
		freeId.push(addedData[i].id);
	}
	freeId.sort(function(a, b){return a-b;});
	freeId=freeId[freeId.length-1]+1;
	var name = $('#'+dad+' #company_name').val();
	var money = $('#'+dad+' #company_money').val();
	var parent = $('#'+dad+' .parent option:selected').data("id");
	var child = $('#'+dad+' .child option:selected').data("id");
	var template = {
		"id": freeId,
		"name": name,
		"money": money,
		"parent": parent,
		"child" : child
	};
	addedData.push(template);
	postdata();
});
///////////////////////////////////////////////////////////////////////////////
/////////////////////////DELETE////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
$('#delete').click(function () {
	var company = $('.company option:selected').data("id");
	console.log(company);
});

///////////////////////////////////////////////////////////////////////////////
/////////////////////////ADD///////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
$('.submit_add').click(function () {
	var freeId = [];
	for(var i=0; i<addedData.length; i++){
		freeId.push(addedData[i].id);
	}
	freeId.sort(function(a, b){return a-b;});
	freeId=freeId[freeId.length-1]+1;
	console.log(freeId);
	var name = $('#company_name').val();
	var money = $('#company_money').val();
	var parent = $('.parent option:selected').data("id");
	var child = $('.child option:selected').data("id");
	var template = {
		"id": freeId,
		"name": name,
		"money": money,
		"parent": parent,
		"child" : child
	};
	addedData.push(template);
	postdata();
});


































reviewdata();