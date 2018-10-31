Feature: Handle password changing via the RESTful API

  In order to provide a more secure system
  As a client software developer
  I need to be able to let users change their current API password


  Background:
    Given I set header "Content-Type" with value "application/json"
    And there are Users with the following details:
      | id | username   | email           | password    |
      | 1  | Phoebe     | phoebe@test.com | Phoebepass1 |
      | 2  | RossGeller | ross@test.org   | Rosspass1   |

  Scenario: Cannot hit the change password endpoint if not logged in (missing token)
    When I send a "POST" request to "/api/password/1/change" with body:
      """
      {
        "current_password": "Phoebepass1",
        "plainPassword": {
          "first": "Newpassword1",
          "second": "Newpassword1"
        }
      }
      """
    Then the response code should be 401

  Scenario: Cannot change the password for a different user
    When I am successfully logged in with username: "RossGeller", and password: "Rosspass1"
     And I send a "PATCH" request to "/api/password/2/change" with body:
      """
      {
        "current_password": "Phoebepass1",
        "plainPassword": {
          "first": "Newpassword1",
          "second": "Newpassword1"
        }
      }
      """
    Then the response code should be 403

  Scenario: Can change password with valid credentials
    When I am successfully logged in with username: "Phoebe", and password: "Phoebepass1"
     And I send a "PATCH" request to "/api/password/1/change" with body:
      """
      {
        "current_password": "Phoebepass1",
        "plainPassword": {
          "first": "Newpassword1",
          "second": "Newpassword1"
        }
      }
      """
    Then the response code should be 200
     And the response should contain "change_password.flash.success"

Scenario: Cannot change password with bad current password
    When I am successfully logged in with username: "Phoebe", and password: "Phoebepass1"
     And I send a "PATCH" request to "/api/password/1/change" with body:
      """
      {
        "current_password": "wrong",
        "plainPassword": {
          "first": "Newpassword1",
          "second": "Newpassword1"
        }
      }
      """
    Then the response code should be 400
     And the response should contain "form.validation.password.invalid"

  Scenario: Cannot change password with mismatched new password
    When I am successfully logged in with username: "Phoebe", and password: "Phoebepass1"
     And I send a "PATCH" request to "/api/password/1/change" with body:
      """
      {
        "current_password": "Phoebepass1",
        "plainPassword": {
          "first": "Newpassword1",
          "second": "Newpassword2"
        }
      }
      """
    Then the response code should be 400
     And the response should contain "form.password_mismatch"

  Scenario: Cannot change password with missing new password field
    When I am successfully logged in with username: "Phoebe", and password: "Phoebepass1"
     And I send a "PATCH" request to "/api/password/1/change" with body:
      """
      {
        "current_password": "Phoebepass1",
        "plainPassword": {
          "second": "MissingFirst1"
        }
      }
      """
    Then the response code should be 400
And the response should contain "form.password_mismatch"
