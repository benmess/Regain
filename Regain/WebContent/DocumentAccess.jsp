<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@include file="regain_admin_header.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Document Access</title>
</head>
<script type="text/javascript" src="Shared/Document.js"></script>
<script>
$(document).ready(PreparePage);

function PreparePage()
{
	GetDocAccess();
}

gsCurrentPage = "DocAccess";	


function GetUserId()
{
	return <%	if(session.getAttribute("username") != null){ %>'<%= session.getAttribute("username").toString() %>';<%}
				else {%>'';<%}%>
} 

function Get_ReadOnly_Flag()
{
	return 0;	
}

</script>
<body>
<div>
<input type="button" id="btnSave" value="Save" style="width=100px;" onclick="SaveJobAccessLevels(false);" />
</div>
</br>
	<div id="divDocAccess"  style="width: 1000px;height: 270px">
	</div>
	</br>
	<div id="divDocTypeAccess"  style="width: 1000px;height: 470px">
	</div>

	<div id="fade"></div>
	<div id="modal">
		<img id="loader" src="images/loading.gif" />
	</div>
</body>
</html>