<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@include file="regain_admin_header.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Mass Balance Report Criteria</title>
</head>
<script type="text/javascript" src="MassBalance.js"></script>

<body>
	<div>
		<table style="table-layout:fixed;width:650px;">
			<tr>
				<td style="width:350px"><label id="ReportSelectLbl" class="grdfont grdfont10 grdfontBold grdRowTextAligRight" >Select Report</label></td>
				<td style="width:310px"><select id="cmbReportTypes" class="grdfont grdfont10 grdRowTextAligLeft" ></select></td>
				<td style="width:30px"></td>
			</tr>
		</table>
		<label id="MB_CtriteriaHdr" class="verylargeBoldBlackText">Mass Balance Account Range Selection Criteria</label>
		<table style="table-layout:fixed;width:650px;">
			<tr>
				<td style="width:350px" class="grdfont12" ><label id="criteriatype_hdr"></label></td>
				<td style="width:140px" class="grdfont grdfont10 grdfontBold grdRowTextAligCenter"><label id="criteriastart_hdr">Start</label></td>
				<td style="width:30px"></td>
				<td style="width:140px" class="grdfont grdfont10 grdfontBold grdRowTextAligCenter"><label id="criteriaend_hdr">End</label></td>
				<td style="width:30px"></td>
			</tr>

			<tr>
				<td><label id="criteriatype_1" class="grdfont grdfont10 grdfontBold grdRowTextAligRight" >Mass Balance Account Operation Code</label></td>
				<td><input type="text" id="criteriastart_1" value="000" style="width:130px" class="grdfont grdfont10 grdRowTextAligCenter"/></td>
				<td style="width:30px"></td>
				<td><input type="text" id="criteriaend_1" value="999" style="width:130px" class="grdfont grdfont10 grdRowTextAligCenter"/></td>
				<td style="width:30px"></td>
			</tr>

			<tr>
				<td><label id="criteriatype_2" class="grdfont grdfont10 grdfontBold grdRowTextAligRight" >Mass Balance Account Type Code</label></td>
				<td><input type="text" id="criteriastart_2" value="00" style="width:130px" class="grdfont grdfont10 grdRowTextAligCenter"/></td>
				<td style="width:30px"></td>
				<td><input type="text" id="criteriaend_2" value="zz" style="width:130px" class="grdfont grdfont10 grdRowTextAligCenter"/></td>
				<td style="width:30px"></td>
			</tr>

			<tr>
				<td><label id="criteriatype_3" class="grdfont grdfont10 grdfontBold grdRowTextAligRight" >Mass Balance Account Code</label></td>
				<td><input type="text" id="criteriastart_3" value="0" style="width:130px" class="grdfont grdfont10 grdRowTextAligCenter"/></td>
				<td style="width:30px"></td>
				<td><input type="text" id="criteriaend_3" value="zzzzzzzz" style="width:130px" class="grdfont grdfont10 grdRowTextAligCenter"/></td>
				<td style="width:30px"></td>
			</tr>

			<tr>
				<td><label id="criteriatype_4" class="grdfont grdfont10 grdfontBold grdRowTextAligRight" >Dispatch Docket Operation Code</label></td>
				<td><input type="text" id="criteriastart_4" value="000" style="width:130px" class="grdfont grdfont10 grdRowTextAligCenter"/></td>
				<td style="width:30px"></td>
				<td><input type="text" id="criteriaend_4" value="999" style="width:130px" class="grdfont grdfont10 grdRowTextAligCenter"/></td>
				<td style="width:30px"></td>
			</tr>

			<tr>
				<td><label id="criteriatype_5" class="grdfont grdfont10 grdfontBold grdRowTextAligRight" >Dispatch Docket Docket Date</label></td>
				<td><input type="text" id="criteriastart_5" value="01/01/1900" style="width:130px" class="grdfont grdfont10 grdRowTextAligCenter" onblur="ValidateDate(this);"/></td>
				<td><input type="button" id="criteriastart_5_date" value="..." style="width:30px" class="grdfont grdfont10 grdRowTextAligCenter" onclick="CalendarShow(this);"/></td>
				<td><input type="text" id="criteriaend_5" value="31/12/2099" style="width:130px" class="grdfont grdfont10 grdRowTextAligCenter"  onblur="ValidateDate(this);"/></td>
				<td><input type="button" id="criteriaend_5_date" value="..." style="width:30px" class="grdfont grdfont10 grdRowTextAligCenter" onclick="CalendarShow(this);"/></td>
			</tr>

			<tr>
				<td><label id="criteriatype_6" class="grdfont grdfont10 grdfontBold grdRowTextAligRight" >Dispatch Docket Number</label></td>
				<td><input type="text" id="criteriastart_6" value="0" style="width:130px" class="grdfont grdfont10 grdRowTextAligCenter"/></td>
				<td style="width:30px"></td>
				<td><input type="text" id="criteriaend_6" value="zzzzzzzz" style="width:130px" class="grdfont grdfont10 grdRowTextAligCenter"/></td>
				<td style="width:30px"></td>
			</tr>

			<tr>
				<td><label id="criteriatype_7" class="grdfont grdfont10 grdfontBold grdRowTextAligRight" ></label><input type="hidden" id="rptdownloadname" value=""/></td>
				<td><input type="button" id="btnRunReport" value="Run Report" style="width:130px" class="grdfont grdfont10 grdRowTextAligCenter" onclick="RunReport();"/></td>
				<td style="width:30px"></td>
				<td><input type="button" id="btnDownloadRpt" value="Download Report" style="width:130px;" disabled="disabled" class="grdfont grdfont10 grdRowTextAligCenter" onclick="DownloadReport();"/></td>
				<td style="width:30px"></td>
			</tr>
		</table>
	</div>
	<div id="rptResultsContainer"  style="width: 1000px;height: 400px">
	</div>
</body>

	<div id="fade"></div>
	<div id="modal">
		<img id="loader" src="images/loading.gif" />
	</div>
<script>
var gsProjectId = "";

$(document).ready(PreparePage());
gsCurrentPage = "Mass Balance Reports";	

function  PreparePage()
{
	MBReportsLoad();
}

function Get_ReadOnly_Flag()
{
	return 0;	
}
</script>
</html>