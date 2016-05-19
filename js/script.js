var recivedData, addedData, nestedData;


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
	$("#tree").html('<h3 class="text-center text-uppercase text-info ">Loading .....</h3>');
	var jqXHR = $.getJSON('https://api.myjson.com/bins/3uoya');
 	jQuery.support.cors = true;
	jqXHR.complete(function(response) {
		recivedData = response.responseJSON;
		addedData = sortByKey(recivedData,'parent');
		nestedData = $.extend(true, [], recivedData);
		$('h1').html("<b>Company organizer</b></br><i> status: "+ Object.keys(addedData).length +" company's loaded</i>");
		var list = '<option data-id="0">none</option>';
		for (var key in addedData) {
			list += '<option data-index="'+ key +'" data-id="'+addedData[key].id+'">' + addedData[key].name + '</option>';
		}
		$('.parent, .company').html(list);
		parentCheck();
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
function parentCheck(){
	var tree = nested(nestedData);
	// console.log(tree);
	for(var key in tree){
		// console.log(tree[key]);
		if($('li[data-id="'+tree[key].id+'"]').length <=0){
			var template = '<ul><li data-id="'+tree[key].id+'" data-money="'+tree[key].money+'">' +tree[key].name+'	<span class="label label-success">'+ tree[key].money+' $K'+'</span></li></ul><hr>';
			$("#tree").append(template);
			subArray(tree[key].Sub);
		}
	}
};

function subArray(sub){
	for(var key in sub){

		if($('li[data-id="'+sub[key].id+'"]').length <=0){
			var template = '<ul><li data-id="'+sub[key].id+'" data-money="'+sub[key].money+'">' +sub[key].name+'	<span class="label label-success">'+ sub[key].money+' $K'+'</span></li></ul>';
			$('#tree li[data-id="'+sub[key].parent+'"]').append(template);
			subArray(sub[key].Sub);
		}
	}
};

function buildSub(){

};

function nested(f){
	// console.log(f);
  return f.sort((a,b) => a.id.length < b.id.length ? 1 : a.id.length == b.id.length ? a.id < b.id ? -1 : 1 :-1)
          .reduce((p,c,i,a) => {var parent = !!c.parent && a.find(e => e.id === c.parent);
                                !!parent ? !!parent.Sub && parent.Sub.push(c) || (parent.Sub=[c]) : p.push(c);
                                return p;},[]);
};
///////////////////////////////////////////////////////////////////////////////
/////////////////////////MONEY COUNTER/////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// function moneyCounter(argument) {
// 	$('#tree').find('li');	
// };
//  $('#tree li[data-id="12"] li').last().parent();
//  $('#tree > ul').data('id');
// $("li").map(function() {
//     return $(this).data("money");
// }).get();



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
//fix edit
//		you cant put parent id on child's
//		find child push to array
//		forEach in array search for more child => push to array
//		and again until you cant find any id for this child
//
//
//
//
//
//find all child of parent 0
//then find for each child of parent 0 if they have child's
//put all child of parent into object "parentID":{"child":"5,6,9,8,7"}
//make new key parentID.htmlCode = ""; if child one have child
//if have child then put in child array "1": {"id": "1,2,3,4"}