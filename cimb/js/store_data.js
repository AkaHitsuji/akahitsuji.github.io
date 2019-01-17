function store_in_session() {
    var accountnum = document.getElementById("userid").value;
    console.log(accountnum);
    sessionStorage.setItem("userid", accountnum);

    // window.open("index.html","_self")

}
