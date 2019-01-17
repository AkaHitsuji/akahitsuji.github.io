function open_index() {
    window.open("index.html","_self", false);
}

function store_in_session() {
    var accountnum = document.getElementById("userid").value;
    sessionStorage.setItem("userid", accountnum);
    //
    // const url='https://finul-api.herokuapp.com/register';
    // const data = {
    //     "user_id": accountnum,
    //     "name": document.getElementById("username").value,
    //     "email": document.getElementById("email").value,
    //     "phone": document.getElementById("phonenumber").value
    // }
    //
    // $.post(url,data, function(data,status){
    //     console.log("${data} and status is {status}")});

    // Http.open("POST", url);
    // Http.send();
    // Http.onreadystatechange=(e)=>{
    // console.log(Http.responseText)

    // $.post("https://finul-api.herokuapp.com/register",
    // {
    //     user_id: accountnum,
    //     name: document.getElementById("username").value,
    //     email: document.getElementById("email").value,
    //     phone: document.getElementById("phonenumber").value
    // },
    // function(data, status){
    //   alert("Data: " + data + "\nStatus: " + status);
    // });
    // var obj = {};
    // obj["user_id"] = accountnum;
    // obj["name"] = document.getElementById("username").value;
    // obj["email"] = document.getElementById("email").value;
    // obj["phone"] = document.getElementById("phonenumber").value;
    //
    // var data = JSON.stringify( obj );
    // $.ajax({
    //         url: 'https://finul-api.herokuapp.com/register',
    //         type: 'post',
    //         dataType: 'json',
    //         contentType: 'application/json',
    //         success: function (data) {
    //             $('#target').html(data.msg);
    //         },
    //         data: data
    //     });

    // open_index();
}
