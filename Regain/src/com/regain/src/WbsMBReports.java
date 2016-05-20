package com.regain.src;
import com.fronesis.servlets.UserBackend;
import com.fronesis.servlets.WBSReturn;
import com.fronesis.servlets.WBSReturnWithExtra;


public class WbsMBReports 
{
	public WBSReturnWithExtra get_Report_pdf(String sUserId, String sSessionId, int iReport, 
											 int iMBOperationCodeStart, int iMBOperationCodeEnd,
											 String sMBAccountTypeCodeStart, String sMBAccountTypeCodeEnd, 
											 String sMBAccountCodeStart, String sMBAccountCodeEnd,
											 int iDDOperationCodeStart, int iDDOperationCodeEnd, 
											 String sDDDateStart, String sDDDateEnd, 
											 String sDDNumberStart, String sDDNumberEnd)
{
		WBSReturnWithExtra result = new WBSReturnWithExtra();
		String sReturn = "";
		MassBalanceReports mbrpt = new MassBalanceReports();
		UserBackend usr = new UserBackend();

		if(!usr.IsUserLoggedIn(sSessionId, sUserId, 2))
		{
			String sRtn = "Failure^You must be logged in to use this feature, get filtered equipment codes.";
			result.setGridstring(sRtn, 0, 0, "", 0);
		}
		else
		{   
			sReturn = mbrpt.SummaryByAccountType(iReport, iMBOperationCodeStart, iMBOperationCodeEnd, 
												 sMBAccountTypeCodeStart, sMBAccountTypeCodeEnd, 
												 sMBAccountCodeStart, sMBAccountCodeEnd,
												 iDDOperationCodeStart, iDDOperationCodeEnd, 
												 sDDDateStart, sDDDateEnd, 
												 sDDNumberStart, sDDNumberEnd);
			MassBalanceReports.ReturnCalcDetails rtnCalc = mbrpt.new ReturnCalcDetails();
			rtnCalc = mbrpt.SummaryByAccountTypeData(iReport, iMBOperationCodeStart, iMBOperationCodeEnd, 
													 sMBAccountTypeCodeStart, sMBAccountTypeCodeEnd, 
													 sMBAccountCodeStart, sMBAccountCodeEnd,
													 iDDOperationCodeStart, iDDOperationCodeEnd, 
													 sDDDateStart, sDDDateEnd, 
													 sDDNumberStart, sDDNumberEnd);
			result.setGridstring(rtnCalc.sRtnString, rtnCalc.iRows, rtnCalc.iCols, sReturn, iReport);
		}
		return result;	
	}
	
	public WBSReturn getReportTypes(String sUserId, String sSessionId)
	{
		UserBackend usr = new UserBackend();
		MassBalanceReports mbrpt = new MassBalanceReports();
		WBSReturn result = new WBSReturn();
		if(!usr.IsUserLoggedIn(sSessionId, sUserId, 2))
		{
			String sRtn = "Failure^You must be logged in to use this feature, get report types.";
			result.setGridstring(sRtn, 0, 0);
			return result;	
		}
		else
		{
			MassBalanceReports.ReturnCalcDetails rtnCalc = mbrpt.new ReturnCalcDetails();
			
			rtnCalc = mbrpt.GetReportTypes();
			result.setGridstring(rtnCalc.sRtnString, rtnCalc.iRows, rtnCalc.iCols);
		
			return result;	
		}
	}

}
