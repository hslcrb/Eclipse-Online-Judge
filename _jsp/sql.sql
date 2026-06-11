CREATE TABLE member_tbl_02(
	custno number(6) NOT NULL,
	custname varchar2(20),
	phone varchar2(13),
	address varchar2(60),
	joindate date,
	grade char(1),
	city char(2),
	PRIMARY KEY(custno)
);


INSERT INTO member_tbl_02 VALUES (100001,'김행복','010-1111-2222','서울 동대문구 휘경1동','20151202','A','01');
INSERT INTO member_tbl_02 VALUES (100002,'이축복','010-1111-3333','서울 동대문구 휘경2동','20151206','B','01');
INSERT INTO member_tbl_02 VALUES (100003,'장믿음','010-1111-4444','울릉군 울릉읍 독도1리','20151001','B','30');
INSERT INTO member_tbl_02 VALUES (100004,'최사랑','010-1111-5555','울릉군 울릉읍 독도2리','20151113','A','30');
INSERT INTO member_tbl_02 VALUES (100005,'진평화','010-1111-6666','제주시 제주도 외나무골','20151225','B','60');
INSERT INTO member_tbl_02 VALUES (100006,'차공단','010-1111-7777','제주시 제주도 감나무골','20151211','C','60');


CREATE TABLE money_tbl_02(
	custno number(6) NOT NULL,
	salenol number(8) NOT NULL,
	pcost number(8),
	amount number(4),
	price number(8),
	pcode varchar2(4),
	sdate date,
	PRIMARY KEY(custno, salenol)
);


INSERT INTO money_tbl_02 VALUES (100001,2016001,500,5,2500,'A001','20160101');
INSERT INTO money_tbl_02 VALUES (100001,2016002,1000,4,4000,'A002','20160101');
INSERT INTO money_tbl_02 VALUES (100001,2016003,500,3,1500,'A008','20160101');

INSERT INTO money_tbl_02 VALUES (100002,2016004,2000,1,2000,'A004','20160102');
INSERT INTO money_tbl_02 VALUES (100002,2016005,500,1,500,'A001','20160103');

INSERT INTO money_tbl_02 VALUES (100003,2016006,1500,2,3000,'A003','20160103');

INSERT INTO money_tbl_02 VALUES (100004,2016007,500,2,1000,'A001','20160104');
INSERT INTO money_tbl_02 VALUES (100004,2016008,300,1,300,'A005','20160104');
INSERT INTO money_tbl_02 VALUES (100004,2016009,600,1,600,'A006','20160104');
INSERT INTO money_tbl_02 VALUES (100004,2016010,3000,1,3000,'A007','20160106');