<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@include file="regain_design_header.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Document Search</title>
</head>
<script type="text/javascript" src="Shared/Document.js"></script>

<body>
	<div id="divDocSearch"  style="width: 1000px;height: 100px">
		<table>
			<tr>
				<td style="width: 450px" align="center">
					<label class="grdfont grdfont10">Search on Part of Document Number, Part of Name or Part of File Name</label>
				</td>
				<td style="width: 450px" align="center">
					<input id="DocSearchCriteria" type="text" style="width: 430px" title="Put in part of the document name, document number or file name and then hit search"	class="grdfont grdfont10" />
				</td>
				<td style="width: 100px" align="center">
					<input id="btnDocSearch" type="button" style="width: 80px" title="click to search" class="grdfont grdfont10" value="Search" onclick="DocSearch();" />
				</td>
			</tr>
			<tr>
				<td style="width: 450px" align="right">
					
				</td>
				<td style="width: 450px" align="right">
					<label class="grdfont grdfont10">Include obsolete documents</label><input id="chkHistoric" type="checkbox" style="width: 30px" title="Tick this check box if you wish to include obsolete documents in the results" class="grdfont grdfont10" />
				</td>
				<td style="width: 100px" align="center">
					
				</td>
			</tr>
		</table>
	</div>
	<div id="divDocSearchResults"  style="width: 1000px;height: 600px">
	</div>
	
</body>


	<div id="fade"></div>
	<div id="modal">
		<img id="loader" src="images/loading.gif" />
	</div>
<script>
var gsProjectId = "";

$(document).ready(GetUserRoles('PreparePage'));
gsCurrentPage = "Document Search";	

function PreparePage()
{
	$(document).ready(function(){
	    $('#DocSearchCriteria').keypress(function(e){
	      if(e.keyCode==13)
	      $('#btnDocSearch').click();
	    });
	});
	
	DisableDesignMenus();
	
}

function Get_ReadOnly_Flag()
{
	return 0;	
}
</script>
</html>