function open_index() {
    window.open("index.html","_self", false);
}

function store_in_session() {
    var accountnum = document.getElementById("userid").value;
    sessionStorage.setItem("userid", accountnum);

    var obj = {};
    obj[user_id] = accountnum;
    obj[name] = document.getElementById("username").value;
    obj[email] = document.getElementById("email").value;
    obj[phone] = document.getElementById("phonenumber").value;

    var data = JSON.stringify( obj );
    $.ajax({
            url: 'https://finul-api.herokuapp.com/register',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                $('#target').html(data.msg);
            },
            data: data
        });

    open_index();
}
