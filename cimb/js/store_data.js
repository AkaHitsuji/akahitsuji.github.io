function store_in_session() {
    var accountnum = document.getElementById("userid").value;
    console.log(accountnum);
    sessionStorage.setItem("userid", accountnum);

    window.open("https://akahitsuji.github.io/cimb/index.html","_self")
}
