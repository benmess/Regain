package com.regain.src;
import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.fronesis.servlets.Backend;
import com.fronesis.servlets.Backend.Database;
import com.fronesis.servlets.Backend.DateClass;
import com.fronesis.servlets.WBSReturnWithStatus;


public class DispatchDocket 
{
	

	public WBSReturnDispatchDocket GetDDDetails(String sDDNo)
	{
		Backend be = new Backend(2);
		Database DB = be.new Database();
		DateClass dte = be.new DateClass();
		String[] sParamNames = new String[1];
		Object[] objParamValues = new Object[1];
		WBSReturnDispatchDocket rtnClass = new WBSReturnDispatchDocket();

		sParamNames[0] = "@pvchDocketNo";
		objParamValues[0] = sDDNo;
		
		int iRecordCount = DB.CallStoredProcResultSet("SP_GetDispatchDocket", sParamNames, objParamValues);

		if (iRecordCount < 0)
		{
			return null;
		}
		else
		{
			if(iRecordCount == 0)
			{
				rtnClass.setDDDetails("", "", "", "", 0, true, "", true);
			}
			else
			{
				try
				{
					ResultSet rs = DB.getResultSet();
					String sDDNoFromSQL = rs.getString("DocketNo");
					String sDDDesc = rs.getString("DocketDescription");
//					int iWCDDId = rs.getInt("WindchillDocId");
					Date dtDDDate = rs.getDate("DocketDate");
					String sDDDate = dte.FormatDate(dtDDDate, "dd/MM/yyyy");
					int iOperationCode = rs.getInt("DocketOperationCode");
					
					rtnClass.setDDDetails(sDDNoFromSQL, sDDDesc, sDDDate, "", iOperationCode, false, "", true);
				} 
				catch (SQLException e)
				{
					rtnClass.setDDDetails("", "", "", "", 0, false, e.getMessage(), false);
					return rtnClass;
				}
			}
		}
						
		return rtnClass;

	}

	public WBSReturnWithStatus GetTransactionDetails(String sDDNo)
	{
		Backend be = new Backend(2);
		Database DB = be.new Database();
//		DateClass dte = be.new DateClass();
		String[] sParamNames = new String[1];
		Object[] objParamValues = new Object[1];
		WBSReturnWithStatus clsRtn = new WBSReturnWithStatus();
		String sReturnValue = "";
		int i = 0;
		
		sParamNames[0] = "@pvchDocNumber";
		objParamValues[0] = sDDNo;
		
		int iRecordCount = DB.CallStoredProcResultSet("SP_GetWindchillDispatchDocketTransactions", sParamNames, objParamValues);

		if (iRecordCount < 0)
		{
			clsRtn.gridcols = 0;
			clsRtn.gridrows = 0;
			clsRtn.gridstring = "";
			clsRtn.status = false;
			return clsRtn;
		}
		else
		{
			try
			{
				ResultSet rs = DB.getResultSet();
				for(i=0;i<iRecordCount;i++)
				{
					String sDDNoFromSQL = rs.getString("DocketNo");
					String sMTNo = rs.getString("MaterialTransactionNumber");
					int iWCDDId = rs.getInt("WindchillDocId");
					int iWCMTId = rs.getInt("WindchillMTId");
					String sMTDesc = rs.getString("MaterialTransactionDesc");
					String sMBAccount = rs.getString("MassBalanceAccount");
					String sMBAccountDesc = rs.getString("MassBalanceAccountDesc");
					String sToOrFrom = rs.getString("ToOrFrom");
					double dMass = rs.getFloat("Mass");
					String sMatCode = rs.getString("MaterialCode");
					String sMatCodeDesc = rs.getString("MaterialCodeDesc");
					
					sReturnValue += "DocketNo|" + i + "=" + sDDNoFromSQL + "^MTTransNumber|" + i + "=" +sMTNo + 
							  "^WindchillDocId|" + i + "=" + Integer.toString(iWCDDId) + "^WindchillMTId|" + i + "=" + Integer.toString(iWCMTId) +
							  "^MaterialTransactionDesc|" + i + "=" + sMTDesc + "^MassBalanceAccount|" + i + "=" + sMBAccount +
							  "^MassBalanceAccountDesc|" + i + "=" + sMBAccountDesc +
							  "^ToOrFrom|" + i + "=" + sToOrFrom + "^Mass|" + i + "=" + Double.toString(dMass) + 
							  "^MatCode|" + i + "=" + sMatCode + "^MatCodeDesc|" + i + "=" + sMatCodeDesc + "^||";
					
					rs.next();
				}
				
				clsRtn.gridrows = iRecordCount;
				clsRtn.gridcols = 11;
				clsRtn.gridstring = sReturnValue;
				clsRtn.status = true;

			} 
			catch (SQLException e)
			{
				clsRtn.gridcols = 0;
				clsRtn.gridrows = 0;
				clsRtn.gridstring = e.getMessage();
				clsRtn.status = false;
				return clsRtn;
			}
		}
						
		return clsRtn;

	}
	
	public WBSReturnWithStatus GetMBAccountSearchResults( String sAccountNo, String sAccountDesc)
	{
		ResultSet rst = null;
		int iRecords = 0;
		String sSQL = null;
		Backend be = new Backend(2);
		Database DB = be.new Database();
		int i;
		String sMBString = "";
		WBSReturnWithStatus rtnSet = new WBSReturnWithStatus();
		boolean bStatus = false;

		sSQL = "select WTPartNumber, name from [dbo].[vwWindchillMassBalanceDefaultMaterialCodes] where WTPartNumber like '%" + sAccountNo + "%' and name like '%" + sAccountDesc + "%' order by 1";

		rst = DB.OpenRecordset(sSQL);

		try 
		{
			iRecords = DB.getRowCount(rst);
		} 
		catch (Exception e) 
		{
			sMBString = e.getMessage();
			bStatus = false;
		}

		if (iRecords > 0)
		{
			try
			{
				for(i=0;i<iRecords;i++)
				{
					if(rst.wasNull())
					{
						sMBString = "^";					
					}
					else
					{
						String sMBAccount = rst.getString("WTPartNumber");
						String sMBAccountDesc = rst.getString("name");
						sMBString += "AccountNo|" + i + "=" + sMBAccount + "^AccountDesc|" + i + "=" +sMBAccountDesc + "^||";	
					}
					rst.next();
				}
				bStatus = true;
			}
			catch(SQLException e) 
			{
				sMBString = e.getMessage();
				bStatus = false;
			}
		}
		else
		{
			sMBString = "";
			bStatus = false;
		}

		try 
		{
			rst.close();
		} 
		catch (SQLException e) 
		{
			sMBString = e.getMessage();
			bStatus = false;
		}
		
		rtnSet.gridstring = sMBString;
		rtnSet.gridrows = iRecords;
		rtnSet.gridcols = 2;
		rtnSet.status = bStatus;
		return rtnSet;

	}

}
