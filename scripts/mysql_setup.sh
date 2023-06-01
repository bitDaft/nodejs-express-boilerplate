#!/usr/bin/env sh

# run steps involved in mysql_secure_installation
# and creates and sets permission for a custom user

sudo mysql << _EOF_
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
DELETE FROM mysql.user WHERE User='';
DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');
DROP DATABASE IF EXISTS test;
DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';
ALTER USER 'root'@'localhost' IDENTIFIED WITH auth_socket;
DROP USER IF EXISTS 'test-user'@'localhost';
CREATE USER 'test-user'@'localhost' IDENTIFIED BY "userpassword";
CREATE DATABASE test;
GRANT CREATE TEMPORARY TABLES, CREATE ROUTINE, ALTER ROUTINE, LOCK TABLES, ALTER, CREATE, DELETE, DROP, INDEX, INSERT, REFERENCES, SELECT, SHOW VIEW, TRIGGER, UPDATE, EXECUTE ON test.* TO 'test-user'@'localhost';
GRANT SYSTEM_VARIABLES_ADMIN, RELOAD  ON *.* TO 'test-user'@'localhost';
FLUSH PRIVILEGES;
_EOF_

