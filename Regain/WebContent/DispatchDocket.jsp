<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@include file="regain_design_header.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Dispatch Docket Entry</title>
</head>
<script type="text/javascript" src="DispatchDocket.js"></script>

<body>
	<div id="divDDContainer"  style="width: 1000px;height: 400px">
	</div>
</body>

	<!--  MASS BALANCE DIV. REQUIRE THE WHOLE DIV WITH EXACTLY THE SAME IDs TO WORK -->
	<div style="display: none; z-index: 1000; left: 100px; top: 100px" id="divMBPopup">
		<table style="table-layout: fixed; width: 660px">
			<tr>
				<td style="width: 650px" align="center">
					<label id="MBAccountHeader" class="grdfont grdfont10">Mass Balance Account Search</label>
				</td>
				<td style="width: 10px" align="center">
					<label style="font-family: arial" onclick="closeMBPopup('divMBPopup');">X</label>
				</td>
			</tr>
		</table>
		<table style="table-layout: fixed; width: 650px">
			<tr>
				<td style="width: 200px" align="center">
					<label class="grdfont grdfont10">Mass Balance Account No</label>
					<input id="hfToOrFromAccount" type="hidden" value="" />
					<input id="hfPopupUnderlyingRowNo" type="hidden" value="" />
				</td>
				<td style="width: 450px" align="center">
					<label class="grdfont grdfont10">Description</label>
				</td>
			</tr>
			<tr>
				<td align="center">
					<input id="MBPopupAccountNo" type="text" style="width: 200px" title="Put in an account No or part of an account number"	class="grdfont grdfont10" />
				</td>
				<td align="center">
					<textarea id="MBPopupAccountDesc" title="Put in a description of part description" rows="4" cols="30" class="grdfont grdfont10" wrap="hard"></textarea>
				</td>
				<td></td>
			</tr>
			<tr>
				<td align="center">
					<input id="btnMBAccountSearch" type="button" style="width: 100px" title="Search for Mass Balance Account" class="grdfont grdfont10" value="Search" onclick="ClickMBSearch();"/>
				</td>
				<td align="center">
					<select id="cmbMBAccounts" style="visibility:hidden;" onchange="MBPopupSelected();">
					</select>
				</td>
				<td></td>
			</tr>
			
		</table>
	</div>

	<div id="fade"></div>
	<div id="modal">
		<img id="loader" src="images/loading.gif" />
	</div>
<script>
var gsProjectId = "";

$(document).ready(GetUserRoles('PreparePage'));
gsCurrentPage = "Dispatch Docket Entry";	

function PreparePage()
{
	DisableDesignMenus();
	GetDropdownCodes();
}

function Get_ReadOnly_Flag()
{
	return 0;	
}
</script>
</html>