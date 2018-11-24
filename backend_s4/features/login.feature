Feature: Handle user login via the RESTful API

  In order to allow secure access to the system
  As a client software developer
  I need to be able to let users log in and out


  Background:
    Given I set header "Content-Type" with value "application/json"
    And there are Users with the following details:
      | id | username     | email             | password  |
      | 1  | Monica       | monica@test.com   | Testpass1 |
      | 2  | Chandler     | chandler@test.org | Chandler1 |

  Scenario: User cannot Login with bad credentials
    When I send a "POST" request to "/api/login_check" with body:
      """
      {
        "username": "Monica",
        "password": "badpass"
      }
      """
    Then the response code should be 401

  Scenario: User can Login with good credentials (username)
    When I send a "POST" request to "/api/login_check" with body:
      """
      {
        "username": "Chandler",
        "password": "Chandler1"
      }
      """
    Then the response code should be 200
    And the response should contain "token"

  Scenario: User can Login with good credentials (email)
    When I send a "POST" request to "/api/login_check" with body:
      """
      {
        "username": "monica@test.com",
        "password": "Testpass1"
      }
      """
    Then the response code should be 200
    And the response should contain "token"
