
$("#result").append('<div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status"> <span class="sr-only">Loading...</span> </div>');
LoadData();
/*Display All Records*/
function LoadData() {
    firebase.database().ref('/users').once('value').then(function(snapshot) {
        try {
			var storageRef = firebase.storage().ref("/");
            snapshot.forEach(function(childSnapshot) {
                var childData = childSnapshot.val();
				
                $("#result").append("<tr>" +
                    "<td>" + childData.fname + "</td>" +
                    "<td>" + childData.lname + "</td>" +
                    "<td>" + childData.username + "</td>" +
                    "<td>" + childData.password + "</td>" +
					"<td><img class='img-circle' style='width:30px' id='"+childSnapshot.key+"' src='img/user.png'></td>" +
                    "<td>" +
                    "<i title='Edit' onclick=Update('" + childSnapshot.key + "','" + childData.fname + "','" + childData.lname + "','" + childData.username + "','" + childData.password + "') class='fa fa-edit mr-3' data-toggle='modal' data-target='#exampleModal'></i>" +
                    "<i title='Delete' onclick=Delete('" + childSnapshot.key + "') class='fa fa-remove'></i>" +
                    "</td>" +
                    "</tr>");
					
					storageRef.child(childData.fileURL).getDownloadURL().then(function(url) 
					{
						document.querySelector('#'+childSnapshot.key).src = url;
					}).catch(function(error) 
					{

					});					
            });
        }catch(error) {
            alert("Data could not be loaded. " + error);
        }
        /*Reponsive DataTable*/
        $('#myTable').DataTable({
            rowReorder: {
                selector: 'td:nth-child(2)'
            },
            responsive: true
        });
        /*End Reponsive DataTable*/

    });
}
/*End Display All Records*/

/*Inserting Records*/
$("#addBtn").click(function() {
    writeUserData($("#fname").val(), $("#lname").val(), $("#username").val(), $("#password").val(), $('#uploadfile')[0].files[0]);
});

function writeUserData(fname, lname, username, password, uploadfile) {

	var ref = firebase.database().ref('/users');
	ref.once('value').then(function(snapshot) {
		var exist=false;
		snapshot.forEach(function(childSnapshot) {
			var childData = childSnapshot.val();
			if (childData.fname == fname) {
				exist=true;
				return false;
            }
		});
		
		var fileURL = "photo/"+fname+"_"+lname+"/"+uploadfile.name;
		if(exist==false){
			ref.push({
				fname: fname,
				lname: lname,
				username: username,
				password: password,
				fileURL:fileURL
			});
			
			// Create file metadata including the content type
			var metadata = {
			  contentType: 'image/jpeg',
			};
			/*File Upload*/
			var storageRef = firebase.storage().ref(fileURL);
			storageRef.put(uploadfile, metadata);


			alert("New record was added successfully!");
			$('#myTable').DataTable().destroy();
			$("#result").empty();
			LoadData();
			$('#register').find("input[type=text],input[type=password], textarea").val("");//Code for clearing form textboxes
		}else{
			alert(fname + " already exist, please try again!");
		}
	});
}
/*End Inserting Records*/

/*Updating Records*/
$("#updateBtn").click(function() {
    if (updateUserData($("#u_key").val(), $("#u_fname").val(), $("#u_lname").val(), $("#u_username").val(), $("#u_password").val()) == true) {
        alert("Updated successfully.");
    }
});

function updateUserData(key, fname, lname, username, password) {
    try {
        // A record entry.
        var postData = {
            fname: fname,
            lname: lname,
            username: username,
            password: password
        };
        // Update the new record data simultaneously.
        var updates = {};
        updates['/users/' + key] = postData;
        firebase.database().ref().update(updates);
        $('#myTable').DataTable().destroy();
        $("#result").empty();
        LoadData();
        return true;
    } catch (error) {
        alert("Update could not be saved. " + error);
    }
}

function Update(key, fname, lname, username, password) {//Copy data from record row
    $("#u_key").val(key);
    $("#u_fname").val(fname);
    $("#u_lname").val(lname);
    $("#u_username").val(username);
    $("#u_password").val(password);
}
/*End Updating Records*/

function Delete(key) {
    var result = confirm("Are you sure to delete?");
    if (result) {
        firebase.database().ref("/users/"+key).remove();
        $("#myTable").DataTable().destroy();
        $("#result").empty();
        LoadData();
    }
}

/*File Upload*/

    $(document).ready(function(){
        $('#uploadfile').change(function(e){
		  if (this.files && this.files[0]) {
			  var img = document.querySelector('#myImg');  // $('img')[0]
			  img.src = URL.createObjectURL(this.files[0]); // set src to file url
			  
		  } 

        });
		
		
		
		
    });