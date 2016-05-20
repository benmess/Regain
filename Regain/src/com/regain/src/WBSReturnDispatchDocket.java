package com.regain.src;

public class WBSReturnDispatchDocket 
{
		public String sddno;
		public String sdddescription;
		public int ioperationcode;
		public String sdddate;
		public String sclientcode;
		public boolean bnew;
		public String serror;
		public boolean bstatus;
		
		

		public WBSReturnDispatchDocket()
		{
			this.sddno = "";
			this.sdddescription = "";
			this.sdddate = "";
			this.sclientcode = "";
			this.ioperationcode = 0;
			this.bnew = false;
			this.serror = "";
			this.bstatus = false;
		}
		
		public void setDDDetails(String sDDNo, String sDDDesc,  String sDDDate, String sClientCode, int iOperationCode, boolean bNew, String sError, boolean bStatus)
		{
			sddno = sDDNo;
			sdddescription = sDDDesc;
			sdddate = sDDDate;
			sclientcode = sClientCode;
			ioperationcode = iOperationCode;
			bnew = bNew;
			serror = sError;
			bstatus = bStatus;
			
		}
		
		public String getDDNo()
		{
			return sddno;
		}

		public String getDDDesc()
		{
			return sdddescription;
		}

		public String getDDDate()
		{
			return sdddate;
		}

		public String getClientCode()
		{
			return sclientcode;
		}

		public int getOperationCode()
		{
			return ioperationcode;
		}

		public boolean getNew()
		{
			return bnew;
		}

		public String getError()
		{
			return serror;
		}

		public boolean getStatus()
		{
			return bstatus;
		}
}
