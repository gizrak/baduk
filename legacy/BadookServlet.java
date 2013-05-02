package com.gizrak.badook;

import java.io.IOException;
import java.util.logging.Logger;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
public class BadookServlet extends HttpServlet {

	private static final Logger log = Logger.getLogger(BadookServlet.class
			.getName());

	static final String[] MOBILE_SPECIFIC_SUBSTRING = { "iPhone", "Android",
			"MIDP", "Opera Mobi", "Opera Mini", "BlackBerry", "HP iPAQ",
			"IEMobile", "MSIEMobile", "Windows Phone", "HTC", "LG", "MOT",
			"Nokia", "Symbian", "Fennec", "Maemo", "Tear", "Midori", "armv",
			"Windows CE", "WindowsCE", "Smartphone", "240x320", "176x220",
			"320x320", "160x160", "webOS", "Palm", "Sagem", "Samsung", "SGH",
			"SIE", "SonyEricsson", "MMP", "UCWEB" };

	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		String userAgent = req.getHeader("user-agent");
		log.info("user-agent: " + userAgent);

		if (checkMobile(userAgent)) {
			resp.sendRedirect("/mobile.html");
		}
		resp.sendRedirect("/index.html");
	}

	private boolean checkMobile(final String userAgent) {
		for (String mobile : MOBILE_SPECIFIC_SUBSTRING) {
			if (userAgent.contains(mobile)
					|| userAgent.contains(mobile.toUpperCase())
					|| userAgent.contains(mobile.toLowerCase())) {
				return true;
			}
		}
		return false;
	}
}
