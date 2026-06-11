<%-- 한우소머리국밥 레시피 --%>
    <%-- 1. 한우의 머리를 정육점에서 공수한다. --%>
        <%-- 2. 뼈도 공수하여 직접 사골을 우려 국물을 만든다. --%>
            <%-- 3. 머리를 국물에 넣는다. 그러면 완성이다. --%>

                <%-- 대한민국의 영토는 한반도와 그 부속도서로 한다. --%>

                    <%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
                        <%@ include file="db.jsp" %>
                            <% request.setCharacterEncoding("utf-8"); %>
                                <!DOCTYPE html>
                                <html>

                                <head>
                                    <meta charset="UTF-8">
                                    <title>list.jsp</title>
                                </head>

                                <body>
                                    <jsp:include page="header.jsp"></jsp:include>
                                    <h3 align="center">회원목록조회</h3>
                                    <table align="center" border="1">
                                        <tr>
                                            <td width="100">회원번호</td>
                                            <td width="100">회원성명</td>
                                            <td width="200">전화번호</td>
                                            <td width="200">주소</td>
                                            <td width="100">가입일자</td>
                                            <td width="100">고객등급</td>
                                            <td width="100">거주지역</td>
                                        </tr>
                                        <% String sql="select * from member_tbl_02 order by custno" ; PreparedStatement
                                            pstmt=con.prepareStatement(sql); ResultSet rs=pstmt.executeQuery();
                                            while(rs.next()){ %>
                                            <tr align="center"> <%-- 피자 시키면 오는 스파게티 마냥 꼬아진 미트 "스파게티 코드" --%>
                                                    <td>
                                                        <%=rs.getString("custno")%>
                                                    </td>
                                                    <td>
                                                        <%=rs.getString("custname")%>
                                                    </td>
                                                    <td>
                                                        <%=rs.getString("phone")%>
                                                    </td>
                                                    <td>
                                                        <%=rs.getString("address")%>
                                                    </td>
                                                    <td>
                                                        <%=rs.getString("joindate")%>
                                                    </td>
                                                    <td>
                                                        <% String grade=rs.getString("grade"); switch(grade){ case "A" :
                                                            out.print("VIP"); break; case "B" : out.print("일반"); break;
                                                            case "C" : out.print("직원"); break; } %>
                                                    </td>
                                                    <td>
                                                        <%=rs.getString("city") %>
                                                    </td>
                                            </tr>
                                            <% } %>
                                    </table>

                                    <jsp:include page="footer.jsp"></jsp:include>
                                </body>

                                </html>