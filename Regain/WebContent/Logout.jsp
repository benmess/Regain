<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@include file="regain_design_header.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Logout</title>
</head>
<script>
var gsErrorMsg = "";
OpeningMsg();

$.get('LogoutRegain', logoutSucc);
function OpeningMsg()
{
	gsErrorMsg = UrlFullDecode(getQuerystring(window.location.href,'ErrorMsg'));
}

function logoutSucc()
{
	var sExtra = "";
	if(gsErrorMsg != "")
	{
		gsErrorMsg = "?ErrorMsg=" + gsErrorMsg;
	}
	window.location = 'logon.html'+gsErrorMsg;
}
</script>
<body>
	<input id="hidden1" type="hidden">
</body>
</html>