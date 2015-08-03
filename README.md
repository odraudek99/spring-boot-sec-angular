# spring-boot-sec-angular
Spring boot with security and angularjs separates projects

Angular 1 : port 8081 : http://localhost:8081/#!/login
Angular 2 : port 8082 : http://localhost:8082/#!/login

backend springboot: 8080  (too has angular front)
: http://localhost:8080/#!/login

to run angular 1:
mvn spring-boot:run

to run angular 2:
mvn spring-boot:run

to run backend rest api:
mvn clean package
To enable security:
java -jar target/x-auth-security-1.0.0.RELEASE.jar -s

To disable security:
java -jar target/x-auth-security-1.0.0.RELEASE.jar 

-----------------------------------------------------------------------------------------

when security is enable , angular 1 and angular 2 has error but angular in backend (: http://localhost:8080/#!/login) is ok =/



