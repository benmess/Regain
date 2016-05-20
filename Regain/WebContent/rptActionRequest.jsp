<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@include file="regain_admin_header.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Action Request Report</title>
</head>
<script type="text/javascript" src="ActionRequest.js"></script>
<script>
$(document).ready(PreparePage);

function PreparePage()
{
	PopulateOperations();
}

gsCurrentPage = "rptActionRequest";	


function GetUserId()
{
	return <%	if(session.getAttribute("username") != null){ %>'<%= session.getAttribute("username").toString() %>';<%}
				else {%>'';<%}%>
} 

</script>
<body>
	<table border="0" cellspacing="2" cellpadding="1">
		<tr>
			<td colspan="2"
				class="grdfont18 grdfontBold grdfontItalic grdRowTextAligCenter">Create an Action Request Report for Upload Into Windchill</td>
		</tr>
		<tr>
			<td>Operation:</td>
			<td><select value="" id="cmbOperation"></td>
		</tr>
		<tr>
			<td>Start Date:</td>
			<td><input size="30" value="" id="start_date" maxlength="25"
				type="text" onblur="ValidateDate(this)"></td>
		</tr>
		<tr>
			<td>End Date:</td>
			<td><input size="30" value="" id="end_date" maxlength="25"
				type="text" onblur="ValidateDate(this)"></td>
		</tr>
		<tr>
			<td colspan="2" align="center">
			<input id="btnRunReportActionRequest"
				name="RunReportActionRequest" type="button" value="Run Report"
				onclick="RunReportActionRequest();">
			</td>
		</tr>
	</table>


	<div id="fade"></div>
	<div id="modal">
		<img id="loader" src="images/loading.gif" />
	</div>
</body>
</html>