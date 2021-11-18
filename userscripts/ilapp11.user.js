// ==UserScript==
// @name         ilapp11
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://ilapp11.tlv.sap.corp/SynerionWeb
// @icon         https://www.google.com/s2/favicons?domain=userscript.zone
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  window.addEventListener("load", () => {
  //  addButton("Fill All");
    addButton2();
  });
/*
  function addButton(text, onclick, cssObj) {
    cssObj = cssObj || {
      position: "fixed",
      top: "93%",
      right: "40%",
      "z-index": 3,
      fontWeight: "600",
      fontSize: "12px",
      backgroundColor: "#00cccc",
      color: "white",
      border: "none",
      padding: "2px 2px"
    };

    //<button title="TEST" ng-click="root.saveAndCalc()" class="fa fa-calculator flat-button db-right-menu-btn pull-right" ng-disabled="!root.state.selectedRecord"></button>
    let button = document.createElement("button"),
      btnStyle = button.style;
    document.body.appendChild(button);
    button.innerHTML = text;
    // Settin function for button when it is clicked.
    button.onclick = updateAll;
    Object.keys(cssObj).forEach(key => (btnStyle[key] = cssObj[key]));
    return button;
  }
  */

  function addButton2 (){
//<button title="Hack Me" ng-click="root.saveAndCalc()" class="fa fa-coffee flat-button db-right-menu-btn pull-right" ng-disabled="!root.state.selectedRecord"></button>
    let button = document.createElement("button");
    button.className= "fa fa-coffee flat-button db-right-menu-btn pull-right";
    //button.innerHTML = text;
    // Settin function for button when it is clicked.
    button.onclick = updateAll;
    let selector = "#dailyBrowser > div:nth-child(2) > div > div.toolbar.menu-info-task-toolbar.db-toolbar > div.pull-right.toolbar-button-holder.btn-group > div:nth-child(5)";

    waitForElementToDisplay(selector,function(){
      toolbar = document.querySelector(selector);
      if(toolbar != null)
        toolbar.appendChild(button);
    },1000,9000);

  }


function waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs) {
  var startTimeInMs = Date.now();
  (function loopSearch() {
    if (document.querySelector(selector) != null) {
      callback();
      return;
    }
    else {
      setTimeout(function () {
        if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
          return;
        loopSearch();
      }, checkFrequencyInMs);
    }
  })();
}

  function updateAll() {

    var listOfDates = getAllUnassignedDates();
    if(listOfDates.length == 0){
      alert("No Missing Dates Found");
      return;
    }

    alert("Reporting Dates: " +listOfDates);
    for (const d of listOfDates) {
      console.log(d);
      updateDate(d);
    }
    location.reload();
  }

  function getAllUnassignedDates() {

    var result = [];

    var t;
    t= document.querySelector("#dailyBrowser > div:nth-child(2) > div > div.toolbar.menu-info-task-toolbar.db-toolbar > div.pull-left.flip.toolbar-button-holder > div > div.pull-right.flip.search-back-forth.btn-group.toolbar-btn-group.db-employee-period-wrapper > period-selector > button > label > b > span.period-dates").innerText;
    console.log(t);
    var parsed = t.split(" - ");

    var startYear = parsed[0].split("/")[2];
    console.log("startYear:"+startYear);
    var endYear = parsed[1].replace(')', '').split("/")[2];
    console.log("endYear:"+endYear);

    for (let i = 1; i < 31 ; i++) {
        if( isMissingCode(i)){
          t = getRowDate(i,startYear,endYear);
          console.log(t);
          //updateDate(t);
          result.push(t);
        }
    }
    return result;
  }

  function isMissingCode(row){
    console.log("isMissingCode:"+row);
    var table = document.getElementById("table1");
    try {
      var text = table.rows[row].cells[2].innerText.trim();
      console.log("isMissingCode:"+row + "Table Value: "+text);
      return (text == "העדרות ללא רשות");
    }
    catch(err) {
      console.error("isMissingCode:"+row +" Error getting table value");
    }
    return false;
  }

  function getRowDate(row,startYear,endYear) {
    var textValue = document.querySelector("#table1 > tbody > tr:nth-child("+row+") > td:nth-child(2) > div > div.text-right.date").innerText;
    var result;
    var parsed = textValue.split("/");
    var day = parsed[0];
    if (day < 20)
      result = endYear+"-"+parsed[1]+"-"+ day;
    else
      result = startYear+"-"+parsed[1]+"-"+ day;
    return result;
  }

  function updateDate(dateText) {
 //   var temp = "2021-11-04";
 //   dateText = temp;
    var body = "{\"ActionData\":{\"Absence\":\"27\"},\"Action\":1,\"DatePeriodSelection\":{\"PeriodKey\":202111,\"AccumCode\":4,\"IsDateRange\":true,\"DateRange\":{\"To\":\""
      + dateText
      + "T00:00:00.000Z\",\"From\":\""
      + dateText
      + "T00:00:00.000Z\"},\"CorrelationId\":\"00000000-0000-0000-0000-000000000000\",\"IsCurrent\":true}},\"Employees\":[\"     1027779\"],\"Filters\":null}";

    fetch("https://ilapp11.tlv.sap.corp/SynerionWeb/api/DailyBrowser/globalUpdate", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9,he;q=0.8,ru;q=0.7",
        "content-type": "application/json;charset=UTF-8",
        "sec-ch-ua": "\"Google Chrome\";v=\"95\", \"Chromium\";v=\"95\", \";Not A Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin"
      },
      "referrer": "https://ilapp11.tlv.sap.corp/SynerionWeb",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": body,
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    });

  }

})();