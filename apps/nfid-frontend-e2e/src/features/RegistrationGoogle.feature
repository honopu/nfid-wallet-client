@registration @google @registration-with-google @only_deploy_to_main
Feature: Registration using Google

  @register-with-google
  Scenario Outline: User wants to register with Google
    Given User opens NFID site
    Given authstate is cleared
    Given I remove the e2e@identitylabs.ooo
    Given User authenticates with google account
    And User enters a captcha
    And It log's me in
    And Tokens displayed on user assets
    When User opens profile menu
    Then NFID number is not zero

  @login-with-google
  Scenario Outline: User wants to login with Google
    Given User opens NFID site
    Given authstate is cleared
    Given User authenticates with google account
    And It log's me in
    And Tokens displayed on user assets
    When User opens profile menu
    Then NFID number is not zero

  #wdio unable to click google iframe button
  @mobile @pending @register-with-google-mobile
  Scenario Outline: User wants to register with Google from mobile
    Given User opens NFID site
    Given authstate is cleared
    Given I remove the e2e@identitylabs.ooo
    Given User authenticates with google account
    And User enters a captcha
    And User trusts this device
    And Tokens displayed on user assets
    And User has account stored in localstorage
    When User opens mobile profile menu
    Then NFID number is not zero
