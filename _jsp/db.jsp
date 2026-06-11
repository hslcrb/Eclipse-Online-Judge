<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
    <%@ page import="java.sql.*" %>

        <% Class.forName("oracle.jdbc.OracleDriver"); Connection con=DriverManager.getConnection
            ("jdbc:oracle:thin:@//localhost:1521/xe","system","1234"); %>