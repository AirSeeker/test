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
		    $(function(){
					new PNotify({
					    title: 'Success',
					    text: 'Changes are applied!',
					    type: 'success'
					});
				});
	    	reviewdata();
	    	$('input').val('');
	    	$('option[data-id="0"]').prop('selected', true);
	    },
	    error: function(data, textStatus, jqXHR){
		    $(function(){
					new PNotify({
				    title: 'Oh No!',
				    text: 'Something terrible happened.',
				    type: 'error'
					});
				});
	    	reviewdata();
	    }
	});
};

function reviewdata() {
	var jqXHR = $.getJSON('https://api.myjson.com/bins/3uoya');
 	jQuery.support.cors = true;
	jqXHR.complete(function(response) {
		recivedData = response.responseJSON;
		addedData = sortByKey(recivedData,'parent');
		$('h1').html("<b>Company organizer</b></br><i> status: "+ Object.keys(addedData).length +" company's loaded</i>");
		var list = '<option data-id="0">none</option>';
		for (var key in addedData) {
			list += '<option data-index="'+ key +'" data-id="'+addedData[key].id+'">' + addedData[key].name + '</option>';
		}
		$('.parent, .company').html(list);
		treeBuilder();
	});
};

///////////////////////////////////////////////////////////////////////////////
/////////////////////////EDIT//////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

var dad, companyIndex;
$('.picker').click(function () {
	$('#left_side > div:nth-child(4) > select').html($('#'+dad+' .company').html());
	dad = $(this).parent().parent().parent().parent().attr('id');
	companyIndex = $('#'+dad+' .company option:selected').data('index');
	var companyObject = addedData[companyIndex];
	var name = companyObject.name;
	$('#'+dad+' #company_name').val(name);
	var money = companyObject.money;
	$('#'+dad+' #company_money').val(money);
	var parent = companyObject.parent;
	$('#'+dad+' .parent option[data-id="'+parent+'"]').prop('selected', true);
	$('#'+dad+' .parent option[data-id="'+companyObject.id+'"]').remove();
});

$('.submit_edit').click(function () {
	if($('#page2 #company_name').val() === "" || $('#page2 #company_money').val() === ""){
		$(function(){
			new PNotify({
				title: 'Oh No!',
				text: 'Please fill up input field\'s.',
				type: 'error'
			});
		});
	}else{
		var name = $('#'+dad+' #company_name').val();
		var money = $('#'+dad+' #company_money').val();
		var parent = $('#'+dad+' .parent option:selected').data("id");
		addedData[companyIndex].name = name;
		addedData[companyIndex].money = Number(money);
		addedData[companyIndex].parent = parent;
		postdata();
	}
});
///////////////////////////////////////////////////////////////////////////////
/////////////////////////DELETE////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
$('.submit_delete').click(function () {
	if($('#page3 .company option:selected').data("id") === 0){
		$(function(){
			new PNotify({
				title: 'Oh No!',
				text: 'Please chose company for delete.',
				type: 'error'
			});
		});
	}else{
		var companyIndex = $('#page3 .company option:selected').data('index');
		addedData.splice(companyIndex, 1);
		postdata();
	}
});

///////////////////////////////////////////////////////////////////////////////
/////////////////////////ADD///////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
$('.submit_add').click(function () {
	if($('#page1 #company_name').val() === "" || $('#page1 #company_money').val() === ""){
		$(function(){
			new PNotify({
				title: 'Oh No!',
				text: 'Please fill up input field\'s.',
				type: 'error'
			});
		});
	}else{

	for (var key in addedData) {
		if(addedData[key].name === $('#company_name').val()){
			return $(function(){
				new PNotify({
					title: 'Oh No!',
					text: 'That name already exist! Change name please.',
					type: 'error'
				});
			});
		}
	}
		var freeId = [];
		for(var i=0; i<addedData.length; i++){
			freeId.push(addedData[i].id);
		}
		freeId.sort(function(a, b){return a-b;});
		freeId=freeId[freeId.length-1]+1;
		var name = $('#company_name').val();
		var money = $('#company_money').val();
		var parent = $('.parent option:selected').data("id");
		var template = {
			"id": freeId,
			"name": name,
			"money": Number(money),
			"parent": parent
		};
		addedData.push(template);
		postdata();
	}
});

///////////////////////////////////////////////////////////////////////////////
/////////////////////////TREE BUILDER//////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var arr = [];
function treeBuilder() {
	for(var index in addedData){
		parentCheck(addedData[index],index);
		hasChild(addedData[index].id);
	}
console.log(arr);
arr.length = 0;
console.log(arr);
};

function parentCheck(ob,ind){
	var getHtml = 	$("#tree").html();
	var getHtmlById = $('#tree li[data-id="'+ob.id+'"] ul').html();
	if(ob.parent === 0 && $('li[data-id="'+ob.id+'"]').length <=0){
		arr.push(ob.id);
		var template = '<ul><li data-index="'+ind+'" data-id="'+ob.id+'" data-money="'+ob.money+'">' +ob.name+'	<span class="label label-success">'+ ob.money+' $K'+'</span><ul></ul></li></ul><hr>';
		$("#tree").html(getHtml+template);
	}else {
		for(var index in arr){
		findChild(arr[index]);
		}
	}
};

function findChild(id) {
	var template='';
	for(var index in addedData){
		if(addedData[index].parent === id && hasChild(addedData[index].id) === true){
			template += '<li data-index="'+index+'" data-id="'+addedData[index].id+'" data-money="'+addedData[index].money+'">' +addedData[index].name+'	<span class="label label-success">'+ addedData[index].money+' $K'+'</span><ul></ul></li>';
		}else if(addedData[index].parent === id && hasChild(addedData[index].id) === false){
			template += '<li data-index="'+index+'" data-id="'+addedData[index].id+'" data-money="'+addedData[index].money+'">' +addedData[index].name+'	<span class="label label-success">'+ addedData[index].money+' $K'+'</span></li>';
		}
	}
	$('#tree li[data-id="'+id+'"] ul').html(template);
};

function hasChild(id) {
	for (var index in addedData) {
		if(addedData[index].parent === id){
			arr.push(addedData[index].id);
			arr = [ ...new Set(arr) ];
			return true;
		}
	}
	return false;
};

///////////////////////////////////////////////////////////////////////////////
/////////////////////////MONEY COUNTER/////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
function moneyCounter(argument) {
	$('#tree').find('li');	
};
 $('#tree li[data-id="12"] li').last().parent();
 $('#tree > ul').data('id');
$("li").map(function() {
    return $(this).data("money");
}).get();



///////////////////////////////////////////////////////////////////////////////
/////////////////////////SORT//////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
function sortByKey(array, key) {
	return array.sort(function(a, b) {
	  var x = a[key]; var y = b[key];
	  return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	});
};




reviewdata();

//to do
//find all child of parent 0
//then find for each child of parent 0 if they have child's
//put all child of parent into object "parentID":{"child":"5,6,9,8,7"}
//make new key parentID.htmlCode = ""; if child one have child
//if have child then put in child array "1": {"id": "1,2,3,4"}