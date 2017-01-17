window.onload = function () {

	var page;

	if(!localStorage.admintoken)
		return askForToken();

	prepareDashboard();

	function askForToken(){
		document.getElementById('tokenSubmit').addEventListener('click', function(){
			checkToken();
		});

		function checkToken(){
			var xhr = new XMLHttpRequest();

			xhr.onreadystatechange = function() {
				if (xhr.readyState == XMLHttpRequest.DONE) {
					try{
						
						var json = JSON.parse(xhr.responseText);
						if(json.success === false)
							return alert(json.description);

						localStorage.admintoken = document.getElementById('token').value;
						prepareDashboard();

					}catch(e){
						console.log(e);
					}

					console.log(xhr.responseText);
					// xhr.responseText
				}
			}
			xhr.open('GET', '/api/verify', true);
			xhr.setRequestHeader('type', 'admin');
			xhr.setRequestHeader('token', document.getElementById('token').value);
			xhr.send(null);
		}
	}

	function prepareDashboard(){
		page = document.getElementById('page');
		document.getElementById('auth').style.display = 'none';
		document.getElementById('dashboard').style.display = 'block';

		document.getElementById('itemUploads').addEventListener('click', function(){
			getUploads();
		});

		document.getElementById('itemManageGallery').addEventListener('click', function(){
			getGalleries();
		});
	}

	function getUploads(){
		page.innerHTML = '';
		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function() {
			if(xhr.readyState == XMLHttpRequest.DONE){
				
				if(xhr.responseText === 'not-authorized')
					return notAuthorized();

				var json = JSON.parse(xhr.responseText);

				var container = document.createElement('div');
				container.innerHTML = `
					<table class="table">
				  		<thead>
				    		<tr>
							      <th>File</th>
							      <th>Gallery</th>
							      <th>Date</th>
				    		</tr>
				  		</thead>
				  		<tbody id="table">
				  		</tbody>
				  	</table>`;
				page.appendChild(container);

				var table = document.getElementById('table');

				for(var item of json){

					var tr = document.createElement('tr');
					tr.innerHTML = `
						<tr>
					    	<th><a href="${item.file}" target="_blank">${item.file}</a></th>
					      	<th>${item.gallery}</th>
					      	<td>${item.date}</td>
					    </tr>
					    `;

					table.appendChild(tr);
				}
				
			}
		}
		xhr.open('GET', '/api/uploads', true);
		xhr.setRequestHeader('auth', localStorage.admintoken);
		xhr.send(null);
	}

	function getContent(item, value){
		let endpoint;
		if(item === 'uploads') endpoint = '/api/uploads'
		if(item === 'galleries') endpoint = '/api/uploads'

	}

	function notAuthorized() {
		localStorage.removeItem("admintoken");
		location.reload();
	}

}
