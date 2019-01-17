var templateInfo = document.getElementById("transaction-template").innerHTML;
var template = Handlebars.compile(templateInfo);

var context = {
transactions:[
  {message: "RECEIVED", dt: "on 17/01/19 at 12:59PM", amount: "MYR3.50", color:"green"},
  {message: "SENT TO DESHENG", dt: "on 16/01/19 at 11:34AM", amount: "-MYR15.50", color:"red"},
  {message: "SENT TO WEIJIAN", dt: "on 16/01/19 at 10:59PM", amount: "-MYR2.50", color:"red"},
  {message: "SENT TO JIESHUN", dt: "on 15/01/19 at 09:59PM", amount: "-MYR4.00", color:"red"},
  {message: "SENT TO JIESHUN", dt: "on 15/01/19 at 08:59AM", amount: "-MYR9.80", color:"red"},
  {message: "RECEIVED", dt: "on 14/01/19 at 2:39PM", amount: "MYR12.50", color:"green"},
  {message: "RECEIVED", dt: "on 14/01/19 at 2:29PM", amount: "MYR14.50", color:"green"},
  {message: "RECEIVED", dt: "on 14/01/19 at 1:39PM", amount: "MYR120.50", color:"green"},
]
}

var templateData = template(context);

document.getElementById('listDiv').innerHTML += templateData;
