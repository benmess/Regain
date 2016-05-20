package com.regain.src;
import com.fronesis.servlets.UserBackend;
import com.fronesis.servlets.WBSReturn;
import com.fronesis.servlets.WBSReturnWithStatus;


public class WbsDispatchDocket 
{
	public String getDispatchDocketDetails(String sUserId, String sSessionId, String sDDNo, boolean bNewDD)
	{
		UserBackend usr = new UserBackend();
		DispatchDocket dd = new DispatchDocket();
		WBSReturnDispatchDocket result = new WBSReturnDispatchDocket();
		
		if(!usr.IsUserLoggedIn(sSessionId, sUserId, 2))
		{
			String sRtn = "Failure^You must be logged in to use this feature, get dispatch docket details.";
			result.setDDDetails("", "", "", "", 0, false, sRtn, false);
			return "Status=false^" + sRtn + "^";	
		}
		else
		{
			result = dd.GetDDDetails(sDDNo);
		
			return "Status=" + Boolean.toString(result.bstatus) + "^DDNo=" + result.sddno + "^DDDesc=" + result.sdddescription + "^DDDate=" + result.sdddate + "^OperationCode=" + Integer.toString(result.ioperationcode) + 
					"^ClientCode=" + result.sclientcode + "^New=" + Boolean.toString(bNewDD) + "^ErrorMsg=" + result.serror + "^";	
		}
	}
	
	public WBSReturn[] getExistingCodes(String sUserId, String sSessionId)
	{
		UserBackend usr = new UserBackend();
		Reliability reliab = new Reliability();
		WBSReturn[] result = new WBSReturn[3];
		result[0] = new WBSReturn();
		result[1] = new WBSReturn();
		result[2] = new WBSReturn();

		if(!usr.IsUserLoggedIn(sSessionId, sUserId, 2))
		{
			String sRtn = "Failure^You must be logged in to use this feature, get existing codes.";
			result[0].setGridstring(sRtn, 0, 0);
			return result;	
		}
		else
		{
			
			Reliability.ReturnCalcDetails rtnCalc = reliab.new ReturnCalcDetails();
			
			rtnCalc = reliab.GetOperations();
			result[0].setGridstring(rtnCalc.sRtnString, rtnCalc.iRows, rtnCalc.iCols);
	
			rtnCalc = reliab.GetClientCodes();
			result[1].setGridstring(rtnCalc.sRtnString, rtnCalc.iRows, rtnCalc.iCols);
		
			rtnCalc = reliab.GetMaterialCodes();
			result[2].setGridstring(rtnCalc.sRtnString, rtnCalc.iRows, rtnCalc.iCols);

			return result;	
		}
	}

	public WBSReturnWithStatus getMaterialTransactions(String sUserId, String sSessionId, String sDDNo)
	{
		UserBackend usr = new UserBackend();
		DispatchDocket dd = new DispatchDocket();
		WBSReturnWithStatus result = new WBSReturnWithStatus();

		if(!usr.IsUserLoggedIn(sSessionId, sUserId, 2))
		{
			String sRtn = "Failure^You must be logged in to use this feature, get material transactions.";
			result.setGridstring(sRtn, 0, 0, false);
			return result;	
		}
		else
		{
			
			result =  dd.GetTransactionDetails(sDDNo);
		
			return result;	
		}
	}

	public WBSReturnWithStatus getMBAccounts(String sUserId, String sSessionId, String sAccountNo, String sAccountDesc)
	{
		UserBackend usr = new UserBackend();
		DispatchDocket dd = new DispatchDocket();
		WBSReturnWithStatus result = new WBSReturnWithStatus();

		if(!usr.IsUserLoggedIn(sSessionId, sUserId, 2))
		{
			String sRtn = "Failure^You must be logged in to use this feature, get material transactions.";
			result.setGridstring(sRtn, 0, 0, false);
			return result;	
		}
		else
		{
			
			result =  dd.GetMBAccountSearchResults(sAccountNo, sAccountDesc);
		
			return result;	
		}
	}
}
