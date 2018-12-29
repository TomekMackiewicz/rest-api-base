Feature: Manage item crud via the RESTful API

  In order to allow admin to create, read, update and delete item entity
  As a full stack software developer
  I need to be able to let admin to perform a CRUD operations

  Background:
    Given I set header "Content-Type" with value "application/json"
    And there are Users with the following details:
      | id | username | email          | password  | confirmation_token | roles                              |
      | 1  | peter    | peter@test.com | peterpass | token1             | a:0:{}                             |
      | 2  | john     | john@test.org  | johnpass  | token2             | a:1:{i:0;s:16:"ROLE_SUPER_ADMIN";} |
    And there are Items with the following details:
      | id | signature | status          |
      | 1  | A1        | 1               |
      | 2  | A2        | 2               |

  Scenario: Cannot view the list of items if not logged in as admin
    When I am successfully logged in with username: "peter", and password: "peterpass"
    And I send a "GET" request to "/api/admin/items"
    Then the response code should be 403

  Scenario: Can view the list of items if logged in as admin
    When I am successfully logged in with username: "john", and password: "johnpass"
    And I send a "GET" request to "/api/admin/items?page=1"
    Then the response code should be 200

  Scenario: Can add an item if logged in as admin
    When I am successfully logged in with username: "john", and password: "johnpass"
    And I send a "POST" request to "/api/admin/items" with body:
      """
      {
        "signature": "A3",
        "status": "1"
      }
      """
    Then the response code should be 201
    And the response should contain "crud.create_success"

  Scenario: Cannot add an item if not logged in as admin
    When I am successfully logged in with username: "peter", and password: "peterpass"
    And I send a "POST" request to "/api/admin/items" with body:
      """
      {
        "signature": "A3",
        "status": "1"
      }
      """
    Then the response code should be 403

  Scenario: Can edit an item if logged in as admin 
    When I am successfully logged in with username: "john", and password: "johnpass"
    And I send a "PATCH" request to "/api/admin/items/1" with body:
      """
      {
        "status": "3"
      }
      """
    Then the response code should be 200
    And the response should contain "crud.update_success"

  Scenario: Cannot edit an item if not logged in as admin 
    When I am successfully logged in with username: "peter", and password: "peterpass"
    And I send a "PATCH" request to "/api/admin/items/1" with body:
      """
      {
        "status": "3"
      }
      """
    Then the response code should be 403

  Scenario: Can delete an item if logged in as admin
    When I am successfully logged in with username: "john", and password: "johnpass"
    And I send a "DELETE" request to "/api/admin/items/2"
    Then the response code should be 200

  Scenario: Cannot delete an item if not logged in as admin
    When I am successfully logged in with username: "peter", and password: "peterpass"
    And I send a "DELETE" request to "/api/admin/items/2"
    Then the response code should be 403

  Scenario: Cannot create an item with empty signature
    When I am successfully logged in with username: "john", and password: "johnpass"
    And I send a "POST" request to "/api/admin/items" with body:
      """
      {
        "signature": "",
        "status": "1"
      }
      """
    Then the response code should be 400

  Scenario: Cannot create an item with empty status
    When I am successfully logged in with username: "john", and password: "johnpass"
    And I send a "POST" request to "/api/admin/items" with body:
      """
      {
        "signature": "A3",
        "status": ""
      }
      """
    Then the response code should be 400

  Scenario: Cannot create an item with duplicated signature
    When I am successfully logged in with username: "john", and password: "johnpass"
    And I send a "POST" request to "/api/admin/items" with body:
      """
      {
        "signature": "A1",
        "status": ""
      }
      """
    Then the response code should be 400

  Scenario: Cannot create an item with invalid status
    When I am successfully logged in with username: "john", and password: "johnpass"
    And I send a "POST" request to "/api/admin/items" with body:
      """
      {
        "signature": "A3",
        "status": "B"
      }
      """
    Then the response code should be 400