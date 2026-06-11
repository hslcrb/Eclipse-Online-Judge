<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
    <%@ include file="db.jsp" %>
        <% request.setCharacterEncoding("utf-8"); %>
            <!DOCTYPE html>
            <html>

            <head>
                <meta charset="UTF-8">
                <title>회원등록</title>
            </head>

            <body>
                <script type="text/javascript" src="check.js"></script>
                <jsp:include page="header.jsp"></jsp:include>
                <h3 align="center">홈쇼핑 회원 등록</h3>

                <form name='frm' method='post' action='joinok.jsp'>
                    <table align='center' border='1'>

                        <!-- 입력받기 -->
                        <tr>
                            <td align='center'>회원번호</td>
                            <td><input type='text' name='custno'></td>
                        </tr>

                        <tr>
                            <td align='center'>회원성명</td>
                            <td><input type='text' name='custname'></td>
                        </tr>

                        <tr>
                            <td align='center'>회원전화</td>
                            <td><input type='text' name='phone'></td>
                        </tr>

                        <tr>
                            <td align='center'>회원주소</td>
                            <td><input type='text' name='address'></td>
                        </tr>

                        <tr>
                            <td align='center'>가입일자</td>
                            <td><input type='text' name='joindate'></td>
                        </tr>

                        <tr>
                            <td align='center'>고객등급(A: VIP, B: 일반, C: 직원)</td>
                            <td><input type='text' name='grade'></td>
                        </tr>

                        <tr>
                            <td align='center'>도시코드</td>
                            <td><input type='text' name='city'></td>
                        </tr>

                        <tr>
                            <td colspan='2' align='center'>
                                <input type='submit' value='등록' onclick='return joinCheck()'>
                                <input type='button' value='조회' onclick=''>
                            </td>
                        </tr>

                    </table>
                </form>

                <jsp:include page="footer.jsp"></jsp:include>
            </body>

            </html>