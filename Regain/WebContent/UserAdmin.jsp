<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@include file="regain_admin_header.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>User Admin</title>
</head>
<script type="text/javascript" src="Shared/Admin.js"></script>
<script>
$(document).ready(PreparePage);

function PreparePage()
{
	GetAllUserRoleInfo();
}

gsCurrentPage = "AdminUser";	


function GetUserId()
{
	return <%	if(session.getAttribute("username") != null){ %>'<%= session.getAttribute("username").toString() %>';<%}
				else {%>'';<%}%>
} 

</script>
<body>
	<table border="0" cellspacing="2" cellpadding="1" style="table-layout: fixed; width: 600px;" class="bgOffGold">
		<tr style="visibility: hidden;">
			<td class="grdfont10 fontAdmin" style="width: 150px">
			</td>
			<td class="grdfont10 fontAdmin" style="width: 250px">
			</td>
			<td class="grdfont10 fontAdmin" style="width: 200px">
			</td>
		</tr>
		<tr>
			<td colspan="2"
				class="grdfont18 grdfontBold grdfontItalic grdRowTextAligCenter">Add
				New User</td>
		</tr>
		<tr>
			<td class="grdfont10 fontAdmin" style="width:150px;">Username</td>
			<td style="width:250px;"><input size="30" value="" id="new_username" maxlength="50"
				type="text"></td>
			<td class="grdfont10 fontAdmin" style="width: 200px">
			</td>
		</tr>
		<tr>
			<td class="grdfont10 fontAdmin">Password</td>
			<td><input size="30" value="" id="new_password" maxlength="25"
				type="password"></td>
			<td class="grdfont10 fontAdmin" style="width: 200px">
			</td>
		</tr>
		<tr>
			<td class="grdfont10 fontAdmin">Confirm Password</td>
			<td><input size="30" value="" id="new_confirmpassword"
				maxlength="25" type="password" onblur="CheckPassMatches()"></td>
			<td class="grdfont10 fontAdmin" style="width: 200px">
			</td>
		</tr>
		<tr>
			<td class="grdfont10 fontAdmin">Email</td>
			<td><input size="30" value="" id="new_email" maxlength="250"
				type="text"></td>
			<td class="grdfont10 fontAdmin" style="width: 200px">
			</td>
		</tr>
		<tr>
			<td colspan="2" align="center"><input id="btnAddUser"
				name="Add User" type="button" value="Add User"
				onclick="CheckUser();"></td>
			<td class="grdfont10 fontAdmin" style="width: 200px">
			</td>
		</tr>
	</table>

	<table style="table-layout: fixed; width: 600px;" class="bgGold">
		<tr style="visibility: hidden;">
			<td class="grdfont10 fontAdmin" style="width: 120px">
			</td>
			<td class="grdfont10 fontAdmin" style="width: 380px">
			</td>
			<td class="grdfont10 fontAdmin" style="width: 100px">
			</td>
		</tr>
 		<tr>
			<td colspan="3"
				class="grdfont18 grdfontBold grdfontItalic grdRowTextAligCenter">Add
				New Role</td>
		</tr>
		<tr>
			<td class="grdfont10 fontAdmin" style="width: 120px">New Role
			</td>
			<td class="grdfont10 fontAdmin" style="width: 380px">Description
			</td>
			<td class="grdfont10 fontAdmin" style="width: 100px">
			</td>
		</tr>
		<tr>
			<td class="grdfont10" style="width: 120px"><input
				type="text" id="txtNewRoleName" style="width: 118px"
				onblur="CheckRoleExists()" /></td>
			<td class="grdfont10" style="width: 380px"><input
				type="text" id="txtNewRoleDesc" style="width: 370px" /></td>
			<td class="grdfont10" style="width: 100px"><input
				type="button" style="width: 90px" id="btnAddNewRole" value="Add Role"
				onclick="SetRole()" disabled="disabled" /></td>
		</tr>
	</table>

	<table style="table-layout: fixed; width: 600px;" class="lightbluebackground">
		<tr style="visibility: hidden;">
			<td class="grdfont10 fontAdmin" style="width: 200px">
			</td>
			<td class="grdfont10 fontAdmin" style="width: 200px">
			</td>
			<td class="grdfont10 fontAdmin" style="width: 100px">
			</td>
			<td class="grdfont10 fontAdmin" style="width: 96px">
			</td>
		</tr>
		<tr>
			<td colspan="4"
				class="grdfont18 grdfontBold grdfontItalic grdRowTextAligCenter">Add
				Roles to a User</td>
		</tr>
		<tr>
			<td style="width: 200px">
				<label class="grdfont10 fontAdmin"> Users </label>
			</td>
			<td class="grdfont10 fontAdmin" style="width: 200px">
				Roles
			</td>
			<td class="grdfont10 fontAdmin" style="width: 100px">
			</td>
			<td class="grdfont10 fontAdmin" style="width: 96px">
			</td>
		</tr>
		<tr>
			<td class="grdFont8">
				<table>
					<tr>
						<td class="grdFont8">
							<select id="cmbUsers" style="width: 190px;" onchange="GetUserRoles()"></select>
						</td>
					</tr>
					<tr>
						<td class="grdFont8" align="center">
							<input type="button" id="btnDeleteUser"	value="Delete User" onclick="DeleteUser()" /> 
						</td>
					</tr>
				</table>
			</td>
			<td class="grdFont8">
				<select id="lstRoles" multiple="multiple" size="6" style="width: 190px;"></select>
			</td>
			<td><input type="button" id="btnUpdateUserRoles" value="Update Roles" onclick="SetUserRoles()" /> 
			</td>
			<td>
				<input type="button" id="btnDeleteRole" value="Delete Role"	onclick="DeleteRole()" />
			</td>
		</tr>
	</table>

	<table style="table-layout: fixed; width: 600px;" class="bgLightGreen">
		<tr style="visibility: hidden;">
			<td class="grdfont10 fontAdmin" style="width: 200px">
			</td>
			<td class="grdfont10 fontAdmin" style="width: 200px">
			</td>
			<td class="grdfont10 fontAdmin" style="width: 100px">
			</td>
			<td class="grdfont10 fontAdmin" style="width: 96px">
			</td>
		</tr>
		<tr>
			<td colspan="4"
				class="grdfont18 grdfontBold grdfontItalic grdRowTextAligCenter">Add
				Users to a Role</td>
		</tr>
		<tr>
			<td style="width: 200px">
			<label class="grdfont10 fontAdmin"> Roles </label></td>
			<td class="grdfont10 fontAdmin" style="width: 200px">
			 Users </td>
		</tr>
		<tr>
			<td class="grdFont8">
				<table>
					<tr>
						<td class="grdFont8">
							<select id="cmbRoles" style="width: 190px;" onchange="GetUsersForRole()"></select>
						</td>
					</tr>
					<tr>
						<td class="grdFont8" align="center">
						<input type="button" id="btnDeleteRole2"	value="Delete Role" onclick="DeleteRole2()" /> 
						</td>
					</tr>
				</table>
			</td>
			<td class="grdFont8"><select id="lstUsers" multiple="multiple"
				size="6" style="width: 190px;"></select></td>
			<td><input type="button" id="btnUpdateUsersForRole"
				value="Update Users" onclick="SetUserRoles2()" />
			</td>
			<td> <input
				type="button" id="btnDeleteUser2" value="Delete User"
				onclick="DeleteUser2()" /></td>
		</tr>
	</table>

	<div id="fade"></div>
	<div id="modal">
		<img id="loader" src="images/loading.gif" />
	</div>
</body>
</html>