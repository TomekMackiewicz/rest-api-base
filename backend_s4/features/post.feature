Feature: Manage posts crud via the RESTful API

  In order to allow admin to create, read, update and delete post entity
  As a full stack software developer
  I need to be able to let admin to perform CRUD operations

  Background:
    Given I set header "Content-Type" with value "application/json"
    And there are Users with the following details:
      | id | username | email          | password  | confirmation_token | roles                              |
      | 1  | peter    | peter@test.com | peterpass | token1             | a:0:{}                             |
      | 2  | john     | john@test.org  | johnpass  | token2             | a:1:{i:0;s:16:"ROLE_SUPER_ADMIN";} |
    And there are Posts with the following details:
      | id | title                       | body                                                                            |
      | 1  | Brownie jujubes gingerbread | Macaroon gingerbread apple pie jelly lollipop chocolate cake biscuit tart.      |
      | 2  | Gummies croissant           | Chocolate jujubes ice cream chocolate cake. Oat cake biscuit pastry sweet roll. |

  Scenario: Cannot view the list of posts if not logged in as admin
    When I am successfully logged in with username: "peter", and password: "peterpass"
    And I send a "GET" request to "/api/admin/posts"
    Then the response code should be 403

  Scenario: Can view the list of posts if logged in as admin
    When I am successfully logged in with username: "john", and password: "johnpass"
    And I send a "GET" request to "/api/admin/posts"
    Then the response code should be 200

  Scenario: Can add post if logged in as admin
    When I am successfully logged in with username: "john", and password: "johnpass"
    And I send a "POST" request to "/api/admin/posts" with body:
      """
      {
        "title": "Bear claw icing jelly-o",
        "body": "Candy marzipan ice cream cookie tart candy. Wafer sweet roll marshmallow liquorice jujubes caramels tiramisu."
      }
      """
    Then the response code should be 201
    And the response should contain "crud.create_success"

  Scenario: Cannot add post if not logged in as admin
    When I am successfully logged in with username: "peter", and password: "peterpass"
    And I send a "POST" request to "/api/admin/posts" with body:
      """
      {
        "title": "Bear claw icing jelly-o",
        "body": "Candy marzipan ice cream cookie tart candy. Wafer sweet roll marshmallow liquorice jujubes caramels tiramisu."
      }
      """
    Then the response code should be 403

  Scenario: Can edit post if logged in as admin 
    When I am successfully logged in with username: "john", and password: "johnpass"
    And I send a "PATCH" request to "/api/admin/posts/1" with body:
      """
      {
        "body": "Cotton candy marzipan brownie. Cotton candy pastry topping jelly-o soufflé bear claw bonbon."
      }
      """
    Then the response code should be 200
    And the response should contain "crud.update_success"

  Scenario: Cannot edit post if not logged in as admin 
    When I am successfully logged in with username: "peter", and password: "peterpass"
    And I send a "PATCH" request to "/api/admin/posts/1" with body:
      """
      {
        "body": "Cotton candy marzipan brownie. Cotton candy pastry topping jelly-o soufflé bear claw bonbon."
      }
      """
    Then the response code should be 403

  Scenario: Can delete post if logged in as admin
    When I am successfully logged in with username: "john", and password: "johnpass"
    And I send a "DELETE" request to "/api/admin/posts/2"
    Then the response code should be 200

  Scenario: Cannot delete post if not logged in as admin
    When I am successfully logged in with username: "peter", and password: "peterpass"
    And I send a "DELETE" request to "/api/admin/posts/2"
    Then the response code should be 403

  Scenario: Cannot create post with empty title
    When I am successfully logged in with username: "john", and password: "johnpass"
    And I send a "POST" request to "/api/admin/posts" with body:
      """
      {
        "title": "",
        "body": "Cotton candy marzipan brownie. Cotton candy pastry topping jelly-o soufflé bear claw bonbon."
      }
      """
    Then the response code should be 400

  Scenario: Cannot create post with empty body
    When I am successfully logged in with username: "john", and password: "johnpass"
    And I send a "POST" request to "/api/admin/posts" with body:
      """
      {
        "title": "Bear claw icing jelly-o",
        "body": ""
      }
      """
    Then the response code should be 400
