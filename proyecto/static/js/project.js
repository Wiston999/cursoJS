var socket = io.connect();

var globalUserName = null;

socket.on('newUser', function(response){
	alertify.success(response['data']);
});

socket.on('byeUser', function(response){
	alertify.error(response['data']);
});

socket.on('newPost', function(response){
	alertify.log(response['data']);
});

function printHeader(data){
	if(data.status == 'error'){
		$('#header').removeClass('alert-success');
		$('#header').addClass('alert-danger').show(1000);
	}else{
		$('#header').removeClass('alert-danger');
		$('#header').addClass('alert-success').show(1000);
	}
	$('#alertText').html(data.description);
}

function appendCommentToTable(data){
	var firstTr = $('<tr class="clickableRow"></tr>');
	var secondTr = $('<tr class="hiddenRow"></tr>');
	var date = new Date(data['date']);
	firstTr.append($('<td>'+data['author']+'</td>'));
	firstTr.append($('<td>'+data['title']+'</td>'));
	firstTr.append($('<td>'+(date.getDate()+'-'+date.getMonth()+'-'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds())+'</td>'));
	firstTr.on('click', function(){
		$(this).next().toggle(1000);
	});
	secondTr.append($('<td colspan="3"><pre>'+data['content']+'</pre></td>'));
	
	$("#tableBody").append([firstTr, secondTr]);
	$('#numComments').html(parseInt($('#numComments').html()) + 1);
}

$('#logIn').on('click', function(){
	var userName = $('#logInInput').val();
	$.ajax({
		url:'/bloggin/'+encodeURIComponent(userName),
		type: 'PUT',
		success:  function (response) {
			printHeader(response);
			if(response.status == 'success'){
				globalUserName = userName;
				$('#loginFormDiv').hide(1000);
				$('#loggedDiv').show(1000);
			}
		},
		error: function (){
			$('#header').addClass('alert-danger').html('Catastrophic Error').show(1000);
		}
	});
});

$('#sendComment').on('click', function(){
	var userName = $('#logInInput').val();
	var title = encodeURIComponent($('#newCommentTitle').val()).replace(/(%0.)|\?/g, '');	//OpenShift me obliga a quitar estos caracteres y algunos mas que no se reemplazan aqui
	var comment = encodeURIComponent($('#newCommentText').val()).replace(/(%0.)|\?/g, ''); //OpenShift me obliga a quitar estos caracteres y algunos mas que no se reemplazan aqui
	$.ajax({
		url:'/bloggin/'+encodeURIComponent(userName)+'/'+title+'/'+comment,
		type: 'POST',
		success:  function (response) {
			printHeader(response);
			appendCommentToTable(response['newComment']);
		},
		error: function (){
			$('#header').addClass('alert-danger').html('Catastrophic Error').show(1000);
		}
	});
});

$('#postNewComment').on('click', function(){
	$('#myModal').modal('show');
	$('#newCommentTitle').html('');
	$('#newCommentText').html('');
});

$('#searchComment').on('click', function(){
	var userName = $('#logInInput').val();
	var searchStr = $('#searchStr').val();
	
	$.ajax({
		url:'/bloggin/'+encodeURIComponent(userName)+'/search/'+encodeURIComponent(searchStr),
		type: 'GET',
		success:  function (response) {
			printHeader(response);
			$('#numComments').html('0');
			if(response.status == 'success'){
				$('#numComments').html('0');
				$('.clickableRow').remove();
				$('.hiddenRow').remove();
				for(var i=0; i<response['comments'].length; i++){
					appendCommentToTable(response['comments'][i]);
				}
			}
		},
		error: function (){
			$('#header').addClass('alert-danger').html('Catastrophic Error').show(1000);
		}
	});
});

$('#myComments').on('click', function(){
	$.ajax({
		url:'/bloggin/'+encodeURIComponent(globalUserName),
		type: 'GET',
		success:  function (response) {
			printHeader(response);
			if(response.status == 'error'){
				$('#numComments').html('0');
			}else{
				$('#numComments').html('0');
				$('.clickableRow').remove();
				$('.hiddenRow').remove();
				for(var i=0; i<response['comments'].length; i++){
					appendCommentToTable(response['comments'][i]);
				}
			}
		},
		error: function (){
			$('#header').addClass('alert-danger').html('Catastrophic Error').show(1000);
		}
	});
});

$(window).bind('beforeunload', function() {
	if(globalUserName != null){
		$.ajax({
			url:'/bloggin/'+globalUserName,
			type: 'DELETE',
			async: false,
			success:  function (response) {
				printHeader(response);
				return response.description;
			},
			error: function (){
				$('#header').addClass('alert-danger').html('Catastrophic Error').show(1000);
			}
		});
	}
});