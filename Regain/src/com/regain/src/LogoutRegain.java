package com.regain.src;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.fronesis.servlets.UserBackend;

/**
 * Servlet implementation class LogoutRegain
 */
@WebServlet("/LogoutRegain")
public class LogoutRegain extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LogoutRegain() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
	    HttpSession session = request.getSession();
	    String sSessionId = session.getId();
	    Object obj =  session.getAttribute("username");
	    if(obj != null)
	    {
		    String sUser = session.getAttribute("username").toString();
			UserBackend usr = new UserBackend(2);
			usr.LogoutUserSession(sSessionId, sUser, 1);
	    }
		session.invalidate();
	    
		return;
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

}
