/**
 * 
 */

var arrRptData = [];
var gsRptDataCols = [];
var gsReportTypeCols = [];
var gsDateField = "";

var ctlwidth = [];
ctlwidth[0] = 350;
ctlwidth[1] = 150;
ctlwidth[2] = 150;
ctlwidth[3] = 150;

var ctlwidth1 = [];
ctlwidth1[0] = 0; //This should never get used
ctlwidth1[1] = 80;
ctlwidth1[2] = 250;
ctlwidth1[3] = 120;
ctlwidth1[4] = 200;
ctlwidth1[5] = 100;
ctlwidth1[6] = 100;
ctlwidth1[7] = 100;

var ctlwidth2 = [];
ctlwidth2[0] = 0; //This should never get used
ctlwidth2[1] = 0; //This should never get used
ctlwidth2[2] = 0; //This should never get used
ctlwidth2[3] = 0; //This should never get used
ctlwidth2[4] = 80; //Date
ctlwidth2[5] = 90; //Number
ctlwidth2[6] = 200; //Description
ctlwidth2[7] = 70; //Mat Code
ctlwidth2[8] = 80; //Received
ctlwidth2[9] = 90; //Dispatched
ctlwidth2[10] = 110; //Offset Account
ctlwidth2[11] = 220; //Offset Account Description

var calobj2 = null; //For the calendar popup
var cal_format = '%d/%m/%Y';

function MBReportsLoad()
{
	PopulateReportTypes();
}

function RunReport()
{
    var url = GetWebServiceRoot() + "WbsMBReports";
    var sUser = GetUserId();
    var sSessionId = GetSessionId();
    var iReportType = GetObjectValue('cmbReportTypes');
    var iMBOperationCodeStart = GetObjectValue('criteriastart_1');
    var iMBOperationCodeEnd = GetObjectValue('criteriaend_1');
    var sMBAccountTypeCodeStart = GetObjectValue('criteriastart_2');
    var sMBAccountTypeCodeEnd = GetObjectValue('criteriaend_2');
    var sMBAccountCodeStart = GetObjectValue('criteriastart_3');
    var sMBAccountCodeEnd = GetObjectValue('criteriaend_3');
    var iDDOperationCodeStart = GetObjectValue('criteriastart_4');
    var iDDOperationCodeEnd = GetObjectValue('criteriaend_4');
    var sDDDateStart = GetObjectValue('criteriastart_5');
    var sDDDateEnd = GetObjectValue('criteriaend_5');
    var sDDNumberStart = GetObjectValue('criteriastart_6');
    var sDDNumberEnd = GetObjectValue('criteriaend_6');

    var parameters = new SOAPClientParameters();
	openModal();
	parameters.add("sSessionId",sSessionId);		        
	parameters.add("sUserId",sUser);		        
	parameters.add("iReport",iReportType);		        
	parameters.add("iMBOperationCodeStart",iMBOperationCodeStart);		        
	parameters.add("iMBOperationCodeEnd",iMBOperationCodeEnd);		        
	parameters.add("sMBAccountTypeCodeStart",sMBAccountTypeCodeStart);		        
	parameters.add("sMBAccountTypeCodeEnd",sMBAccountTypeCodeEnd);		        
	parameters.add("sMBAccountCodeStart",sMBAccountCodeStart);		        
	parameters.add("sMBAccountCodeEnd",sMBAccountCodeEnd);		        
	parameters.add("iDDOperationCodeStart",iDDOperationCodeStart);		        
	parameters.add("iDDOperationCodeEnd",iDDOperationCodeEnd);		        
	parameters.add("sDDDateStart",sDDDateStart);		        
	parameters.add("sDDDateEnd",sDDDateEnd);		        
	parameters.add("sDDNumberStart",sDDNumberStart);		        
	parameters.add("sDDNumberEnd",sDDNumberEnd);		        
	
	SetObjectValue('rptdownloadname', '');
	var btnDownload = document.getElementById('btnDownloadRpt');
	DisableControl(btnDownload,-1, -1);
	gsRptDataCols.length = 0;

	SOAPClient.invoke(url,"get_Report_pdf",parameters,true,GetReportPDFSuccess);
}

function GetReportPDFSuccess(result)
{
	if(result != null)
	{
		var sRptData =  result.gridstring;
	    var iRptRows =  result.gridrows;
	    var iRptCols = result.gridcols;
	    var sRptPDF = result.filename;
	    var iReportType = parseInt(result.reporttype,10);
	    arrRptData = ExtractReverseGrid(iRptRows, sRptData, gsRptDataCols,iRptCols);

		SetObjectValue('rptdownloadname', sRptPDF);
		var btnDownload = document.getElementById('btnDownloadRpt');
		DisableControl(btnDownload,0, -1);
		
		if(iReportType < 3)
			gsRptDataCols[gsRptDataCols.length] = "Nett";
		
		PopulateReportResults(arrRptData, gsRptDataCols, iReportType);
	}

	closeModal();
}

function DownloadReport()
{
	sFilename = GetObjectValue('rptdownloadname');
    if(sFilename.length > 0)
    {
        window.open(sFilename);
    }
    else
    {
        alert('There is no report generated to download'); 
    }

}

function PopulateReportResults(arrResults, arrHeader, iReport)
{
    var ni2 = document.getElementById('rptResultsContainer'); 
    ni2.className='grdDataDivBckGrdColor grdDataDivBorders';
    ni2.style.overflow='auto';

    //Clear the div
    var tableexists = document.getElementById('tableResultsHdr');
    if(tableexists != null)
	{
		ni2.removeChild(tableexists);
	}

/*    var tableexists = document.getElementById('tableResults');
    if(tableexists != null)
	{
		ni2.removeChild(tableexists);
	}
*/
    //First of all create the table
    resultstable = document.createElement("table");
    resultstable.setAttribute('cellSpacing','0');
    resultstable.setAttribute('cellpadding','5');
    resultstable.setAttribute('id', "tableResultsHdr");
    resultstablebody = document.createElement("tbody");
    resultstablebody.setAttribute('id', "tableResultsHdrBody");                        
    resultstable.className = "fixed"; 
//    resultstable.border = "1";
    
    switch(iReport)
    {
    	case 1:
    	default:
    		iStartCol = 0;
    		iColsLeft = 1;
    		iColsRight = 99; 
    		iEndCol = arrHeader.length;
    		break;
    	case  2:
    		iStartCol = 1;
    		iColsLeft = 5; //Add 1 because starting at index 1
    		iColsRight = 99; 
    		iEndCol = arrHeader.length;
    		break;
    	case  3:
    		iStartCol = 4;
    		iColsLeft = 7; //Add 4 because starting at index 4
    		iColsRight = 9; 
    		iEndCol = arrHeader.length - 1;
    		break;
    }
    var iTotalWidth = 0; 
	for(var i=iStartCol;i<iEndCol;i++)
	{
		coltag = document.createElement("col");
		switch(iReport)
		{
			case 1:
			default:
				SetObjectWidth(coltag, ctlwidth[i]);
				iTotalWidth += ctlwidth[i] + 5; //For the padding
				break;
			case 2:
				SetObjectWidth(coltag, ctlwidth1[i]);
				iTotalWidth += ctlwidth1[i] + 5; //For the padding
				break;
			case 3:
				SetObjectWidth(coltag, ctlwidth2[i]);
				iTotalWidth += ctlwidth2[i] + 5; //For the padding
				break;
		}
		resultstable.appendChild(coltag);
	}

	SetObjectWidth(ni2, iTotalWidth + 22); //Allow 32 for the scroll bar
	SetObjectWidth(resultstable, iTotalWidth);
	
    var rRow = document.createElement("tr");
    
	for(var i=iStartCol;i<iEndCol;i++)
	{
	    var cell = document.createElement("td");
	    if(i < iColsLeft || i > iColsRight)
	    	cell.className='grdfont grdfont10 grdfontBold grdHeaderTextAligLeft hdrTextColor regainClrDark';
	    else
	    	cell.className='grdfont grdfont10 grdfontBold grdHeaderTextAligRight hdrTextColor regainClrDark';
	    var label = CreateFormLabelField("resultHdrLbl"+i,arrHeader[i]);
	    switch(iReport)
	    {
	    	case 1:
	    	default:
	    	    SetObjectWidth(cell, ctlwidth[i]);
	    		SetObjectWidth(label, ctlwidth[i]);
	    		break;
	    	case 2:
	    	    SetObjectWidth(cell, ctlwidth1[i]);
	    		SetObjectWidth(label, ctlwidth1[i]);
	    		break;
	    	case 3:
	    	    SetObjectWidth(cell, ctlwidth2[i]);
	    		SetObjectWidth(label, ctlwidth2[i]);
	    		break;
	    }
	    cell.appendChild(label);
	    rRow.appendChild(cell);
	}

	//Create a blank cell for the scroll bar should it be required
    var cell = document.createElement("td");
   	cell.className='grdfont grdfont10 grdfontBold grdHeaderTextAligRight hdrTextColor regainClrDark';
    var label = CreateFormLabelField("resultHdrLblExtra",'');
    SetObjectWidth(cell, 30);
    SetObjectWidth(label, 30);
    cell.appendChild(label);
    rRow.appendChild(cell);
	
    resultstablebody.appendChild(rRow);
//    resultstable.appendChild(resultstablebody);
//    ni2.appendChild(resultstable);
    
/*    resultstable2 = document.createElement("table");
    resultstable2.setAttribute('cellSpacing','0');
    resultstable2.setAttribute('id', "tableResults");
    resultstablebody2 = document.createElement("tbody");
    resultstablebody2.setAttribute('id', "tableResultsBody");                        
    resultstable2.className = "fixed"; 
    resultstable2.border = "1";

	SetObjectWidth(resultstable2, iTotalWidth);
*/
    resultstable2 = resultstable;
    resultstablebody2 = resultstablebody;
    
    if(arrResults.length > 0)
    {
    	var dNettValue = 0.0;
    	var dReceivedValue = 0.0;
    	var dDispatchedValue = 0.0;
    	
    	var dSubNettValue = 0.0;
    	var dSubReceivedValue = 0.0;
    	var dSubDispatchedValue = 0.0;

    	switch(iReport)
    	{
    		case 1:
    		default:
    	    	for(var j=0;j<arrResults[0].length;j++)
    			{
    	    	    var rRow = document.createElement("tr");
    				for(var i=0;i<iEndCol;i++)
    				{
    				    var cell = document.createElement("td");
    				    if(i==0)
    				    	cell.className='grdfont grdfont10 grdHeaderTextAligLeft';
    				    else
    				    	cell.className='grdfont grdfont10 grdHeaderTextAligRight';
    				    
    				    if(i == arrHeader.length -1)
    				    {
    				    	var dValue = Round(parseFloat(arrResults[i-2][j]) - parseFloat(arrResults[i-1][j]), 2);	
    				    }
    				    else
    			    	{
    				    	if(i > 0)
    				    	{
    				    		var dValue = Round(arrResults[i][j],2);
    				    	}
    				    	else
    				    		var dValue = arrResults[i][j];
    			    	}

    		    		switch(i)
    		    		{
    			    		case 1:
    			    			dReceivedValue += parseFloat(dValue);
    			    			break;
    			    		case 2:
    			    			dDispatchedValue += parseFloat(dValue);
    			    			break;
    			    		case 3:
    			    			dNettValue += parseFloat(dValue);
    			    			break;
    		    		}

    		    		var label = CreateFormLabelField("resultLbl"+j + "_" + i , dValue);
    				    SetObjectWidth(cell, ctlwidth[i]);
    				    SetObjectWidth(label, ctlwidth[i]);
    				    cell.appendChild(label);
    				    rRow.appendChild(cell);
    				}
    		        resultstablebody2.appendChild(rRow);
    			}
    			break;
    		case 2:
    			var sPrevAccountType = '';
    	    	for(var j=0;j<arrResults[0].length;j++)
    			{
    	    		var sAccountType = arrResults[0][j]
    	    		//For each change in the account type add a row
    	    		if(sPrevAccountType != sAccountType)
    	    		{
    	    			if(sPrevAccountType != '')
	    				{
            	    	    var rRow = document.createElement("tr");
        				    var cell = document.createElement("td");
    				    	cell.className='grdfont grdfont10 grdHeaderTextAligLeft grdfontBold grdfontItalic PIMStask grdHeaderBottomBorders';
        		    		var label = CreateFormLabelField("resultGroupLblSubTotal_"+j , 'Totals for ' + sPrevAccountType);
        		    		cell.colSpan = 4;
        				    cell.appendChild(label);
        				    rRow.appendChild(cell);
        				    
        				    var cell = document.createElement("td");
        					cell.className='grdfont grdfont10 grdfontBold grdHeaderTextAligRight PIMStask grdHeaderBottomBorders';
        					var label = CreateFormLabelField("resultLblSubTotalRec" , Round(dSubReceivedValue,2));
        				    cell.appendChild(label);
        				    rRow.appendChild(cell);

        				    var cell = document.createElement("td");
        					cell.className='grdfont grdfont10 grdfontBold grdHeaderTextAligRight PIMStask grdHeaderBottomBorders';
        					var label = CreateFormLabelField("resultLblSubTotalDis" , Round(dSubDispatchedValue,2));
        				    cell.appendChild(label);
        				    rRow.appendChild(cell);

        				    var cell = document.createElement("td");
        					cell.className='grdfont grdfont10 grdfontBold grdHeaderTextAligRight PIMStask grdHeaderBottomBorders';
        					var label = CreateFormLabelField("resultLblSubTotalNett" , Round(dSubNettValue,2));
        				    cell.appendChild(label);
        				    rRow.appendChild(cell);

        				    resultstablebody2.appendChild(rRow);
        				    
        				    //Now reset the subtotals
        			    	var dSubNettValue = 0.0;
        			    	var dSubReceivedValue = 0.0;
        			    	var dSubDispatchedValue = 0.0;

	    				}
        	    	    var rRow = document.createElement("tr");
    				    var cell = document.createElement("td");
				    	cell.className='grdfont grdfont10 grdHeaderTextAligLeft grdfontBold grdfontItalic PIMStask';
    		    		var label = CreateFormLabelField("resultGroupLbl_"+j , sAccountType);
    				    SetObjectWidth(cell, ctlwidth1[1]);
    				    SetObjectWidth(label, ctlwidth1[1]);
    				    cell.appendChild(label);
    				    rRow.appendChild(cell);
    	    		
    		    		for(var k=1;k<6;k++)
    		    		{
    		    		    var cell = document.createElement("td");
    		    			cell.className='grdfont grdfont10 grdfontBold grdHeaderTextAligRight';
    		    			var label = CreateFormLabelField("resultGroupBlankLbl_" + k , '');
        				    SetObjectWidth(cell, ctlwidth1[k+1]);
        				    SetObjectWidth(label, ctlwidth1[k+1]);
    		    		    cell.appendChild(label);
    		    		    rRow.appendChild(cell);
    		    			
    		    		}
        		        resultstablebody2.appendChild(rRow);
    	    		}
    	    	    var rRow = document.createElement("tr");
    				for(var i=1;i<iEndCol;i++)
    				{
    				    var cell = document.createElement("td");
    				    if(i < 5)
    				    	cell.className='grdfont grdfont10 grdHeaderTextAligLeft';
    				    else
    				    	cell.className='grdfont grdfont10 grdHeaderTextAligRight';
    				    
    				    if(i == arrHeader.length -1)
    				    {
    				    	var dValue = Round(parseFloat(arrResults[i-2][j]) - parseFloat(arrResults[i-1][j]), 2);	
    				    }
    				    else
    			    	{
    				    	if(i > 4)
    				    	{
    				    		var dValue = Round(arrResults[i][j],2);
    				    	}
    				    	else
    				    		var dValue = arrResults[i][j];
    			    	}

    		    		switch(i)
    		    		{
    			    		case 5:
    			    			dReceivedValue += parseFloat(dValue);
    			    			dSubReceivedValue += parseFloat(dValue);
    			    			break;
    			    		case 6:
    			    			dDispatchedValue += parseFloat(dValue);
    			    			dSubDispatchedValue += parseFloat(dValue);
    			    			break;
    			    		case 7:
    			    			dNettValue += parseFloat(dValue);
    			    			dSubNettValue += parseFloat(dValue);
    			    			break;
    		    		}

    		    		var label = CreateFormLabelField("resultLbl"+j + "_" + i , dValue);
    				    SetObjectWidth(cell, ctlwidth1[i]);
    				    SetObjectWidth(label, ctlwidth1[i]);
    				    cell.appendChild(label);
    				    rRow.appendChild(cell);
    				}
    		        resultstablebody2.appendChild(rRow);
    		        sPrevAccountType = sAccountType;
    			}
    			break;
    		case 3:
    			var sPrevAccountNo = '';
    	    	for(var j=0;j<arrResults[0].length;j++)
    			{
    	    		var sAccountNo = arrResults[0][j]
    	    		//For each change in the account type add a row
    	    		if(sPrevAccountNo != sAccountNo)
    	    		{
    	    			if(sPrevAccountNo != '')
	    				{
            	    	    var rRow = document.createElement("tr");
        				    var cell = document.createElement("td");
    				    	cell.className='grdfont grdfont10 grdHeaderTextAligRight grdfontBold grdfontItalic PIMStask grdHeaderBottomBorders';
        		    		var label = CreateFormLabelField("resultGroupLblSubTotal_"+j , 'Totals for ' + sPrevAccountNo);
        		    		cell.colSpan = 4;
        				    cell.appendChild(label);
        				    rRow.appendChild(cell);
        				    
        				    var cell = document.createElement("td");
        					cell.className='grdfont grdfont10 grdfontBold grdHeaderTextAligRight PIMStask grdHeaderBottomBorders';
        					var label = CreateFormLabelField("resultLblSubTotalRec" , Round(dSubReceivedValue,2));
        				    cell.appendChild(label);
        				    rRow.appendChild(cell);

        				    var cell = document.createElement("td");
        					cell.className='grdfont grdfont10 grdfontBold grdHeaderTextAligRight PIMStask grdHeaderBottomBorders';
        					var label = CreateFormLabelField("resultLblSubTotalDis" , Round(dSubDispatchedValue,2));
        				    cell.appendChild(label);
        				    rRow.appendChild(cell);

        				    var cell = document.createElement("td");
        					cell.className='grdfont grdfont10 grdfontBold grdHeaderTextAligLeft PIMStask grdHeaderBottomBorders';
        					var label = CreateFormLabelField("resultLblSubTotalNett" , 'Nett ' + Round(dSubNettValue,2));
        		    		cell.colSpan = 3;
        				    cell.appendChild(label);
        				    rRow.appendChild(cell);

        				    resultstablebody2.appendChild(rRow);
        				    
        				    //Now reset the subtotals
        			    	var dSubNettValue = 0.0;
        			    	var dSubReceivedValue = 0.0;
        			    	var dSubDispatchedValue = 0.0;

	    				}
        	    	    var rRow = document.createElement("tr");
    				    var cell = document.createElement("td");
				    	cell.className='grdfont grdfont10 grdHeaderTextAligLeft grdfontBold grdfontItalic PIMStask';
    		    		var label = CreateFormLabelField("resultGroupLbl_"+j , arrResults[12][j]);
/*    				    SetObjectWidth(cell, ctlwidth1[1]);
    				    SetObjectWidth(label, ctlwidth1[1]);
*/    		    		cell.colSpan = 9;
    				    cell.appendChild(label);
    				    rRow.appendChild(cell);
    	    		
        		        resultstablebody2.appendChild(rRow);
    	    		}
    	    	    var rRow = document.createElement("tr");
    				for(var i=iStartCol;i<iEndCol;i++)
    				{
    				    var cell = document.createElement("td");
    				    if(i < iColsLeft || i > iColsRight)
    				    	cell.className='grdfont grdfont10 grdHeaderTextAligLeft';
    				    else
    				    	cell.className='grdfont grdfont10 grdHeaderTextAligRight';
    				    
    				    if(i == 9)
    				    {
    				    	var dThisNettValue = Round(parseFloat(arrResults[i][j]) - parseFloat(arrResults[i-1][j]), 2);	
				    		var dValue = Round(arrResults[i][j],2);
    				    }
    				    else
    			    	{
    				    	if(i == 8)
    				    	{
    				    		var dValue = Round(arrResults[i][j],2);
    				    	}
    				    	else
    				    		var dValue = arrResults[i][j];
    			    	}

    		    		switch(i)
    		    		{
    			    		case 8:
    			    			dReceivedValue += parseFloat(dValue);
    			    			dSubReceivedValue += parseFloat(dValue);
    			    			break;
    			    		case 9:
    			    			dDispatchedValue += parseFloat(dValue);
    			    			dSubDispatchedValue += parseFloat(dValue);
    			    			dNettValue += parseFloat(dThisNettValue);
    			    			dSubNettValue += parseFloat(dThisNettValue);
    			    			break;
    		    		}

    		    		var label = CreateFormLabelField("resultLbl"+j + "_" + i , dValue);
    				    SetObjectWidth(cell, ctlwidth2[i]);
    				    SetObjectWidth(label, ctlwidth2[i]);
    				    cell.appendChild(label);
    				    rRow.appendChild(cell);
    				}
    		        resultstablebody2.appendChild(rRow);
    		        sPrevAccountNo = sAccountNo;
    			}
    			break;
    	}
    }

    switch(iReport)
    {
    	case 2:
    	    var rRow = document.createElement("tr");
		    var cell = document.createElement("td");
	    	cell.className='grdfont grdfont10 grdHeaderTextAligLeft grdfontBold grdfontItalic PIMStask grdHeaderBottomBorders';
    		var label = CreateFormLabelField("resultGroupLblSubTotal_"+j , 'Totals for ' + sPrevAccountType);
    		cell.colSpan = 4;
		    cell.appendChild(label);
		    rRow.appendChild(cell);
		    
		    var cell = document.createElement("td");
			cell.className='grdfont grdfont10 grdfontBold grdHeaderTextAligRight PIMStask grdHeaderBottomBorders';
			var label = CreateFormLabelField("resultLblSubTotalRec" , Round(dSubReceivedValue,2));
		    cell.appendChild(label);
		    rRow.appendChild(cell);

		    var cell = document.createElement("td");
			cell.className='grdfont grdfont10 grdfontBold grdHeaderTextAligRight PIMStask grdHeaderBottomBorders';
			var label = CreateFormLabelField("resultLblSubTotalDis" , Round(dSubDispatchedValue,2));
		    cell.appendChild(label);
		    rRow.appendChild(cell);

		    var cell = document.createElement("td");
			cell.className='grdfont grdfont10 grdfontBold grdHeaderTextAligRight PIMStask grdHeaderBottomBorders';
			var label = CreateFormLabelField("resultLblSubTotalNett" , Round(dSubNettValue,2));
		    cell.appendChild(label);
		    rRow.appendChild(cell);

		    resultstablebody2.appendChild(rRow);
		    break;
    	case 3:
    	    var rRow = document.createElement("tr");
		    var cell = document.createElement("td");
	    	cell.className='grdfont grdfont10 grdHeaderTextAligRight grdfontBold grdfontItalic PIMStask grdHeaderBottomBorders';
    		var label = CreateFormLabelField("resultGroupLblSubTotal_"+j , 'Totals for ' + sPrevAccountNo);
    		cell.colSpan = 4;
		    cell.appendChild(label);
		    rRow.appendChild(cell);
		    
		    var cell = document.createElement("td");
			cell.className='grdfont grdfont10 grdfontBold grdHeaderTextAligRight PIMStask grdHeaderBottomBorders';
			var label = CreateFormLabelField("resultLblSubTotalRec" , Round(dSubReceivedValue,2));
		    cell.appendChild(label);
		    rRow.appendChild(cell);

		    var cell = document.createElement("td");
			cell.className='grdfont grdfont10 grdfontBold grdHeaderTextAligRight PIMStask grdHeaderBottomBorders';
			var label = CreateFormLabelField("resultLblSubTotalDis" , Round(dSubDispatchedValue,2));
		    cell.appendChild(label);
		    rRow.appendChild(cell);

		    var cell = document.createElement("td");
			cell.className='grdfont grdfont10 grdfontBold grdHeaderTextAligLeft PIMStask grdHeaderBottomBorders';
			var label = CreateFormLabelField("resultLblSubTotalNett" , 'Nett ' + Round(dSubNettValue,2));
    		cell.colSpan = 3;
		    cell.appendChild(label);
		    rRow.appendChild(cell);

		    resultstablebody2.appendChild(rRow);
		    break;

    }
    //Put a last row for the totals
    var rRow = document.createElement("tr");

    var cell = document.createElement("td");
	cell.className='grdfont grdfont10 grdfontBold grdHeaderTextAligLeft PIMSrisk';
	var label = CreateFormLabelField("resultLblTotalTitle" , "Total");
    cell.appendChild(label);
    rRow.appendChild(cell);

    //Put the appropriate blank columns in
    switch(iReport)
    {
    	case 1:
    	default:
    		break;
    	case 2:
    		for(var k=0;k<3;k++)
    		{
    		    var cell = document.createElement("td");
    			cell.className='grdfont grdfont10 grdfontBold grdHeaderTextAligRight';
    			var label = CreateFormLabelField("resultLblTotal_" + k , '');
    		    cell.appendChild(label);
    		    rRow.appendChild(cell);
    			
    		}
    		break;
    	case 3:
    		for(var k=0;k<3;k++)
    		{
    		    var cell = document.createElement("td");
    			cell.className='grdfont grdfont10 grdfontBold grdHeaderTextAligRight';
    			var label = CreateFormLabelField("resultLblTotal_" + k , '');
    		    cell.appendChild(label);
    		    rRow.appendChild(cell);
    			
    		}
    		break;
    }
    
    var cell = document.createElement("td");
	cell.className='grdfont grdfont10 grdfontBold grdHeaderTextAligRight PIMSrisk';
	var label = CreateFormLabelField("resultLblTotalRec" , Round(dReceivedValue,2));
    cell.appendChild(label);
    rRow.appendChild(cell);

    var cell = document.createElement("td");
	cell.className='grdfont grdfont10 grdfontBold grdHeaderTextAligRight PIMSrisk';
	var label = CreateFormLabelField("resultLblTotalDis" , Round(dDispatchedValue,2));
    cell.appendChild(label);
    rRow.appendChild(cell);

    var cell = document.createElement("td");
	if(iReport == 3)
	{
		cell.className='grdfont grdfont10 grdfontBold grdHeaderTextAligLeft PIMSrisk';
		var label = CreateFormLabelField("resultLblTotalNett" , 'Nett ' + Round(dNettValue,2));
	}
	else
	{
		cell.className='grdfont grdfont10 grdfontBold grdHeaderTextAligRight PIMSrisk';
		var label = CreateFormLabelField("resultLblTotalNett" , Round(dNettValue,2));
	}
    cell.appendChild(label);
    rRow.appendChild(cell);

    resultstablebody2.appendChild(rRow);

    resultstable2.appendChild(resultstablebody2);
    ni2.appendChild(resultstable2);
}


function PopulateReportTypes()
{
    var url = GetWebServiceRoot() + "WbsMBReports";
    var sUser = GetUserId();
    var sSessionId = GetSessionId();

    var parameters = new SOAPClientParameters();
	openModal();
	parameters.add("sSessionId",sSessionId);		        
	parameters.add("sUserId",sUser);		        
    SOAPClient.invoke(url,"getReportTypes",parameters,true,PopulateReportTypesSucc);
}

function PopulateReportTypesSucc(result)
{
	if(result != null)
	{
		if(result != "")
		{
		    var sReportTypes =  result.gridstring;
		    var iReportTypeRows =  result.gridrows;
		    var iReportTypeCols = result.gridcols;
		    ReportTypes = ExtractReverseGrid(iReportTypeRows, sReportTypes, gsReportTypeCols,iReportTypeCols);
		    cmbbox = document.getElementById('cmbReportTypes');
		    for (var x = 0; x < ReportTypes[0].length; x++)
		    {
		        CreateDropDownBoxOption(cmbbox,x, ReportTypes[1][x], ReportTypes[1][x],ReportTypes[0][x]);
		    }

	
		}
	}
	closeModal();
}

/****************************************************************************************/
/**			CALENDAR STUFF																*/
/****************************************************************************************/
//show calendar
function CalendarShow(sender) 
{
	if (calobj2) return;
	
	var sField = sender.id;
	sField = replaceAll(sField, "_date", "");
	gsDateField = sField;
    var text_field = document.getElementById(sField);;

	cal_obj2 = new RichCalendar();
	cal_obj2.start_week_day = 0;
	cal_obj2.show_time = false;
	cal_obj2.user_onchange_handler = CalendarChange;
	cal_obj2.user_onautoclose_handler = CalendarAutoClose;
	cal_obj2.parse_date(text_field.value, cal_format);
	cal_obj2.show_at_element(text_field, "right-bottom");
}

function CalendarAutoClose()
{
    calobj2 = null;
}


function CalendarChange(cal, object_code) 
{
	if (object_code == 'day') 
	{
	    var iRow = cal.rowid;
	    var iCol = cal.colid;
	    var datefield = document.getElementById(gsDateField);
		SetObjectValue(datefield.id,cal.get_formatted_date(cal_format)); //datefield.value = cal.get_formatted_date(cal_format);
		cal.hide();
		cal_obj2 = null;
//		SaveTrackerDateDataJS(datefield);
	}
}

