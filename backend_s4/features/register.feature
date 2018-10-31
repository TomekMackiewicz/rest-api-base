Feature: Handle user registration via the RESTful API

  In order to allow a user to sign up
  As a client software developer
  I need to be able to handle registration


  Background:
    Given I set header "Content-Type" with value "application/json"
    And there are Users with the following details:
      | id | username     | email             | password |
      | 1  | Chandler     | chandler@test.org | Chandler1 |

  Scenario: Can register with valid data
    When I send a "POST" request to "api/register" with body:
      """
      {
        "email": "tribiani@test.com",
        "username": "Tribiani",
        "plainPassword": {
          "first": "Abc123",
          "second": "Abc123"
        }
      }
      """
    Then the response code should be 201
     And the response should contain "user.register.success"
     And I follow the link in the Location response header
     And the response should contain json:
      """
      {
        "id": "2",
        "username": "Tribiani",
        "email": "tribiani@test.com"
      }
      """

  Scenario: Cannot register with existing user name
    When I send a "POST" request to "api/register" with body:
      """
      {
        "email": "another@test.org",
        "username": "Chandler",
        "plainPassword": {
          "first": "Abc123",
          "second": "Abc123"
        }
      }
      """
    Then the response code should be 400
     And the response should contain "user.username.duplicated"

  Scenario: Cannot register with an existing email address
    When I send a "POST" request to "api/register" with body:
      """
      {
        "email": "chandler@test.org",
        "username": "Different",
        "plainPassword": {
          "first": "Abc123",
          "second": "Abc123"
        }
      }
      """
    Then the response code should be 400
     And the response should contain "user.email.duplicated"

  Scenario: Cannot register with an mismatched password
    When I send a "POST" request to "api/register" with body:
      """
      {
        "email": "gary@test.co.uk",
        "username": "Garold",
        "plainPassword": {
          "first": "Gaz123",
          "second": "Gaz456"
        }
      }
      """
    Then the response code should be 400
And the response should contain "form.password_mismatch"
