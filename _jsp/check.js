function joinCheck() {
    if (document.frm.custno.value == '') {
        alert('회원번호가 입력되지 않았습니다.')
        document.frm.custno.focus();
        return false;
    }
    if (document.frm.custname.value == '') {
        alert('회원성명이 입력되지 않았습니다.')
        document.frm.custname.focus();
        return false;
    }
    if (document.frm.phone.value == '') {
        alert('전화번호가 입력되지 않았습니다.')
        document.frm.phone.focus();
        return false;
    }
    if (document.frm.address.value == '') {
        alert('회원주소가 입력되지 않았습니다.')
        document.frm.address.focus();
        return false;
    }
    if (document.frm.joindate.value == '') {
        alert('가입일자가 입력되지 않았습니다.')
        document.frm.joindate.focus();
        return false;
    }
    if (document.frm.grade.value == '') {
        alert('고객등급이 입력되지 않았습니다.')
        document.frm.grade.focus();
        return false;
    }
    if (document.frm.city.value == '') {
        alert('도시코드가 입력되지 않았습니다.')
        document.frm.city.focus();
        return false;
    }

    return true;
}