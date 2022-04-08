@homePage @smoke @regression
Feature: Home page
  To check if user navigation features on Home page

  Background: Background name
    Given User navigates to home page using

@uat
  @mission
  Scenario Outline: HM_001 User navigation on Home page
    When user clicks on <section> link on the navigation bar
    Then user should be navigated to <section>

    Examples:
      | section     |
      | F.A.Q.      |
      | Home        |
      | Our mission |
      | Partners    |



