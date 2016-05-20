package com.regain.src;

import static net.sf.dynamicreports.report.builder.DynamicReports.*;
import net.sf.dynamicreports.jasper.builder.JasperReportBuilder;
import net.sf.dynamicreports.report.definition.ReportParameters;
import net.sf.dynamicreports.report.exception.DRException;

import java.awt.Color;
import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.io.FileUtils;

import com.fronesis.servlets.Backend;
import com.fronesis.servlets.Backend.Database;
import com.fronesis.servlets.Backend.DateClass;
import com.fronesis.servlets.Backend.Environment;
import com.fronesis.servlets.Backend.FileUtilities;
import com.fronesis.servlets.Backend.Utilities;

import net.sf.dynamicreports.report.base.expression.AbstractSimpleExpression;
import net.sf.dynamicreports.report.builder.DynamicReports;
import net.sf.dynamicreports.report.builder.Units;
import net.sf.dynamicreports.report.builder.VariableBuilder;
import net.sf.dynamicreports.report.builder.column.TextColumnBuilder;
import net.sf.dynamicreports.report.builder.component.ComponentBuilder;
import net.sf.dynamicreports.report.builder.component.TextFieldBuilder;
import net.sf.dynamicreports.report.builder.group.ColumnGroupBuilder;
import net.sf.dynamicreports.report.builder.style.StyleBuilder;
import net.sf.dynamicreports.report.constant.*;

public class MassBalanceReports 
{
	public class ResultSetReturnBool
	{
		ResultSet rset;
		boolean bResult;
		String sMessage;
	}

	public class ReturnCalcDetails
	{
		String sRtnString;
		int iRows;
		int iCols;
	}

	public String SummaryByAccountType(int iReport, int iMBOperationCodeStart, int iMBOperationCodeEnd, 
			   						   String sMBAccountTypeCodeStart, String sMBAccountTypeCodeEnd, 
			   						   String sMBAccountCodeStart, String sMBAccountCodeEnd,
			   						   int iDDOperationCodeStart, int iDDOperationCodeEnd, 
									   String sDDDateStart, String sDDDateEnd, 
									   String sDDNumberStart, String sDDNumberEnd)
	{
		ResultSetReturnBool result = new ResultSetReturnBool();
		Backend be = new Backend(2);
		Environment env = be.new Environment();
		FileUtilities fleutils = be.new FileUtilities();		
		Utilities utils = be.new Utilities();		
		
		try 
		{			
			result = Get_MB_Report(iReport, iMBOperationCodeStart, iMBOperationCodeEnd,
								   sMBAccountTypeCodeStart,sMBAccountTypeCodeEnd,
								   sMBAccountCodeStart, sMBAccountCodeEnd,
								   iDDOperationCodeStart, iDDOperationCodeEnd, 
								   sDDDateStart, sDDDateEnd, 
								   sDDNumberStart, sDDNumberEnd);
			ResultSet rsltset = result.rset;
			rsltset.absolute(0); //Set to the start of the result set so the 1st row shows.
			String sRandomFile = env.GetDeploymentPath() + "\\temp\\" + fleutils.Get_Random_FileName() + ".pdf";
			sRandomFile = utils.StripMultiBackslashes(sRandomFile);
			JasperReportBuilder reportBuild = DynamicReports.report();
			reportBuild.setPageFormat(PageType.A4, PageOrientation.LANDSCAPE);
			//reportBuild.setTemplate(Templates.reportTemplate);
			
			StyleBuilder boldStyle = stl.style().bold(); 
			StyleBuilder boldCenteredStyle = stl.style(boldStyle).setHorizontalAlignment(HorizontalAlignment.CENTER);
			StyleBuilder boldLeftStyle = stl.style(boldStyle).setHorizontalAlignment(HorizontalAlignment.LEFT);
			StyleBuilder boldRightStyle = stl.style(boldStyle).setHorizontalAlignment(HorizontalAlignment.RIGHT);
			StyleBuilder bodyStyleLeft = stl.style().setHorizontalAlignment(HorizontalAlignment.LEFT).setFontSize(8);
			StyleBuilder bodyStyleLeftPadded = stl.style().setHorizontalAlignment(HorizontalAlignment.LEFT).setFontSize(8).setLeftPadding(5);
			StyleBuilder bodyStyleRight= stl.style().setHorizontalAlignment(HorizontalAlignment.RIGHT).setFontSize(8);
			StyleBuilder hdrStyleLeft = stl.style(boldStyle).setHorizontalAlignment(HorizontalAlignment.LEFT).setFontSize(8);
			StyleBuilder hdrStyleLeftPadded = stl.style(boldStyle).setHorizontalAlignment(HorizontalAlignment.LEFT).setFontSize(8).setLeftPadding(5);
			StyleBuilder hdrStyleRight= stl.style(boldStyle).setHorizontalAlignment(HorizontalAlignment.RIGHT).setFontSize(8);
			StyleBuilder grpHdrStyleLeft = stl.style(boldStyle).setHorizontalAlignment(HorizontalAlignment.LEFT).setFontSize(10).italic().setForegroundColor(Color.BLUE);
			StyleBuilder grpFooterStyleLeft = stl.style(boldStyle).setHorizontalAlignment(HorizontalAlignment.LEFT).setFontSize(8).setBottomBorder(stl.pen1Point());;
			StyleBuilder grpFooterStyleRight = stl.style(boldStyle).setHorizontalAlignment(HorizontalAlignment.RIGHT).setFontSize(8).setBottomBorder(stl.pen1Point());;
			StyleBuilder summaryHdrStyleLeft = stl.style(boldStyle).setHorizontalAlignment(HorizontalAlignment.LEFT).setFontSize(12).italic().setForegroundColor(Color.RED).setTopBorder(stl.pen1Point()).setBottomBorder(stl.pen1Point());
			StyleBuilder summaryFooterStyleRight = stl.style(boldStyle).setHorizontalAlignment(HorizontalAlignment.RIGHT).setFontSize(10).italic().setForegroundColor(Color.RED).setBottomBorder(stl.pen1Point());

			StyleBuilder titleStyle = stl.style(boldCenteredStyle).setVerticalAlignment(VerticalAlignment.MIDDLE).setFontSize(15);
			StyleBuilder titleStyle2 = stl.style(boldCenteredStyle).setVerticalAlignment(VerticalAlignment.MIDDLE).setFontSize(12);
			String sRegainLogo =  env.GetBaseWebpath() + "\\RegainLogo.png";
			java.io.File initialFile = new java.io.File(sRegainLogo);
			java.io.InputStream targetStream = FileUtils.openInputStream(initialFile); //getClass().getResourceAsStream(sRegainLogo)
			ComponentBuilder cmpCriteriaHdr = cmp.text("Report Selection Critieria").setStyle(titleStyle2);
			ComponentBuilder cmpCriteriaSpacer = cmp.text("").setHorizontalAlignment(HorizontalAlignment.LEFT).setDimension(Units.cm(0.2), Units.cm(1));
			ComponentBuilder cmpCriteriaLine1A = cmp.text("Mass Balance Account Operation Code").setHorizontalAlignment(HorizontalAlignment.LEFT).setDimension(Units.cm(4.8), Units.cm(1));
			ComponentBuilder cmpCriteriaLine1B = cmp.text(Integer.toString(iMBOperationCodeStart) + " to " + Integer.toString(iMBOperationCodeEnd)).setHorizontalAlignment(HorizontalAlignment.RIGHT).setDimension(Units.cm(2), Units.cm(1));
			ComponentBuilder cmpCriteriaLine1C = cmp.text("Dispatch Docket Operation Code ").setHorizontalAlignment(HorizontalAlignment.LEFT).setDimension(Units.cm(5), Units.cm(1));
			ComponentBuilder cmpCriteriaLine1D = cmp.text(Integer.toString(iDDOperationCodeStart) + " to " + Integer.toString(iDDOperationCodeEnd)).setHorizontalAlignment(HorizontalAlignment.RIGHT).setDimension(Units.cm(2), Units.cm(1));

			ComponentBuilder cmpCriteriaLine2A = cmp.text("Mass Balance Account Type Code").setHorizontalAlignment(HorizontalAlignment.LEFT).setDimension(Units.cm(4.8), Units.cm(1));
			ComponentBuilder cmpCriteriaLine2B = cmp.text(sMBAccountTypeCodeStart + " to " + sMBAccountTypeCodeEnd).setHorizontalAlignment(HorizontalAlignment.RIGHT).setDimension(Units.cm(2), Units.cm(1));
			ComponentBuilder cmpCriteriaLine2C = cmp.text("Dispatch Docket Date ").setHorizontalAlignment(HorizontalAlignment.LEFT).setDimension(Units.cm(3), Units.cm(1));
			ComponentBuilder cmpCriteriaLine2D = cmp.text(sDDDateStart + " to " + sDDDateEnd).setHorizontalAlignment(HorizontalAlignment.RIGHT).setDimension(Units.cm(4), Units.cm(1));

			ComponentBuilder cmpCriteriaLine3A = cmp.text("Mass Balance Account Code").setHorizontalAlignment(HorizontalAlignment.LEFT).setDimension(Units.cm(3.3), Units.cm(1));
			ComponentBuilder cmpCriteriaLine3B = cmp.text(sMBAccountCodeStart + " to " + sMBAccountCodeEnd).setHorizontalAlignment(HorizontalAlignment.RIGHT).setDimension(Units.cm(3.5), Units.cm(1));
			ComponentBuilder cmpCriteriaLine3C = cmp.text("Dispatch Docket No ").setHorizontalAlignment(HorizontalAlignment.LEFT).setDimension(Units.cm(3.5), Units.cm(1));
			ComponentBuilder cmpCriteriaLine3D = cmp.text(sDDNumberStart + " to " + sDDNumberEnd).setHorizontalAlignment(HorizontalAlignment.RIGHT).setDimension(Units.cm(3.5), Units.cm(1));


			switch(iReport)
			{
				case 1:
				default:
					TextColumnBuilder<String> colMassBalAccount = col.column("Mass Balance Account Type", "MassBalanceAccount", type.stringType());
					colMassBalAccount.setTitleStyle(boldLeftStyle);
					TextColumnBuilder<BigDecimal> colReceived = col.column("Received", "ReceivedQty", type.bigDecimalType());
					colReceived.setTitleStyle(boldRightStyle);
					TextColumnBuilder<BigDecimal> colDispatched = col.column("Dispatched", "DispatchedQty", type.bigDecimalType());
					colDispatched.setTitleStyle(boldRightStyle);
					TextColumnBuilder<BigDecimal> colNett =colReceived.subtract(colDispatched).setTitle("Nett");
					colNett.setTitleStyle(boldRightStyle);
					reportBuild.columns(colMassBalAccount,colReceived,colDispatched,colNett);
					reportBuild.subtotalsAtSummary(sbt.sum(colReceived),sbt.sum(colDispatched),sbt.sum(colNett));
					reportBuild.pageHeader(//shows report title
						     cmp.horizontalList()
						  .add(cmp.text("Summary By Account Type").setStyle(titleStyle).setHorizontalAlignment(HorizontalAlignment.LEFT),
							   cmp.image(targetStream).setFixedDimension(80, 80))
						  .newRow()
						  .add(cmp.filler().setStyle(stl.style().setTopBorder(stl.pen2Point())).setFixedHeight(10)));
					break;
				case 2:
					TextColumnBuilder<String> colMassBalAccountType = col.column("MassBalanceAccount", "MassBalanceAccount", type.stringType());
					TextColumnBuilder<String> colMassBalAccountNo = col.column("Code", "Number", type.stringType()).setFixedWidth(Units.cm(2)).setStyle(bodyStyleLeft);
					colMassBalAccountNo.setTitleStyle(hdrStyleLeft);
					TextColumnBuilder<String> colMBDescription = col.column("Description", "MBAccountName", type.stringType()).setFixedWidth(Units.cm(7)).setStyle(bodyStyleLeft);
					colMBDescription.setTitleStyle(hdrStyleLeft);
					TextColumnBuilder<String> colMatCode = col.column("Mat Code", "MaterialCode", type.stringType()).setFixedWidth(Units.cm(1.5)).setStyle(bodyStyleLeft);
					colMatCode.setTitleStyle(hdrStyleLeft);
					TextColumnBuilder<String> colMatDesc = col.column("Material Description", "MaterialDescription", type.stringType()).setFixedWidth(Units.cm(4)).setStyle(bodyStyleLeft);
					colMatDesc.setTitleStyle(hdrStyleLeft);
					TextColumnBuilder<BigDecimal> colReceived2 = col.column("Received", "ReceivedQty", type.bigDecimalType()).setFixedWidth(Units.cm(1.5)).setStyle(bodyStyleRight);
					colReceived2.setTitleStyle(hdrStyleRight);
					TextColumnBuilder<BigDecimal> colDispatched2 = col.column("Dispatched", "DispatchedQty", type.bigDecimalType()).setFixedWidth(Units.cm(1.7)).setStyle(bodyStyleRight);
					colDispatched2.setTitleStyle(hdrStyleRight);
					TextColumnBuilder<BigDecimal> colNett2 =colReceived2.subtract(colDispatched2).setTitle("Nett").setFixedWidth(Units.cm(1.52)).setStyle(bodyStyleRight);
					colNett2.setTitleStyle(hdrStyleRight);
					reportBuild.columns(colMassBalAccountNo,colMBDescription,colMatCode,colMatDesc, colReceived2,colDispatched2,colNett2);
					reportBuild.pageHeader(//shows report title
						     cmp.horizontalList()
						  .add(cmp.text("Material Mass Balance Summary By Account").setStyle(titleStyle).setHorizontalAlignment(HorizontalAlignment.LEFT),
							   cmp.image(targetStream).setFixedDimension(80, 80))
						  .newRow()
						  .add(cmp.filler().setStyle(stl.style().setTopBorder(stl.pen2Point())).setFixedHeight(10)));
					ColumnGroupBuilder grpMBAccountTypeGrp = grp.group(colMassBalAccountType);
					reportBuild.groupBy(grpMBAccountTypeGrp).setGroupStyle(grpHdrStyleLeft).setGroupFooterStyle(grpMBAccountTypeGrp, grpFooterStyleRight);
					reportBuild.subtotalsAtFirstGroupFooter(sbt.sum(colReceived2).setStyle(grpFooterStyleRight),sbt.sum(colDispatched2).setStyle(grpFooterStyleRight),sbt.sum(colNett2).setStyle(grpFooterStyleRight));
					reportBuild.subtotalsAtSummary(sbt.text("Totals", colMassBalAccountNo).setStyle(summaryFooterStyleRight), sbt.sum(colReceived2).setStyle(summaryFooterStyleRight),sbt.sum(colDispatched2).setStyle(summaryFooterStyleRight),sbt.sum(colNett2).setStyle(summaryFooterStyleRight)).setSummaryStyle(summaryFooterStyleRight);
					break;
				case 3:
					
					TextColumnBuilder<String> colMassBalAccountFrom = col.column("FromMassBalanceAccountNo", "ConcatenatedMBAccount", type.stringType());
					TextColumnBuilder<Date> colDispatchDocketDate = col.column("Date", "DispatchDocketDate", type.dateType()).setFixedWidth(Units.cm(2)).setStyle(bodyStyleLeft);
					colDispatchDocketDate.setPattern("dd/MM/yyyy");
					colDispatchDocketDate.setTitleStyle(hdrStyleLeft);
					TextColumnBuilder<String> colDDNumber = col.column("Number", "DispatchDocketNo", type.stringType()).setFixedWidth(Units.cm(2)).setStyle(bodyStyleLeft);
					colDDNumber.setTitleStyle(hdrStyleLeft);
					TextColumnBuilder<String> colMTDescription = col.column("Description", "MTDescription", type.stringType()).setFixedWidth(Units.cm(4.5)).setStyle(bodyStyleLeft);
					colMTDescription.setTitleStyle(hdrStyleLeft);
					TextColumnBuilder<String> colMTMatCode = col.column("Trans Code", "MaterialCode", type.stringType()).setFixedWidth(Units.cm(1.5)).setStyle(bodyStyleLeft);
					colMTMatCode.setTitleStyle(hdrStyleLeft);
					TextColumnBuilder<BigDecimal> colReceived3 = col.column("Received", "ReceivedQty", type.bigDecimalType()).setFixedWidth(Units.cm(1.5)).setStyle(bodyStyleRight);
					colReceived3.setTitleStyle(hdrStyleRight);
					TextColumnBuilder<BigDecimal> colDispatched3 = col.column("Dispatched", "DispatchedQty", type.bigDecimalType()).setFixedWidth(Units.cm(1.7)).setStyle(bodyStyleRight);
					colDispatched3.setTitleStyle(hdrStyleRight);
					TextColumnBuilder<BigDecimal> colNett3 =colReceived3.subtract(colDispatched3).setTitle("Nett").setFixedWidth(Units.cm(1.52)).setStyle(bodyStyleRight);
					colNett3.setTitleStyle(hdrStyleRight);
					TextColumnBuilder<String> colMassBalAccountTo = col.column("Offset Acct", "OffsetMBAccountNo", type.stringType()).setFixedWidth(Units.cm(2)).setStyle(bodyStyleLeftPadded);
					colMassBalAccountTo.setTitleStyle(hdrStyleLeftPadded);
					TextColumnBuilder<String> colMassBalAccountToDesc = col.column("Offset Acct Desc", "OffsetMBAccountDescription", type.stringType()).setFixedWidth(Units.cm(4.5)).setStyle(bodyStyleLeft);
					colMassBalAccountToDesc.setTitleStyle(hdrStyleLeft);
					reportBuild.columns(colDispatchDocketDate,colDDNumber,colMTDescription,colMTMatCode, colReceived3,colDispatched3,colMassBalAccountTo, colMassBalAccountToDesc);
					reportBuild.pageHeader(//shows report title
						     cmp.horizontalList()
						  .add(cmp.text("Material Transaction By Mass Balance Account").setStyle(titleStyle).setHorizontalAlignment(HorizontalAlignment.LEFT),
							   cmp.image(targetStream).setFixedDimension(80, 80))
						  .newRow()
						  .add(cmp.filler().setStyle(stl.style().setTopBorder(stl.pen2Point())).setFixedHeight(10)));
					ColumnGroupBuilder grpMBAccountSubGrp = grp.group(colMassBalAccountFrom);
					VariableBuilder<BigDecimal> qtyReceived = variable(colReceived3, Calculation.SUM);
					VariableBuilder<BigDecimal> qtyDispatched = variable(colDispatched3, Calculation.SUM);
					VariableBuilder<BigDecimal> qtyGrpReceived = variable(colReceived3, Calculation.SUM);
					qtyGrpReceived.setResetGroup(grpMBAccountSubGrp);
//					qtyGrpReceived.setResetType(Evaluation.FIRST_GROUP);
				    VariableBuilder<BigDecimal> qtyGrpDispatched = variable(colDispatched3, Calculation.SUM);
				    qtyGrpDispatched.setResetType(Evaluation.FIRST_GROUP);
				    TextFieldBuilder<String> summarySbt = cmp.text(new CustomTextSubtotal(qtyDispatched, qtyReceived))
				    		         .setStyle(summaryHdrStyleLeft);
					TextFieldBuilder<String>  grpSubTotal = cmp.text(new CustomTextSubtotal(qtyGrpDispatched, qtyGrpReceived)).setStyle(grpFooterStyleLeft);
					reportBuild.variables(qtyReceived, qtyDispatched, qtyGrpReceived, qtyGrpDispatched);
					grpMBAccountSubGrp.footer(grpSubTotal);
					reportBuild.groupBy(grpMBAccountSubGrp).setGroupStyle(grpHdrStyleLeft);
					reportBuild.summary(summarySbt);
//					reportBuild.subtotalsAtFirstGroupFooter(sbt.sum(colReceived3).setStyle(hdrStyleRight),sbt.sum(colDispatched3).setStyle(hdrStyleRight),sbt.sum(colReceived3.subtract(colDispatched3)).setStyle(hdrStyleRight));
					break;
			}
			

			reportBuild.pageHeader(cmp.horizontalList().add(cmpCriteriaHdr).newRow());
			reportBuild.pageHeader(cmp.horizontalList().add(cmpCriteriaLine1A).add(cmpCriteriaLine1B).add(cmpCriteriaSpacer).add(cmpCriteriaLine1C).add(cmpCriteriaLine1D).newRow());
			reportBuild.pageHeader(cmp.horizontalList().add(cmpCriteriaLine2A).add(cmpCriteriaLine2B).add(cmpCriteriaSpacer).add(cmpCriteriaLine2C).add(cmpCriteriaLine2D).newRow());
			reportBuild.pageHeader(cmp.horizontalList().add(cmpCriteriaLine3A).add(cmpCriteriaLine3B).add(cmpCriteriaSpacer).add(cmpCriteriaLine3C).add(cmpCriteriaLine3D).newRow());
			reportBuild.pageHeader(cmp.horizontalList().add(cmp.filler().setStyle(stl.style().setTopBorder(stl.pen2Point())).setFixedHeight(10)));

			reportBuild.pageFooter(cmp.pageXofY());
			reportBuild.setDataSource(rsltset);
			reportBuild.setSubtotalStyle(boldRightStyle);
			reportBuild.summaryWithPageHeaderAndFooter();
			reportBuild.toPdf(export.pdfExporter(sRandomFile));				
		
			String sRtnFileName = "temp\\" + utils.Get_FilenameOnly_From_FullPath(sRandomFile);
			return sRtnFileName;
		} 
		catch (DRException e) 
		{
			e.printStackTrace();
			return e.getMessage();
		}
		catch (java.lang.Exception ex)
		{
			ex.printStackTrace();
			return ex.getMessage();
		}
		
	}
	
	private class CustomTextSubtotal extends AbstractSimpleExpression<String> 
	{
		private static final long serialVersionUID = 1L;
		private VariableBuilder<BigDecimal> qtyDispatched;
        private VariableBuilder<BigDecimal> qtytReceived;

		public CustomTextSubtotal(VariableBuilder<BigDecimal> qtyDispatched, VariableBuilder<BigDecimal> qtytReceived) 
		{
	         this.qtyDispatched = qtyDispatched;
	         this.qtytReceived = qtytReceived;
	    }
		 
		      @Override
		      public String evaluate(ReportParameters reportParameters) 
		      {
		    	 BigDecimal qtySumDispatched = reportParameters.getValue(qtyDispatched);
		         BigDecimal qtySumReceived = reportParameters.getValue(qtytReceived);
		         BigDecimal qtyNett = qtySumDispatched.subtract(qtySumReceived);
		         return "Total Quantities  Received   " + type.bigDecimalType().valueToString(qtySumReceived, reportParameters.getLocale()) + ", " +
		            "Dispatched  " + type.bigDecimalType().valueToString(qtySumDispatched, reportParameters.getLocale()) + ", " +
		            "Nett " + type.bigDecimalType().valueToString(qtyNett, reportParameters.getLocale());
		      }
	}

	public ReturnCalcDetails SummaryByAccountTypeData(int iReport, int iMBOperationCodeStart, int iMBOperationCodeEnd, 
																   String sMBAccountTypeCodeStart, String sMBAccountTypeCodeEnd, 
																   String sMBAccountCodeStart, String sMBAccountCodeEnd,
																   int iDDOperationCodeStart, int iDDOperationCodeEnd, 
																   String sDDDateStart, String sDDDateEnd, 
																   String sDDNumberStart, String sDDNumberEnd)
	{
		ResultSet rst = null;
		Backend be = new Backend(2);
		Database DB = be.new Database();
		DateClass dte = be.new DateClass();
		int i;
		int iCols = 0;
		String sRtnString = "";
		ReturnCalcDetails rtnSet = new ReturnCalcDetails();
		String[] sParamNames = new String[13];
		Object[] objParamValues = new Object[13];

		try
		{
			sParamNames[0] = "@piReport";
			sParamNames[1] = "@piMBOperationStart";
			sParamNames[2] = "@piMBOperationEnd";
			sParamNames[3] = "@psMBAccountTypeStart";
			sParamNames[4] = "@psMBAccountTypeEnd";
			sParamNames[5] = "@psMBAccountCodeStart";
			sParamNames[6] = "@psMBAccountCodeEnd";
			sParamNames[7] = "@piDDOperationStart";
			sParamNames[8] = "@piDDOperationEnd";
			sParamNames[9] = "@pdtDDDateStart";
			sParamNames[10] = "@pdtDDDateEnd";
			sParamNames[11] = "@psDDNumberStart";
			sParamNames[12] = "@psDDNumberEnd";
	
	
			SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
			Date dtDateStart = formatter.parse(sDDDateStart);
			sDDDateStart = dte.FormatDate(dtDateStart, "yyyyMMdd");
	
			Date dtDateEnd = formatter.parse(sDDDateEnd);
			sDDDateEnd = dte.FormatDate(dtDateEnd, "yyyyMMdd");
	
			objParamValues[0] = iReport;
			objParamValues[1] = iMBOperationCodeStart;
			objParamValues[2] = iMBOperationCodeEnd;
			objParamValues[3] = sMBAccountTypeCodeStart;
			objParamValues[4] = sMBAccountTypeCodeEnd;
			objParamValues[5] = sMBAccountCodeStart;
			objParamValues[6] = sMBAccountCodeEnd;
			objParamValues[7] = iDDOperationCodeStart;
			objParamValues[8] = iDDOperationCodeEnd;
			objParamValues[9] = sDDDateStart;
			objParamValues[10] = sDDDateEnd;
			objParamValues[11] = sDDNumberStart;
			objParamValues[12] = sDDNumberEnd;
			
			int iRecordCount = DB.CallStoredProcResultSet("SP_rptMassBalanceSummary", sParamNames, objParamValues);
	
			if (iRecordCount > 0)
			{
				try
				{
					rst = DB.getResultSet();
					for(i=0;i<iRecordCount;i++)
					{
						switch(iReport)
						{
							case 1:
							default:
								sRtnString += "Mass Balance Account Type|" + i + "=" + rst.getString("MassBalanceAccount") + "^Received|" + i + "=" + rst.getDouble("ReceivedQty") + "^Dispatched|" + i + "=" + rst.getDouble("DispatchedQty") + "^";	
								if(rst.wasNull())
								{
									sRtnString = "Mass Balance Account Type|" + i + "=^Received|" + i + "=^Dispatched|" + i + "=^";					
								}
								iCols = 3;
								break;
							case 2:
								sRtnString += "Mass Balance Account Type|" + i + "=" + rst.getString("MassBalanceAccount") + "^Code|" + i + "=" + rst.getString("Number") + 
											  "^MB Account Name|" + i + "=" + rst.getString("MBAccountName") + "^Material Code|" + i + "=" + rst.getString("MaterialCode") +
											  "^Material Description|" + i + "=" + rst.getString("MaterialDescription") + 
											  "^Received|" + i + "=" + rst.getDouble("ReceivedQty") + "^Dispatched|" + i + "=" + rst.getDouble("DispatchedQty") + "^";	
								if(rst.wasNull())
								{
									sRtnString = "Mass Balance Account Type|" + i + "=^Code|" + i + "=" + 
											  "^MB Account Name|" + i + "=^Material Code|" + i + "="  +
											  "^Material Description|" + i + "=" + 
											  "^Received|" + i + "=^Dispatched|" + i + "=^";					
								}
								iCols = 7;
								break;
							case 3:
								Date dteDD = rst.getDate("DispatchDocketDate"); 
								String sDDDate = dte.FormatDate(dteDD, "dd/MM/yyyy");
								sRtnString += "Mass Balance Account From|" + i + "=" + rst.getString("FromMassBalanceAccountNo") + "^Mass Balance Account Description From|" + i + "=" + rst.getString("FromMassBalanceAccountDescription") + 
											  "^Mat Code From|" + i + "=" + rst.getString("FromMatCode") + "^Material Code Description From|" + i + "=" + rst.getString("FromMatCodeDescription") +
											  "^Date|" + i + "=" + sDDDate + "^Number|" + i + "=" + rst.getString("DispatchDocketNo") + 
											  "^Description|" + i + "=" + rst.getString("MTDescription") + "^Mat Code|" + i + "=" + rst.getString("MaterialCode") + 
											  "^Received|" + i + "=" + rst.getDouble("ReceivedQty") + "^Dispatched|" + i + "=" + rst.getDouble("DispatchedQty") + 	
											  "^Offset Account|" + i + "=" + rst.getString("OffsetMBAccountNo") + "^Offset Account Description|" + i + "=" + rst.getString("OffsetMBAccountDescription") +
											  "^Concatenated Account Description|" + i + "=" + rst.getString("ConcatenatedMBAccount") + "^"; 
								if(rst.wasNull())
								{
									sRtnString += "Mass Balance Account From|" + i + "=^Mass Balance Account Description From|" + i + "=" + 
											  "^Mat Code From|" + i + "=^Material Code Description From|" + i + "="  +
											  "^Date|" + i + "=^Number|" + i + "="  + 
											  "^Description|" + i + "=^Mat Code|" + i + "=" + 
											  "^Received|" + i + "=^Dispatched|" + i + "=" + 
											  "^Offset Account|" + i + "=^Offset Account Description|" + i + "=" + 
											  "^Concatenated Account Description|" + i + "=^"; 
								}
								iCols = 13;
								break;
						}
						
						rst.next();
					}
				}
				catch (java.lang.Exception e) 
				{
					sRtnString = e.getMessage();
				}
			}
			else
			{
				sRtnString = "";
			}
	
			try 
			{
				rst.close();
			} 
			catch (SQLException e) 
			{
				sRtnString = e.getMessage();
			}
			
			rtnSet.sRtnString = sRtnString;
			rtnSet.iRows = iRecordCount;
			rtnSet.iCols = iCols;
			return rtnSet;
		}
		catch (java.lang.Exception ex)
		{
			rtnSet.iRows = -1;
			rtnSet.iCols = -1;
			rtnSet.sRtnString = ex.getMessage();
			return rtnSet;
		}

		
	}

	public final ResultSetReturnBool Get_MB_Report(int iReport,int iMBOperationCodeStart, int iMBOperationCodeEnd,
															   String sMBAccountTypeCodeStart, String sMBAccountTypeCodeEnd, 
															   String sMBAccountCodeStart, String sMBAccountCodeEnd,
															   int iDDOperationCodeStart, int iDDOperationCodeEnd, 
															   String sDDDateStart, String sDDDateEnd, 
															   String sDDNumberStart, String sDDNumberEnd)
	{
		Backend be = new Backend(2);
		Database DB = be.new Database();
		DateClass dte = be.new DateClass();
		ResultSetReturnBool rtnClass = new ResultSetReturnBool();		
		String[] sParamNames = new String[13];
		Object[] objParamValues = new Object[13];
		

		sParamNames[0] = "@piReport";
		sParamNames[1] = "@piMBOperationStart";
		sParamNames[2] = "@piMBOperationEnd";
		sParamNames[3] = "@psMBAccountTypeStart";
		sParamNames[4] = "@psMBAccountTypeEnd";
		sParamNames[5] = "@psMBAccountCodeStart";
		sParamNames[6] = "@psMBAccountCodeEnd";
		sParamNames[7] = "@piDDOperationStart";
		sParamNames[8] = "@piDDOperationEnd";
		sParamNames[9] = "@pdtDDDateStart";
		sParamNames[10] = "@pdtDDDateEnd";
		sParamNames[11] = "@psDDNumberStart";
		sParamNames[12] = "@psDDNumberEnd";

		try
		{
			SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
			Date dtDateStart = formatter.parse(sDDDateStart);
			sDDDateStart = dte.FormatDate(dtDateStart, "yyyyMMdd");
	
			Date dtDateEnd = formatter.parse(sDDDateEnd);
			sDDDateEnd = dte.FormatDate(dtDateEnd, "yyyyMMdd");

			objParamValues[0] = iReport;
			objParamValues[1] = iMBOperationCodeStart;
			objParamValues[2] = iMBOperationCodeEnd;
			objParamValues[3] = sMBAccountTypeCodeStart;
			objParamValues[4] = sMBAccountTypeCodeEnd;
			objParamValues[5] = sMBAccountCodeStart;
			objParamValues[6] = sMBAccountCodeEnd;
			objParamValues[7] = iDDOperationCodeStart;
			objParamValues[8] = iDDOperationCodeEnd;
			objParamValues[9] = sDDDateStart;
			objParamValues[10] = sDDDateEnd;
			objParamValues[11] = sDDNumberStart;
			objParamValues[12] = sDDNumberEnd;
			int iRecordCount = DB.CallStoredProcResultSet("SP_rptMassBalanceSummary", sParamNames, objParamValues);
	
			if (iRecordCount < 0)
			{
				return null;
			}
			else
			{
					ResultSet rs = DB.getResultSet();
					rtnClass.bResult = true;
					rtnClass.rset = rs;
					rtnClass.sMessage = "";
			}
							
			return rtnClass;
		}
		catch (java.lang.Exception ex)
		{
			rtnClass.bResult = false;
			rtnClass.rset = null;
			rtnClass.sMessage = ex.getMessage();
			return rtnClass;
		}
		
	}

	public ReturnCalcDetails GetReportTypes()
	{
		ResultSet rst = null;
		int iRecords = 0;
		String sSQL = null;
		Backend be = new Backend(2);
		Database DB = be.new Database();
		int i;
		String sReportsString = "";
		ReturnCalcDetails rtnSet = new ReturnCalcDetails();

		sSQL = "select * from tblMBReports Order By 1";

		rst = DB.OpenRecordset(sSQL);

		try 
		{
			iRecords = DB.getRowCount(rst);
		} 
		catch (java.lang.Exception e) 
		{
			sReportsString = e.getMessage();
		}

		if (iRecords > 0)
		{
			try
			{
				for(i=0;i<iRecords;i++)
				{
					if(rst.wasNull())
					{
						sReportsString = "^";					
					}
					else
					{
						sReportsString += Integer.toString(rst.getInt("ReportId")) + "^" +  rst.getString("Description") + "^";	
					}
					rst.next();
				}
			}
			catch (java.lang.Exception e) 
			{
				sReportsString = e.getMessage();
			}
		}
		else
		{
			sReportsString = "";
		}

		try 
		{
			rst.close();
		} 
		catch (SQLException e) 
		{
			sReportsString = e.getMessage();
		}
		
		rtnSet.sRtnString = sReportsString;
		rtnSet.iRows = iRecords;
		rtnSet.iCols = 2;
		return rtnSet;

	}
}
