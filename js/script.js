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
	var jqXHR = $.getJSON('https://api.myjson.com/bins/3uoya');
 	jQuery.support.cors = true;
	jqXHR.complete(function(response) {
		recivedData = response.responseJSON;
		addedData = sortByKey(recivedData,'parent');
		nestedData = $.extend(true, [], recivedData);
		$('h1').html("<b>Company organizer</b></br><i> status: "+ Object.keys(addedData).length +" companies loaded</i>");
		var list = '<option data-id="0">none</option>';
		for (var key in addedData) {
			list += '<option data-index="'+ key +'" data-id="'+addedData[key].id+'">' + addedData[key].name + '</option>';
		}
		$('.parent, .company').html(list);
		$('#tree').html(" ");
		parentCheck();
		moneyCounter();
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
	$('#tree li[data-id="'+companyObject.id+'"] li').each(function (index, value) { 
	  $('#'+dad+' .parent option[data-id="'+Number($(this).attr('data-id'))+'"]').remove();
	});
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
		reviewdata();
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
		$('.submit_delete').hide();
		$('#page3 .company, label').hide();
		$('#page3 .childrens').html('<li data-id="'
			+ $('#page3 .company option:selected').data("id")+'"' 
			+'>' +  $('#tree li[data-id="'+$('#page3 .company option:selected').data("id")+'"]').html()); 
		var arrForDel = [];
			$('#page3 .childrens li').each(function (index, value) { 
	  		arrForDel.push(Number($(this).attr('data-id')));
		});
		if (arrForDel.length === 1) {
			$('#page3 .childrens').html('Are you sure? This company has no children!<br><ul><li data-id="'
			+ $('#page3 .company option:selected').data("id")+'"' +'>' 
			+ $('#tree li[data-id="'+$('#page3 .company option:selected').data("id")+'"]').html() 
			+ '<br><button type="button" class="btn btn-default submit_delete_all">DELETE</button>'
			+ '<button type="button" class="btn btn-default submit_delete_cancel">CANCEL</button>'
			);
		} else {
			$('#page3 .childrens').html('Are you sure? This company has '+ (Number(arrForDel.length) -1)+' children!<br><ul><li data-id="'
			+ $('#page3 .company option:selected').data("id")+'"' +'>' 
			+ $('#tree li[data-id="'+$('#page3 .company option:selected').data("id")+'"]').html() +
			 '<br> <b>THEY ALL WILL BE DELETED!</b>'+
			 '<br> <i>Recommendation: remove parent assignment from child companies before deletion</i>'+
							'<br><button type="button" class="btn btn-default submit_delete_all">DELETE ALL OF THEM</button>'+
							'<button type="button" class="btn btn-default submit_delete_cancel">CANCEL</button>'
			);
		}

		$('.submit_delete_all').click(function () {
			var arrForDel = [];
			$('#page3 .childrens li').each(function (index, value) { 
	  		arrForDel.push(Number($(this).attr('data-id')));
			});

			for(var index in arrForDel){
				del(arrForDel[index]);

			}

			function del(id) {
				for(var index in addedData){
					if(addedData[index].id === id){
						addedData.splice(index, 1);
					}
				}
			}
			postdata();
			reviewdata();
			$('#page3 .childrens').html(' ');
			$('#page3 .submit_delete').show();
			$('#page3 .company, label').show(); 
		});

		$('.submit_delete_cancel').click(function () {
			$('#page3 .childrens').html(' ');
			$('#page3 .submit_delete').show();
			$('#page3 .company, label').show();
		});
	}
});
///////////////////////////////////////////////////////////////////////////////
/////////////////////////VIEW//////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
$('#page4 .company').change(function () {
	if($('#page4 .company option:selected').data("id") === 0){
		$(function(){
			new PNotify({
				title: 'Oh No!',
				text: 'Please chose company to view status.',
				type: 'error'
			});
		});
	}else{
	var index = $('#page4 .company option:selected').data("index");
	var ob = addedData[index];
	var counter = [];
	var num = 0;
	$('#tree li[data-id="'+$('#page4 .company option:selected').data("id")+'"] li').each(function (index, value) { 
	  	counter.push(Number($(this).attr('data-id')));
	});
	console.log(counter);
	if(counter.length == 0){
		num = 'no';
	}else{
		num = Number(counter.length);
	}
	var totalMoney = '';
	var total = $('#tree li[data-id="' + $('#page4 .company option:selected').data("id")+'"] > span.label.label-info').html();
	if(total == ''){
		totalMoney = $('#tree li[data-id="' + $('#page4 .company option:selected').data("id")+'"] > span.label.label-success').html();
	}else{
		totalMoney = total;
	} 
	$('#page4 .childrens .company_info').html(
		'<label>Information</label>'+
		'<p><b>Name :</b> '+ ob.name +'</p>'+
		'<p><b>Earnings :</b> '+ ob.money +' $K </p>'+
		'<p><b>Total earnings :</b> ' + 
		totalMoney+ '</p>'+
		'<p><b>Child companies :</b> '+ num +'</p>').html();

	$('#page4 .childrens .child_tree').html('<label>Child tree</label><ul><li data-id="'
			+ $('#page4 .company option:selected').data("id")+'"' 
			+'>' +  $('#tree li[data-id="'+$('#page4 .company option:selected').data("id")+'"]').html()+'</ul>');
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
		reviewdata();
	}
});

///////////////////////////////////////////////////////////////////////////////
/////////////////////////TREE BUILDER//////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
function parentCheck(){
	var tree = nested(nestedData);

	for(var key in tree){
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

function nested(f){
  return f.sort((a,b) => a.id.length < b.id.length ? 1 : a.id.length == b.id.length ? a.id < b.id ? -1 : 1 :-1)
          .reduce((p,c,i,a) => {var parent = !!c.parent && a.find(e => e.id === c.parent);
                                !!parent ? !!parent.Sub && parent.Sub.push(c) || (parent.Sub=[c]) : p.push(c);
                                return p;},[]);
};
///////////////////////////////////////////////////////////////////////////////
/////////////////////////MONEY COUNTER/////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
function moneyCounter() {

	status = 0;
	var parents=[];
	for (var index in addedData) {
		if(addedData[index].parent === 0){
			parents.push(addedData[index].id)
		}
	}
	setMoney(parents);

	function setMoney(list) {
		var childs=[];
		for(var index in list){
			var sum = 0;
			if(($('#tree li[data-id="'+list[index]+'"] li').length === 0 || list.length === 0) && !$('#tree li[data-id="'+list[index]+'"] li').is(':has(span.label-info)')){
				$('#tree li[data-id="'+list[index]+'"] > span').after(" <span class='label label-info'></span>" );
			}else if(!$('#tree li[data-id="'+list[index]+'"] li').is(':has(span.label-info)')){
				$('#tree li[data-id="'+list[index]+'"] li').each(function (index, value) { 
					sum += Number($(this).attr('data-money'));
					if($('#tree li[data-id="'+list[index]+'"] li') !== 0 && !$('#tree li[data-id="'+list[index]+'"] li').is(':has(span.label-info)')){
						childs.push($(this).attr('data-id'));
					}
				});	
				sum += Number($('#tree li[data-id="'+list[index]+'"]').data('money'));
				if(!$('#tree li[data-id="'+list[index]+'"] li').is(':has(span.label-info)')){
					$('#tree li[data-id="'+list[index]+'"] > span').after( " <span class='label label-info'>"+ sum +" $K </span>" );
				}

			}
		}
		childs = jQuery.unique(childs);
		if(childs.length !== 0){
			setMoney(childs);
		}
	};
};




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