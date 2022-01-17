"use strict";

(function (global) {
  const fadeIn = document.querySelectorAll('[data-fade="false"]');
  const openMenu = document.querySelector(".open-menu");
  const closeMenu = document.querySelector(".close-menu");
  const mblMenu = document.querySelector(".navbar-nav");

  openMenu.addEventListener("click", () => {
    mblMenu.dataset.active = "true";
  });

  closeMenu.addEventListener("click", () => {
    mblMenu.dataset.active = "false";
  });

  let appearOptions = {
    rootMargin: "500px 0px 0px 0px",
  };

  let appearObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.dataset.fade = "true";
      appearObserver.unobserve(entry.target);
    });
  }, appearOptions);

  fadeIn.forEach((fade) => {
    appearObserver.observe(fade);
  });

  // ------------------------------------------------ CREATING THE CALENDAR ------------------------------------------------ //

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthes = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const cal = document.querySelector(".cal-body");
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth();

  const currMonth = document.querySelector("[data-month]");
  currMonth.innerText = monthes[month] + " " + year;
  const nextMonth = document.querySelector("[data-month-right]");
  const prevMonth = document.querySelector("[data-month-left]");
  let currentData = [];

  function drawCal(year, month, events = []) {
    if (cal.hasChildNodes()) cal.innerHTML = "";

    let firstDay = new Date(year, month, 1);
    let lastDay = new Date(year, month + 1, 0);
    let monthDays = [];

    weekdays.forEach((weekday) => {
      let wDay = document.createElement("span");
      wDay.innerText = weekday;
      cal.appendChild(wDay);
    });

    for (let index = 0; index < firstDay.getDay(); index++) {
      let monthDay = document.createElement("div");
      monthDays.push(monthDay);
    }
    for (let index = 1; index <= lastDay.getDate(); index++) {
      let monthDay = document.createElement("div");
      let tooltip = document.createElement("div");
      let eventContain = document.createElement("div");

      monthDay.classList.add("cal-body-day");
      tooltip.classList.add("cal-tooltip");
      eventContain.classList.add("cal-event-container");
      monthDay.innerText = index;
      tooltip.innerText = "No events planned";
      monthDay.tabIndex = 1;
      monthDay.append(eventContain, tooltip);
      monthDays.push(monthDay);
    }

    if (month === d.getMonth()) {
      monthDays[d.getDate() + firstDay.getDay() - 1].classList.add(
        "cal-body-day-active"
      );
    }

    monthDays.forEach((monthDay) => {
      cal.appendChild(monthDay);
    });

    addEvents(firstDay.getDay(), monthDays, month, events);

    return [year, month];
  }
  currentData = drawCal(d.getFullYear(), d.getMonth());

  nextMonth.addEventListener("click", () => {
    if (currentData[1] + 1 > 11) {
      currentData[1] = 0;
      currentData[0]++;
      currMonth.innerText = monthes[currentData[1]] + " " + currentData[0];
      currentData = drawCal(currentData[0], currentData[1], events);
    } else {
      currentData[1]++;
      currMonth.innerText = monthes[currentData[1]] + " " + currentData[0];
      currentData = drawCal(currentData[0], currentData[1], events);
    }
  });

  prevMonth.addEventListener("click", () => {
    if (currentData[1] - 1 < 0) {
      currentData[1] = 11;
      currentData[0]--;
      currMonth.innerText = monthes[currentData[1]] + " " + currentData[0];
      currentData = drawCal(currentData[0], currentData[1], events);
    } else {
      currentData[1]--;
      currMonth.innerText = monthes[currentData[1]] + " " + currentData[0];
      currentData = drawCal(currentData[0], currentData[1], events);
    }
  });

  function addEvents(firstDay, days, month, events = []) {
    events.forEach((event) => {
      let day = event.day.getDate();
      let calDay = days[day + firstDay];

      let calEvent = document.createElement("div");
      calEvent.classList.add("cal-event");

      if (month == event.day.getMonth()) {
        if (calDay.children[1].textContent == "No events planned") {
          calDay.children[1].textContent = "";
        }
        calDay.children[0]
          .appendChild(calEvent)
          .style.setProperty("--bg-color", event.color);
        let tooltip = document.createElement("div");
        tooltip.innerText = `${event.name} - ${event.time}`;
        calDay.children[1].append(tooltip);
      }
    });
  }

  const createEvent = document.querySelector(".create-event-button");
  const openForm = document.querySelector(".event-form");
  const closeForm = document.querySelector(".form-return");
  const eventList = document.querySelector(".event-list");
  const eventForm = document.getElementById("event-form");

  createEvent.addEventListener("click", () => {
    openForm.classList.add("event-form-open");
  });

  closeForm.addEventListener("click", () => {
    openForm.classList.remove("event-form-open");
  });

  const events = [];
  const selected = new Set();
  eventForm.addEventListener("submit", (e) => {
    e.preventDefault();
    openForm.classList.remove("event-form-open");

    let eventItem = document.createElement("li");
    let eventClose = document.createElement("div");
    let eventName = document.createElement("h1");
    let eventDate = document.createElement("span");
    let eventTime = document.createElement("h3");

    let timeData = document.getElementById("event-time").value;
    let nameData = document.getElementById("event-title").value;
    let dateData = document.getElementById("event-date").value;
    let colorData = document.getElementById("event-color").value;
    if (dateData == "") {
      alert("Please enter a date");
      return false;
    } else if (timeData == "") {
      alert("Please enter a time");
      return false;
    }
    let newDateData = new Date(dateData);
    eventItem.style.setProperty("--bg-color", colorData);

    eventItem.classList.add("event-item");
    eventItem.appendChild(eventClose);

    eventClose.addEventListener("click", () => {
      eventList.removeChild(eventItem);
      events.splice(events.indexOf(eventItem), 1);
      drawCal(d.getFullYear(), d.getMonth(), events);
    });

    eventClose.innerHTML = "X";
    eventClose.classList.add("dismiss-event");
    eventItem.append(eventName, eventDate, eventTime);

    if (newDateData.getDay() + 1 > 6) {
      eventDate.innerText = `${weekdays[0]}, ${
        monthes[newDateData.getMonth()]
      } ${newDateData.getMonth() + 1}`;
    } else {
      eventDate.innerText = `${weekdays[newDateData.getDay() + 1]}, ${
        monthes[newDateData.getMonth()]
      } ${newDateData.getDate() + 1}`;
    }

    eventName.innerText = nameData;
    eventTime.innerText = timeData;

    eventList.appendChild(eventItem);

    let event = {
      time: timeData,
      day: newDateData,
      name: nameData,
      color: colorData,
    };

    events.push(event);
    drawCal(currentData[0], currentData[1], events);
  });
})(window);
