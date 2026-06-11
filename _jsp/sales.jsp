<%-- 미더덕이라 부르는 것들의 상당수는 사실 오만둥이이다. --%>
    <%-- 진짜 미더덕은 꽤나 귀하고 맛있다고 한다. --%>
        <%-- 미더덕... 진정한 미더덕이 궁금하긴 하다. --%>

            <%@page import="java.text.DecimalFormat" %>
                <%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
                    <%@ include file="db.jsp" %>
                        <% request.setCharacterEncoding("utf-8"); %>
                            <!DOCTYPE html>
                            <html>

                            <head>
                                <meta charset="UTF-8">
                                <title>sales.jsp</title>
                            </head>

                            <body>
                                <jsp:include page="header.jsp"></jsp:include>
                                <h3 align="center">회원매출조회</h3>
                                <table border="1" align="center">
                                    <tr align="center">
                                        <td>회원번호</td>
                                        <td>회원성명</td>
                                        <td>고객등급</td>
                                        <td>매출</td>
                                    </tr>
                                    <% // me.custno 뒤에 쉼표(,)를 추가하여 ORA-00923 오류를 해결했습니다. String
                                        sql="select me.custno, me.custname, me.grade, sum(mo.price) as price "
                                        + "from member_tbl_02 me " + "join money_tbl_02 mo on me.custno = mo.custno "
                                        + "group by me.custno, me.custname, me.grade " + "order by price desc " ;
                                        PreparedStatement pstmt=con.prepareStatement(sql); ResultSet
                                        rs=pstmt.executeQuery(); DecimalFormat df=new DecimalFormat("￦###,###,###");
                                        while(rs.next()){ String grade=rs.getString("grade"); switch(grade){ case "A" :
                                        grade="VIP" ; break; case "B" : grade="일반" ; break; case "C" : grade="직원" ;
                                        break; } int price=rs.getInt("price"); %>
                                        <tr align="center">
                                            <td>
                                                <%=rs.getString("custno") %>
                                            </td>
                                            <td>
                                                <%=rs.getString("custname") %>
                                            </td>
                                            <td>
                                                <%=grade %>
                                            </td>
                                            <td>
                                                <%=df.format(price) %>
                                            </td>
                                        </tr>
                                        <% } // 안전한 자원 해제 처리 (시험 감점 방지) if(rs !=null) rs.close(); if(pstmt !=null)
                                            pstmt.close(); // 미더덕과 오만둥이는 엄연히 다르다. // 오만둥이는 '오만(온갖) 곳에 다 붙어산다' 란 뜻,
                                            미더덕은 '물에서 나는 더덕' 이라는 뜻이다. %>
                                </table>
                                <jsp:include page="footer.jsp"></jsp:include>
                            </body>

                            </html>