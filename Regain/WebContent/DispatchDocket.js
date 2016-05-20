/**
 * 
 */

var ctlwidth = [];
	ctlwidth[0] = 150;
	ctlwidth[1] = 100;
	ctlwidth[2] = 80;
	ctlwidth[3] = 80;
	ctlwidth[4] = 80;

var ctlwidth2 = [];
	ctlwidth2[0] = 150;
	ctlwidth2[1] = 100;
	ctlwidth2[2] = 50;
	ctlwidth2[3] = 90;
	ctlwidth2[4] = 100;
	ctlwidth2[5] = 200;
	ctlwidth2[6] = 80;
	ctlwidth2[7] = 200;
	
var ctlwidth3 = [];
	ctlwidth3[0] = 60;
	ctlwidth3[1] = 200;
	ctlwidth3[2] = 100;
	ctlwidth3[3] = 280;
	ctlwidth3[4] = 70;
	ctlwidth3[5] = 400;
	ctlwidth3[6] = 400;
//	ctlwidth3[7] = 200;

var ctlhdr3 = [];
	ctlhdr3[0] = "Item No";
	ctlhdr3[1] = "Description";
	ctlhdr3[2] = "Material Code";
	ctlhdr3[3] = "Material Description";
	ctlhdr3[4] = "Quantity";
	ctlhdr3[5] = "From Mass Balance Account";
	ctlhdr3[6] = "To Mass Balance Account";
//	ctlhdr3[7] = "Narrative";

var ctlwidth4 = [];
	ctlwidth4[0] = 80;
	ctlwidth4[1] = 30;
	ctlwidth4[2] = 270;

var gDDReturn;
var gbNewDD;
var gsOperationCols = [];
var gsClientCodeCols = [];
var gsTransCols = [];
var gsMatCodeCols = [];
var gsMBAcctsCols = [];
var arrOperations = [];
var arrClientCodes = [];
var arrTransactions = [];
var arrMatCodes = [];
var arrMBAccts = [];

//Popup for mass balance accounts
var gdivPopup;
	
function GetDropdownCodes()
{
    var url = GetWebServiceRoot() + "WbsDispatchDocket";
    var sUser = GetUserId();
    var sSessionId = GetSessionId();

    var parameters = new SOAPClientParameters();
	openModal();
	parameters.add("sSessionId",sSessionId);		        
	parameters.add("sUserId",sUser);		        
    SOAPClient.invoke(url,"getExistingCodes",parameters,true,CodesDropdown_Populate);
}

function CodesDropdown_Populate(result)
{
	if(result != null)
	{
		if(result != "")
		{
			if(result[0] != null)
			{
			    var sOperations =  result[0].gridstring;
			    var iOperationRows =  result[0].gridrows;
			    var iOperationCols = result[0].gridcols;
			    arrOperations = ExtractReverseGrid(iOperationRows, sOperations, gsOperationCols,iOperationCols);
			}

			if(result[1] != null)
			{
			    var sClientCodes =  result[1].gridstring;
			    var iClientCodeRows =  result[1].gridrows;
			    var iClientCodeCols = result[1].gridcols;
			    arrClientCodes = ExtractReverseGrid(iClientCodeRows, sClientCodes, gsClientCodeCols,iClientCodeCols);
			}
			
			if(result[2] != null)
			{
			    var sMatCodes =  result[2].gridstring;
			    var iMatCodeRows =  result[2].gridrows;
			    var iMatCodeCols = result[2].gridcols;
			    arrMatCodes = ExtractReverseGrid(iMatCodeRows, sMatCodes, gsMatCodeCols, iMatCodeCols);
			}
		}
	}
	DispatchDocketLoad();	
	closeModal();
}

function DispatchDocketLoad()
{
	var iReadOnly = Get_ReadOnly_Flag();
	
	//Build in the retrieval or new dispatch docket area
	var ni2 = document.getElementById('divDDContainer'); 
    ni2.className='bgOffWhite grdDataDivBorders';
    ni2.style.overflow='auto';

    //First of all create the table
    retrievetable = document.createElement("table");
    retrievetable.setAttribute('cellSpacing','0');
    retrievetable.setAttribute('cellpadding','5');
    retrievetable.setAttribute('id', "tableDDRetrieve");
    retrievetablebody = document.createElement("tbody");
    retrievetablebody.setAttribute('id', "tableDDRetrieveBody");                        
    retrievetable.className = "fixed"; 
//    retrievetable.border = "1";
    
    var iTotalWidth = 0; 
	for(var i=0;i<ctlwidth.length;i++)
	{
		iTotalWidth += ctlwidth[i] + 5; //For the padding
	}

	SetObjectWidth(ni2, iTotalWidth + 22); //Allow 32 for the scroll bar
	SetObjectWidth(retrievetable, iTotalWidth);

    var rRow = document.createElement("tr");
    rRow.className = 'regainClrDark'
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft fontWhite';
    var label = CreateFormLabelField("DDNoLbl",'Dispatch Docket No');
    SetObjectWidth(cell, ctlwidth[0]);
    cell.appendChild(label);
    rRow.appendChild(cell);

    cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdRowTextAligLeft';
    var txtbox = CreateFormTextField("DDNo",'', iReadOnly);
    SetObjectWidth(txtbox, ctlwidth[1]- 8);
    if(iReadOnly == -1)
    {
        txtbox.className ='txtReadonly grdfont grdfont10';    
    }
    else
    {
        txtbox.className ='grdfont grdfont10';    
    }
    SetObjectWidth(cell, ctlwidth[1]);
    cell.appendChild(txtbox);
    rRow.appendChild(cell);

    cell = document.createElement("td");
    var btnRetrieve = CreateFormButtonField("btnDDRetrieve","Retrieve", iReadOnly);
    SetObjectWidth(btnRetrieve, ctlwidth[2]-10);
    btnRetrieve.onclick = function(){RetrieveDDCheck(false);};
    btnRetrieve.className='grdfont grdfont10 grdRowTextAligCenter';    
    cell.appendChild(btnRetrieve);
    cell.align = "center";  
    rRow.appendChild(cell);

    cell = document.createElement("td");
    var btnAddNew = CreateFormButtonField("btnDDNew","New", iReadOnly);
    SetObjectWidth(btnAddNew, ctlwidth[3]-10);
    btnAddNew.onclick = function(){RetrieveDDCheck(true);};
    btnAddNew.className='grdfont grdfont10 grdRowTextAligCenter';    
    cell.appendChild(btnAddNew);
    cell.align = "center";  
    rRow.appendChild(cell);

    cell = document.createElement("td");
    var btnSave = CreateFormButtonField("btnDDSave","Save", iReadOnly);
    SetObjectWidth(btnSave, ctlwidth[4]-10);
    btnSave.onclick = function(){SaveDD(false);};
    btnSave.className='grdfont grdfont10 grdRowTextAligCenter';    
    cell.appendChild(btnSave);
    cell.align = "center";  
    rRow.appendChild(cell);

    retrievetablebody.appendChild(rRow);

    retrievetable.appendChild(retrievetablebody);
    ni2.appendChild(retrievetable);

}

function RetrieveDDCheck(bNewDD)
{
	var iStatus = GetEditStatus();
	if(iStatus == -1)
	{
		gbNewDD = bNewDD;
		PIMS_confirm(2,'You have unsaved changes. Do you wish to retrieve another dispatch docket and lose those changes?','RetrieveDDYes','RetrieveDDNo','','RetrieveDDNo');		
	}
	else
	{
		RetrieveDD(bNewDD);
	}
}

function RetrieveDDYes()
{
	SetEditStatus(0);
	RetrieveDD(gbNewDD);
}

function RetrieveDD(bNewDD)
{
    var sDDNo = GetObjectValue('DDNo');
    
    if(sDDNo == '')
    {
    	alert('You must provide a dispatch docket number in order to retrieve the details');
    	return;
    }
    
	//Build in the retrieval or new dispatch docket area
	var ni2 = document.getElementById('divDDContainer'); 
    ni2.className='bgOffWhite grdDataDivBorders';
    ni2.style.overflow='auto';

    //Clear the div
    var tableexists = document.getElementById('tableDDDetails');
    if(tableexists != null)
	{
		ni2.removeChild(tableexists);
	}

    var url = GetWebServiceRoot() + "WbsDispatchDocket";
    var sUser = GetUserId();
    var sSessionId = GetSessionId();

    var parameters = new SOAPClientParameters();
	openModal();
	parameters.add("sSessionId",sSessionId);		        
	parameters.add("sUserId",sUser);		        
	parameters.add("sDDNo",sDDNo);		        
	parameters.add("bNewDD",bNewDD);		        
    SOAPClient.invoke(url,"getDispatchDocketDetails",parameters,true,RetrieveDDSucc);
}

function RetrieveDDSucc(results)
{
	var DDReturn = ExtractNamedPairsClass(results);
	if(!stringToBoolean(DDReturn.New) && DDReturn.DDNo == '')
	{
	    var sDDNo = GetObjectValue('DDNo');
	    alert('Dispatch docket ' + sDDNo + ' does not exist. Either create a new dispatch docket or retrieve a different number.');
	}
	else
	{
		if(stringToBoolean(DDReturn.New) && DDReturn.DDNo != '')
		{
		    var sDDNo = GetObjectValue('DDNo');
		    gDDReturn = DDReturn;
			PIMS_confirm(2,'Dispatch docket ' + sDDNo + ' already exists. Do you wish to retrieve that docket?','BuildDispatchDocketDetailsYes','BuildDispatchDocketDetailsNo','','BuildDispatchDocketDetailsNo');
		}
		else
		{
			if(!stringToBoolean(DDReturn.Status))
				alert(DDReturn.ErrorMsg);
			else
			{
				gDDReturn = DDReturn;
				GetMaterialTransactions();
			}
		}		
	}
	
	closeModal();
}

function BuildDispatchDocketDetails(objDDDetails)
{
	var iReadOnly = Get_ReadOnly_Flag();
	var bNew = stringToBoolean(objDDDetails.New);
	if(bNew)
	{
		SetEditStatus(-1);
	}

	//Build in the retrieval or new dispatch docket area
	var ni2 = document.getElementById('divDDContainer'); 
    ni2.className='bgOffWhite grdDataDivBorders';
    ni2.style.overflow='auto';

    //Clear the div
    var tableexists = document.getElementById('tableDDDetails');
    if(tableexists != null)
	{
		ni2.removeChild(tableexists);
	}
    
    //First of all create the table
    detailstable = document.createElement("table");
    detailstable.setAttribute('cellSpacing','0');
    detailstable.setAttribute('cellpadding','3');
    detailstable.setAttribute('id', "tableDDDetails");
    detailstablebody = document.createElement("tbody");
    detailstablebody.setAttribute('id', "tableDDDetailsBody");                        
    detailstable.className = "fixed"; 
//    detailstable.border = "1";
    
    var iTotalWidth = 0; 
	for(var i=0;i<ctlwidth2.length;i++)
	{
		iTotalWidth += ctlwidth2[i] + 5; //For the padding
	}

	SetObjectWidth(ni2, iTotalWidth + 42); //Allow a bunch for the scroll bar
	SetObjectWidth(detailstable, iTotalWidth);
	
    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft';
    var label = CreateFormLabelField("DDNoLblBodyLbl", "Dispatch Docket No");
    SetObjectWidth(cell, ctlwidth2[0]);
    cell.appendChild(label);
    rRow.appendChild(cell);

    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft';
    var label = CreateFormLabelField("DDNoLblBody", objDDDetails.DDNo);
    SetObjectWidth(cell, ctlwidth2[1]);
    cell.appendChild(label);
    rRow.appendChild(cell);

    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft';
    var label = CreateFormLabelField("DDDateLbl", "Date");
    SetObjectWidth(cell, ctlwidth2[2]);
    cell.appendChild(label);
    rRow.appendChild(cell);

    cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdRowTextAligLeft';
    var txtbox = CreateFormTextField("DDDate", objDDDetails.DDDate, iReadOnly);
    SetObjectWidth(txtbox, ctlwidth2[3]- 8);
    if(iReadOnly == -1)
    {
        txtbox.className ='txtReadonly grdfont grdfont10';    
    }
    else
    {
        txtbox.className ='grdfont grdfont10';    
    }
    txtbox.onblur = function(){DDDateChange(this);};
    SetObjectWidth(cell, ctlwidth2[3]);
    cell.appendChild(txtbox);
    rRow.appendChild(cell);

    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft';
    var label = CreateFormLabelField("DDOperationCodeLbl", "Operation Code");
    SetObjectWidth(cell, ctlwidth2[4]);
    cell.appendChild(label);
    rRow.appendChild(cell);

    cell = document.createElement("td");
    var cmbbox = CreateFormDropDownBox("DDOperationCode", iReadOnly);
    SetObjectWidth(cmbbox, ctlwidth2[5]-8);
    SetObjectWidth(cell, ctlwidth2[5]);
    cmbbox.className='grdfont grdfont10';
    cmbbox.onchange = function(){SetEditStatus(-1);};
        
    CreateDropDownBoxOption(cmbbox,0,'[select]','[select]',-2);
    var iSelectedIndex = -1;
    for (var x = 0; x < arrOperations[0].length; x++)
    {
        CreateDropDownBoxOption(cmbbox,x+1,arrOperations[0][x] + '-' + arrOperations[1][x],arrOperations[0][x] + '-' + arrOperations[1][x],arrOperations[0][x]);
        if(arrOperations[0][x] == objDDDetails.OperationCode)
    	{
        	iSelectedIndex = x+1;
    	}
    }
    cmbbox.selectedIndex = iSelectedIndex;
    cell.appendChild(cmbbox);
    rRow.appendChild(cell);
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft';
    var label = CreateFormLabelField("DDClientCodeLbl", "Client Code");
    SetObjectWidth(cell, ctlwidth2[6]);
    cell.appendChild(label);
    rRow.appendChild(cell);

    cell = document.createElement("td");
    var cmbbox = CreateFormDropDownBox("DDClientCode", iReadOnly);
    SetObjectWidth(cmbbox, ctlwidth2[7]-12);
    SetObjectWidth(cell, ctlwidth2[7]);
    cmbbox.className='grdfont grdfont10';
    cmbbox.onchange = function(){SetEditStatus(-1);};
        
    CreateDropDownBoxOption(cmbbox,0,'[select]','[select]',-2);
    var iSelectedIndex = -1;
    for (var x = 0; x < arrClientCodes[0].length; x++)
    {
        CreateDropDownBoxOption(cmbbox,x+1,arrClientCodes[0][x] + '-' + arrClientCodes[1][x],arrClientCodes[0][x] + '-' + arrClientCodes[1][x],arrClientCodes[0][x]);
        if(arrClientCodes[0][x] == objDDDetails.ClientCode)
    	{
        	iSelectedIndex = x+1;
    	}
    }
    cmbbox.selectedIndex = iSelectedIndex;

    cell.appendChild(cmbbox);
    rRow.appendChild(cell);

    cell = document.createElement("td");
    var btnAdd = CreateFormButtonField("btnMTAdd","Add New Transaction", iReadOnly);
    SetObjectWidth(btnAdd, ctlwidth[4]-10);
    btnAdd.onclick = function(){BuildNewTransactionRow();};
    btnAdd.className='grdfont grdfont10 grdRowTextAligCenter';    
    cell.appendChild(btnAdd);
    cell.align = "center";  
    rRow.appendChild(cell);

    
    detailstablebody.appendChild(rRow);

    detailstable.appendChild(detailstablebody);
    ni2.appendChild(detailstable);
}


//Simply do nothing on a no or cancel
function BuildDispatchDocketDetailsNo()
{
}

function BuildDispatchDocketDetailsYes()
{
	gDDReturn.New = "false";
	GetMaterialTransactions();
}

function GetMaterialTransactions()
{
	//Get the transaction details	
    var url = GetWebServiceRoot() + "WbsDispatchDocket";
    var sUser = GetUserId();
    var sSessionId = GetSessionId();
    var sDDNo = GetObjectValue('DDNo');

    var parameters = new SOAPClientParameters();
	openModal();
	parameters.add("sSessionId",sSessionId);		        
	parameters.add("sUserId",sUser);		        
	parameters.add("sDDNo",sDDNo);		        
    SOAPClient.invoke(url,"getMaterialTransactions",parameters,true,RetrieveMTSucc);
}

function RetrieveMTSucc(results)
{
	var bStatus = stringToBoolean(results.status);
	
	if(!bStatus)
	{
		alert(results.gridstring);
	}
	else
	{
	    var sTransactions =  results.gridstring;
	    var iTransRows =  results.gridrows;
	    var iTransCols = results.gridcols;
	    arrTransactions = ExtractReverseGrid(iTransRows, sTransactions, gsTransCols,iTransCols);
		BuildDispatchDocketDetails(gDDReturn);		
		BuildMaterialTransactionDetails(arrTransactions);		
	}
	closeModal();
}

function BuildMaterialTransactionDetails(arrTrans)
{
	var iReadOnly = Get_ReadOnly_Flag();

	//Build in the retrieval or new dispatch docket area
	var ni2 = document.getElementById('divDDContainer'); 
    ni2.className='bgOffWhite grdDataDivBorders';
    ni2.style.overflow='auto';

    //Clear the div
    var tableexists = document.getElementById('tableMTDetails');
    if(tableexists != null)
	{
		ni2.removeChild(tableexists);
	}
    
    //First of all create the table
    detailstable = document.createElement("table");
    detailstable.setAttribute('cellSpacing','0');
    detailstable.setAttribute('cellpadding','3');
    detailstable.setAttribute('id', "tableMTDetails");
    detailstablebody = document.createElement("tbody");
    detailstablebody.setAttribute('id', "tableMTDetailsBody");                        
    detailstable.className = "fixed"; 
//    detailstable.border = "1";
    
    var iTotalWidth = 0; 
	for(var i=0;i<ctlwidth3.length;i++)
	{
		iTotalWidth += ctlwidth3[i] + 5; //For the padding
	}

	SetObjectWidth(ni2, iTotalWidth + 42); //Allow a bunch for the scroll bar
	SetObjectWidth(detailstable, iTotalWidth);
	
	//Put in the header
    var rRow = document.createElement("tr");
    rRow.className = 'regainClrDark'
	for(var i=0;i<ctlwidth3.length;i++)
	{
	    var cell = document.createElement("td");
	    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft fontWhite';
	    var label = CreateFormLabelField("MTHdrLbl_"+i, ctlhdr3[i]);
	    SetObjectWidth(cell, ctlwidth3[i]);
	    cell.appendChild(label);
	    rRow.appendChild(cell);		
	}
    
    detailstablebody.appendChild(rRow);

    if(arrTrans[0].length % 2 == 0)
	{
    	var k=0;
        for(var i=0;i<arrTrans[0].length;i+=2)
       	{
        	//This means the 2 transaction Ids are the same and they are linking the 'To' and 'From' side
        	if(arrTrans[1][i] == arrTrans[1][i+1] && arrTrans[7][i] == 'From' && arrTrans[7][i+1] == 'To')
    		{
            	var rRow = BuildTransactionRow(false, i/2, arrTrans[1][i], arrTrans[4][i], arrTrans[9][i], arrTrans[10][i], arrTrans[8][i], arrTrans[5][i],arrTrans[6][i], arrTrans[5][i+1],arrTrans[6][i+1]);		
    		}
    	    
        	if(k%2 == 0)
    		{
        		rRow.className = 'grdDataDivBckGrdColor';
    		}
        	else
    		{
        		rRow.className = 'grdRowAlterColor1';    		
    		}
        	rRow.setAttribute('id', "tableMTRow_"+k);
    	    detailstablebody.appendChild(rRow);
    	    k++;
       	}	
	}
    else
	{
    	alert("There is an uneven amount of transactions. Therefore the 'From' and 'To' Mass Balance accounts cannot be determined. This is a data issue.");
	}

    detailstable.appendChild(detailstablebody);
    ni2.appendChild(detailstable);
}

function BuildNewTransactionRow()
{
	var table = document.getElementById('tableMTDetailsBody');
	
	var iNewRowId = table.rows.length + 1;
	row = BuildTransactionRow(true, iNewRowId, -1, '', '', '', 0, '', '', '', '');
	if(i%2 == 0)
	{
		row.className = 'grdDataDivBckGrdColor';
	}
	else
	{
		row.className = 'grdRowAlterColor1';    		
	}
	row.setAttribute('id', "tableMTRow_"+iNewRowId);
	table.appendChild(row);
	SetTransactionChanged(row, -1);
}

function BuildTransactionRow(bNew, i, sMTTransId, sMTDescription, sMatCode, sMatCodeDesc, dQty, sMBAcctFromNo, sMBAcctFromDesc, sMBAcctToNo, sMBAcctToDesc)
{
	var iReadOnly = Get_ReadOnly_Flag();

	var rRow = document.createElement("tr");
    rRow.setAttribute('id', "MTGridRow_"+i);
	
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdRowTextAligLeft';
    var label = CreateFormLabelField("MTItemNo_"+i, i+1);
    SetObjectWidth(cell, ctlwidth3[0]);
    cell.appendChild(label);
    var hiddenrowstatus = CreateFormHiddenField("hfMTRowStatus_"+i,0);
    cell.appendChild(hiddenrowstatus);
    var hiddenrowstatus = CreateFormHiddenField("hfMTTransId_"+i, sMTTransId);
    cell.appendChild(hiddenrowstatus);
    rRow.appendChild(cell);

    cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdRowTextAligLeft';
    var txtbox = CreateFormTextField("MTDescription_"+i, sMTDescription, iReadOnly);
    SetObjectWidth(txtbox, ctlwidth3[1]- 8);
    if(iReadOnly == -1)
    {
        txtbox.className ='txtReadonly grdfont grdfont10';    
    }
    else
    {
        txtbox.className ='grdfont grdfont10';    
    }
    txtbox.onchange = function(){SetTransactionChanged(this, -1);};
    SetObjectWidth(cell, ctlwidth3[1]);
    cell.appendChild(txtbox);
    rRow.appendChild(cell);

    cell = document.createElement("td");
    var cmbbox = CreateFormDropDownBox("MTMatCode_"+i, iReadOnly);
    SetObjectWidth(cmbbox, ctlwidth3[2]-8);
    SetObjectWidth(cell, ctlwidth3[2]);
    cmbbox.className='grdfont grdfont10';
    cmbbox.onchange = function(){MTMatCodeChanged(this);};
        
    CreateDropDownBoxOption(cmbbox,0,'[select]','[select]',-2);
    var iSelectedIndex = -1;
    for (var x = 0; x < arrMatCodes[0].length; x++)
    {
        CreateDropDownBoxOption(cmbbox,x+1,arrMatCodes[0][x] ,arrMatCodes[0][x] + '-' + arrMatCodes[1][x],arrMatCodes[0][x]);
        if(arrMatCodes[0][x] == sMatCode)
    	{
        	iSelectedIndex = x+1;
    	}
    }
    cmbbox.selectedIndex = iSelectedIndex;
    cell.appendChild(cmbbox);
    rRow.appendChild(cell);
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdRowTextAligLeft';
    var label = CreateFormLabelField("MTMatCodeDesc_"+i, sMatCodeDesc);
    SetObjectWidth(cell, ctlwidth3[3]);
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdRowTextAligLeft';
    var txtbox = CreateFormTextField("MTQty_"+i, Round(dQty,2), iReadOnly);
    SetObjectWidth(txtbox, ctlwidth3[4]- 8);
    if(iReadOnly == -1)
    {
        txtbox.className ='txtReadonly grdfont grdfont10';    
    }
    else
    {
        txtbox.className ='grdfont grdfont10';    
    }
    txtbox.onchange = function(){SetTransactionChanged(this, -1);};
    SetObjectWidth(cell, ctlwidth3[4]);
    cell.appendChild(txtbox);
    rRow.appendChild(cell);

    var cell = document.createElement("td");
		fromtable = document.createElement("table");
		fromtable.setAttribute('cellSpacing','0');
		fromtable.setAttribute('cellpadding','3');
		fromtable.setAttribute('id', "tableMTfrom");
		fromtablebody = document.createElement("tbody");
		fromtablebody.setAttribute('id', "tableMTfromBody");                        
		fromtable.className = "fixed"; 
//		fromtable.border = "1";
	    SetObjectWidth(fromtable, ctlwidth3[5]);
		var rRow2 = document.createElement("tr");

		var cell2 = document.createElement("td");
	    cell2.className='grdfont grdfont10 grdRowTextAligLeft';
	    var label = CreateFormLabelField("MTFromAcctNo_"+i, sMBAcctFromNo);
	    SetObjectWidth(cell2, ctlwidth4[0]);
	    cell2.appendChild(label);
	    rRow2.appendChild(cell2);

	    cell2 = document.createElement("td");
	    var btnRetrieve = CreateFormButtonField("btnMTFromAcct"+i,"...", iReadOnly);
	    SetObjectWidth(btnRetrieve, ctlwidth4[1]-5);
	    btnRetrieve.onclick = function(){OpenMBAccountPopup(this, 1);};
	    btnRetrieve.className='grdfont grdfont10 grdRowTextAligCenter';    
	    cell2.appendChild(btnRetrieve);
	    cell2.align = "center";  
	    rRow2.appendChild(cell2);
	    
		var cell2 = document.createElement("td");
	    cell2.className='grdfont grdfont10 grdRowTextAligLeft';
	    var label = CreateFormLabelField("MTFromAcctDesc_"+i, sMBAcctFromDesc);
	    SetObjectWidth(cell2, ctlwidth4[2]);
	    cell2.appendChild(label);
	    rRow2.appendChild(cell2);

	    fromtablebody.appendChild(rRow2);
	    fromtable.appendChild(fromtablebody);
	cell.appendChild(fromtable);
    rRow.appendChild(cell);

    var cell = document.createElement("td");
		totable = document.createElement("table");
		totable.setAttribute('cellSpacing','0');
		totable.setAttribute('cellpadding','3');
		totable.setAttribute('id', "tableMTto");
		totablebody = document.createElement("tbody");
		totablebody.setAttribute('id', "tableMTtoBody");                        
		totable.className = "fixed"; 
//		totable.border = "1";
	    SetObjectWidth(totable, ctlwidth3[6]);
		var rRow2 = document.createElement("tr");
	
		var cell2 = document.createElement("td");
	    cell2.className='grdfont grdfont10 grdRowTextAligLeft';
	    var label = CreateFormLabelField("MTToAcctNo_"+i, sMBAcctToNo);
	    SetObjectWidth(cell2, ctlwidth4[0]);
	    cell2.appendChild(label);
	    rRow2.appendChild(cell2);
	
	    cell2 = document.createElement("td");
	    var btnRetrieve = CreateFormButtonField("btnMTtoAcct"+i,"...", iReadOnly);
	    SetObjectWidth(btnRetrieve, ctlwidth4[1]-5);
	    btnRetrieve.onclick = function(){OpenMBAccountPopup(this, 2);};
	    btnRetrieve.className='grdfont grdfont10 grdRowTextAligCenter';    
	    cell2.appendChild(btnRetrieve);
	    cell2.align = "center";  
	    rRow2.appendChild(cell2);
	    
		var cell2 = document.createElement("td");
	    cell2.className='grdfont grdfont10 grdRowTextAligLeft';
	    var label = CreateFormLabelField("MTToAcctDesc_"+i, sMBAcctToDesc);
	    SetObjectWidth(cell2, ctlwidth4[2]);
	    cell2.appendChild(label);
	    rRow2.appendChild(cell2);
	
	    totablebody.appendChild(rRow2);
	    totable.appendChild(totablebody);
	cell.appendChild(totable);
	rRow.appendChild(cell);

	return rRow;
}

function DDDateChange(sender)
{
	if(ValidateDate(sender))
	{
		SetEditStatus(-1);
	}
	
}

function MTMatCodeChanged(sender)
{
	//Change the Mat Code Desription Label
	var iSelectedIndex = sender.selectedIndex;
    var iRow = Get_RowNo_From_ControlName(sender.id);
	
	SetObjectValue('MTMatCodeDesc_'+iRow, arrMatCodes[1][iSelectedIndex-1] )
	SetTransactionChanged(sender, -1);
}

function SetTransactionChanged(sender, iStatus)
{
    var iRow = Get_RowNo_From_ControlName(sender.id);
    SetObjectValue('hfMTRowStatus_'+ iRow,iStatus);
    
    if(iStatus == -1 || iStatus == 3)
    {
    	document.getElementById('MTGridRow_'+iRow).className = 'grdRowChangedColor';
    }
    else
    {
		var rRow = document.getElementById('MTGridRow_'+iRow);
		
	    if(iRow % 2 == 0)
		{
			rRow.className = 'grdDataDivBckGrdColor';
		}
		else
		{
			rRow.className = 'grdRowAlterColor1';			    
		}
    }
    
    SetEditStatus(-1); //Set it to update regardless of the change       
	
	
}

function SaveDD(bFromConfirm)
{
}

/************************************************************************/
/*			POPUP FOR MASS BALANCE ACCOUNTS								*/
/************************************************************************/

function OpenMBAccountPopup(sender, iToOrFrom)
{	
	var attachdiv = document.getElementById('divMBPopup');
    var iRow = Get_RowNo_From_ControlName(sender.id);
    switch(iToOrFrom)
    {
    	case 1:
    	default:
    		sToFrom = 'From';
    		break;
    	case 2:
    		sToFrom = 'To';
    		break;
    }
	
	var sHeader = '<span class="grdfont12 grdfontBold PIMSrisk">'  + sToFrom + '- Mass Balance Account Search - </span><span class="grdfontItalic grdfont12 grdfontBold PIMSrisk">Item '  + (iRow + 1) + ' </span>';
	MBPopupShow(sender, attachdiv, iToOrFrom, sHeader);
}

function ClearMBAccountPopup()
{
	SetObjectValue('MBPopupAccountNo','');
	SetObjectValue('MBPopupAccountDesc','');
	var obj = document.getElementById('cmbMBAccounts');
	SetObjectVisibility('cmbMBAccounts', 'hidden');
	ComboboxClear(obj);
}

function MBPopupShow(sender, divpopup, iToOrFrom,  sHeader)
{
	ClearMBAccountPopup();
	gbtnUnderlying = sender;
    var iRow = Get_RowNo_From_ControlName(sender.id);
	var posn = GetMousePosition();
	divpopup.style.display='block';
	divpopup.style.position='absolute';
	if(posn[0] - 600 < 0)
	{
		posn[0] = 0;
	}
	else
	{
		posn[0] = posn[0] - 600;
	}
	
	var posn1 = GetCentreOfScreen();
	
	if(posn[1] > posn1[1])
	{
		posn[1] = posn1[1];
	}
    SetObjectLeft(divpopup, posn[0]); 
    SetObjectTop(divpopup, posn[1]); 
    SetObjectWidth(divpopup, 675); 
    SetObjectHeight(divpopup, 260); 
    document.getElementById('MBAccountHeader').innerHTML = sHeader;
    divpopup.style.backgroundColor = '#F0E68C';
    divpopup.style.borderStyle='solid';
    divpopup.style.borderWidth='1px';       
    divpopup.style.borderColor='black';  
    divpopup.style.zindex = 1000;
    SetObjectValue('hfToOrFromAccount', iToOrFrom);
    SetObjectValue('hfPopupUnderlyingRowNo', iRow);
    
    gdivPopup = divpopup;
}

function ClickMBSearch()
{
	//Lets get the To Or From value
	var iToOrFrom = GetObjectValue('hfToOrFromAccount');
	var sAccount = GetObjectValue('MBPopupAccountNo');
	var sDescription = GetObjectValue('MBPopupAccountDesc');
	
	if(sAccount == '' && sDescription == '')
	{
		alert('You must provide something to search on');
		return;
	}
	
	//Now run the web service to get the results
    var url = GetWebServiceRoot() + "WbsDispatchDocket";
    var sUser = GetUserId();
    var sSessionId = GetSessionId();

    var parameters = new SOAPClientParameters();
	openModal();
	parameters.add("sSessionId",sSessionId);		        
	parameters.add("sUserId",sUser);		        
	parameters.add("sAccountNo",sAccount);		        
	parameters.add("sAccountDesc",sDescription);		        
    SOAPClient.invoke(url,"getMBAccounts",parameters,true,MBSearch_Succ);

	
}

function MBSearch_Succ(result)
{
	if(result != null)
	{
		if(result != "")
		{
			var bStatus = stringToBoolean(result.status);
			if(!bStatus)
			{
				alert(result.gridstring);
			}
			else
			{
			    var sMBAccounts =  result.gridstring;
			    var iMBAcctRows =  result.gridrows;
			    var iMBAcctCols = result.gridcols;
			    arrMBAccts = ExtractReverseGrid(iMBAcctRows, sMBAccounts, gsMBAcctsCols,iMBAcctCols);
			    PopulateMBPopupDropdown(arrMBAccts);
			}
		}
	}
	closeModal();

}

function PopulateMBPopupDropdown(arrMBAccts)
{
	var obj = document.getElementById('cmbMBAccounts');
	SetObjectVisibility('cmbMBAccounts', 'visible');
	ComboboxClear(obj);
	
	CreateDropDownBoxOption(obj,0,'[select]','[select]','[select]');
	for(var i=0; i<arrMBAccts[0].length;i++)
	{
        CreateDropDownBoxOption(obj,i+1,arrMBAccts[0][i] + '-' + arrMBAccts[1][i],arrMBAccts[0][i] + '-' + arrMBAccts[1][i],arrMBAccts[0][i]);
	}
}

function MBPopupSelected()
{
	var sMBAccountSelected = GetObjectValue('cmbMBAccounts');
	var sMBAccountDesc = GetObjectText('cmbMBAccounts');
	var iToOrFrom = parseInt(GetObjectValue('hfToOrFromAccount'),10);
	var iRowNo = GetObjectValue('hfPopupUnderlyingRowNo');
	sMBAccountDesc = sMBAccountDesc.substring(sMBAccountDesc.indexOf('-') + 1);
    switch(iToOrFrom)
    {
    	case 1:
    	default:
    		sAccntField = 'MTFromAcctNo_'+iRowNo;
    		sAccntField2 = 'MTFromAcctDesc_'+iRowNo;
    		break;
    	case 2:
    		sAccntField = 'MTToAcctNo_'+iRowNo;
    		sAccntField2 = 'MTToAcctDesc_'+iRowNo;
    		break;
    }
    
    SetObjectValue(sAccntField, sMBAccountSelected);
    SetObjectValue(sAccntField2, sMBAccountDesc);
    closeMBPopup('divMBPopup');

}

function closeMBPopup(divName)
{
	var divpopup = document.getElementById(divName);
	divpopup.style.display='none';
}
