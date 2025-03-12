function open_index() {
    window.open("index.html");
}

function store_in_session() {
    var accountnum = document.getElementById("userid").value;
    sessionStorage.setItem("userid", accountnum);

    // var data = new FormData();
    // data.append('user_id', accountnum);
    // console.log(accountnum);
    // data.append('name', document.getElementById("username").value);
    // console.log(document.getElementById("username").value);
    // data.append('email', document.getElementById("email").value);
    // console.log(document.getElementById("email").value);
    // data.append('phone', document.getElementById("phonenumber").value);
    // console.log(document.getElementById("phonenumber").value);
    // console.log(data);
    //
    // var xhr = new XMLHttpRequest();
    // xhr.open('POST', 'https://finul-api.herokuapp.com/register', true);
    // xhr.onload = function () {
    //     // do something to response
    //     var response = JSON.parse(this.responseText);
    //
    //     console.log('this is the response',response);
    // };
    // xhr.send(data);
    // console.log('data sent');


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
    // console.log(accountnum);
    // obj["name"] = document.getElementById("username").value;
    // console.log(document.getElementById("username").value);
    // obj["email"] = document.getElementById("email").value;
    // obj["phone"] = document.getElementById("phonenumber").value;
    // console.log('this is the obj: ',obj);

    const data = new URLSearchParams();
    for (const pair of new FormData(document.getElementById("form"))) {
        data.append(pair[0], pair[1]);
    }

    console.log(data);

    var url = "https://finul-api.herokuapp.com/register"
    fetch(url, {
        method: 'post',
        body: data,
    });

    window.open("index.html");
    //
    // fetch("https://finul-api.herokuapp.com/register",
    // {
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json'
    //     },
    //     method: "POST",
    //     body: JSON.stringify(obj)
    // })
    // .then(function(res){ console.log(res) })
    // .catch(function(res){ console.log(res) })
    //
    // var data = obj;
    // $.ajax({
    //         url: 'https://finul-api.herokuapp.com/register',
    //         type: 'post',
    //         dataType: 'json',
    //         contentType: 'application/json',
    //         success: function (data) {
    //             // var response = JSON.parse(data.msg)
    //             // console.log('the content is, ',response);
    //             if(data.success=="true"){
    //                 console.log('success');
    //             }else{
    //                 console.log('failure');
    //             }
    //         },
    //         data: data
    //     });

    // open_index();
}
