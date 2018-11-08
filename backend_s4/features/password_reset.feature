Feature: Handle password reset via the RESTful API

  In order to help users quickly regain access to their account
  As a client software developer
  I need to be able to let users request a password reset


  Background:
    Given I set header "Content-Type" with value "application/json"
    And there are Users with the following details:
      | id | username | email          | password  | confirmation_token |
      | 1  | Rachel   | green@test.com | Rachel1   |                    |
      | 2  | Tribiani | joey@test.org  | Tribiani1 | some-token-string  |


  Scenario: Cannot request a password reset for an invalid username
    When I send a "POST" request to "/api/password/reset/request" with body:
      """
      { "username": "Invalid" }
      """
    Then the response code should be 403
    And the response should contain "user.not_recognised"

  Scenario: Can request a password reset for a valid username
    When I send a "POST" request to "/api/password/reset/request" with body:
      """
      { "username": "Rachel" }
      """
    Then the response code should be 200
     And the response should contain "user.resetting.check_email"

  Scenario: Cannot request another password reset for an account already requesting, but not yet actioning the reset request
    When I send a "POST" request to "/api/password/reset/request" with body:
      """
      { "username": "Tribiani" }
      """
    Then the response code should be 403
    And the response should contain "resetting.password_already_requested"

  ############################
  ## Password Reset Confirm ##
  ############################

  Scenario: Cannot confirm without a token
    When I send a "POST" request to "/api/password/reset/confirm" with body:
      """
      { "bad": "data" }
      """
    Then the response code should be 400
    And the response should contain "You must submit a token"

  Scenario: Cannot confirm with an invalid token
    When I send a "POST" request to "/api/password/reset/confirm" with body:
      """
      { "token": "invalid token string" }
      """
    Then the response code should be 400

  Scenario: Cannot confirm without a valid new password
    When I send a "POST" request to "/api/password/reset/confirm" with body:
      """
      {
        "token": "some-token-string",
        "plainPassword": {
          "second": "first-is-missing"
        }
      }
      """
    Then the response code should be 400
    And the response should contain "form.password_mismatch"

  Scenario: Cannot confirm with a mismatched password and confirmation
    When I send a "POST" request to "/api/password/reset/confirm" with body:
      """
      {
        "token": "some-token-string",
        "plainPassword": {
          "first": "some password",
          "second": "oops"
        }
      }
      """
    Then the response code should be 400
    And the response should contain "form.password_mismatch"

  Scenario: Can confirm with valid new password
    When I send a "POST" request to "/api/password/reset/confirm" with body:
      """
      {
        "token": "some-token-string",
        "plainPassword": {
          "first": "Newpassword1",
          "second": "Newpassword1"
        }
      }
      """
    Then the response code should be 200
    And the response should contain "resetting.flash.success"
    And I send a "POST" request to "/api/login_check" with body:
      """
      {
        "username": "Tribiani",
        "password": "Newpassword1"
      }
      """
    Then the response code should be 200
And the response should contain "token"
