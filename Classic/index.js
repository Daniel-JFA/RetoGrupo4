"use strict";

//////////// GLOBAL VARIABLES /////////////////

let answers = {};
let numberOfQuestions = 51;

//////////// DOM ELEMENT SELECTION /////////////////
const startTest = document.querySelector(".start-test");
const start = document.querySelector(".btn-back");
const closeBtn = document.querySelector(".close-btn");
const modal = document.querySelector(".modal");
const ovelay = document.querySelector(".overlay");
const navContainer = document.querySelector(".modal-nav");
const modalContent = document.querySelectorAll(".modal-content");
const navbtns = document.querySelectorAll(".form-link");
const progress = document.getElementById("progreso");
const nav = document.querySelector(".nav");
const allSection = document.querySelectorAll(".section");
const navHeight = nav.getBoundingClientRect().height;
const header = document.querySelector(".header");
const allSections = document.querySelectorAll(".section");

//////////// HELPERS FUNCTIONS /////////////////
function getProgress() {
  return Math.ceil((Object.keys(answers).length / numberOfQuestions) * 100);
}

const countOccurrences = (arr) => {
  const counts = {};
  for (let value of arr) {
    counts[value] = (counts[value] || 0) + 1;
  }
  return counts;
};

function getScores() {
  const valuesList = Object.values(answers);
  console.log(valuesList);
  return countOccurrences(valuesList);
}

function setLocalStorage(id, value) {
  answers[id] = value;
  localStorage.setItem("estramipyme", JSON.stringify(answers));
}

function getLocalStorage() {
  const data = JSON.parse(localStorage.getItem("estramipyme"));
  if (!data) return;

  answers = data;

  for (const prop in answers) {
    if (answers.hasOwnProperty(prop)) {
      const input = document.querySelector(
        `.radioinput[data-id="${prop}-${answers[prop]}"]`
      );
      input.checked = true;
    }
  }
}
function reset() {
  localStorage.removeItem("estramipyme");
  progress.style.width = "0%";
}

function createForm(data, id) {
  // console.log(data)
  const form = createFormElement(data, id);
  const formContainer = document.querySelector(
    `#section--${id} .form-container`
  );
  formContainer.append(form);
  return form;
}

//////////// CALLBACK FUNCTION FOR EVENT HANDLING /////////////////

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry.isIntersecting)

  if (entry.isIntersecting) nav.classList.add("hidden");
  else nav.classList.remove("hidden");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `${-navHeight}px`,
});
headerObserver.observe(header);

const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  document
    .querySelectorAll(".nav__link")
    .forEach((link) => link.classList.remove("selected-link"));
  const id = entry.target.id;
  document
    .querySelector(`.nav__link[href="#${id}"]`)
    .classList.add("selected-link");
  // entry.target.classList.remove('section--hidden');
  // observer.unobserve(entry.target);
};
//////////// EVENT LISTENERS /////////////////

document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

startTest.addEventListener("click", function (e) {
  e.preventDefault();

  const id = e.target.getAttribute("href");
  // console.log(id)
  document.querySelector(id).scrollIntoView({ behavior: "smooth" });
});

// Passing "argument" into handler
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

const createFormElement = function (data, id) {
  const formElement = document.createElement("form");
  formElement.classList.add(`form--${id}`);
  data.forEach((q) => {
    const fieldset = document.createElement("fieldset");
    fieldset.classList.add("questions");
    fieldset.classList.add(`question--${q.id}`);
    fieldset.setAttribute("data-question-id", q.id);
    const legend = document.createElement("legend");
    legend.textContent = q.question;

    fieldset.append(legend);
    formElement.append(fieldset);
    q.options.forEach((op, index) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.setAttribute("type", "radio");
      input.setAttribute("name", `$Q${q.id}`);
      input.setAttribute("value", index);
      // label.append(input)
      label.innerHTML = `
      <input type="radio" name="Q${q.id}" value=${
        index + 1
      } class="radioinput radioinput__section--${id}" data-id="${q.id}-${
        index + 1
      }">${op}
      `;
      // label.insertAdjacentHTML('afterend', op);

      fieldset.append(label);
    });
  });
  return formElement;
};

//////////// API CALLS /////////////////

const loadPage = function () {
  fetch("http://localhost:3000/questions")
    .then((response) => {
      if (!response.ok) throw new Error("there is no data");
      return response.json();
    })
    .then((data) => {
      console.log(data);
      const clientData = data.filter((e) => e.section === "cliente");
      const businessData = data.filter((e) => e.section === "negocio");
      const coherencia = data.filter((e) => e.section === "coherencia");
      const alineacion = data.filter((e) => e.section === "alineacion");
      const circulo = data.filter((e) => e.section === "circulo");
      return [
        createForm(clientData, 1),
        createForm(businessData, 2),
        createForm(coherencia, 3),
        createForm(alineacion, 4),
        createForm(circulo, 5),
      ];
    })
    .then((forms) => {
      //get local storage
      getLocalStorage();
      progress.style.width = `${getProgress()}%`;

      // Add event listener to the forms
      forms.forEach((form) => {
        form.addEventListener("input", (e) => {
          const question = e.target.closest(".questions");
          setLocalStorage(question.dataset.questionId, e.target.value);

          progress.style.width = `${getProgress()}%`;
        });
      });
    });
};
loadPage();

//////////// OLD IMPLEMENTATIONS /////////////////

//progress bar
//function updateBar () {
//let allQuestion = 51;
//let valorSumado = 0;
//for (let i = 1; i <= allQuestion; i++) {
//  let valor = 0;
//  let radios = document.querySelectorAll(`.question${i}`);
//  for (let j = 0; j < radios.length; j++) {
//    if (radios[j].checked) {
//      valor = parseInt(radios[j].value);
//      break;
//    }

//  }

//  valorSumado += valor;

//}

//let average = (valorSumado / allQuestion) *100;
//document.querySelector('.progreso').value = average;
//}
// function update() {
//   let progress = document.getElementById('progreso');
//   let scrollY = window.scrollY;
//   let scrollHeight = document.body.scrollHeight;
//   let innerHeight = window.innerHeight;

//   let percentage = (scrollY / (scrollHeight - innerHeight)) * 100;

//   progress.style.width = `${percentage}%`;

//   requestAnimationFrame(update);
// }

// update();

//Implement forms from json server

// startTest.addEventListener("click", function () {
//   modal.classList.remove("hidden");
//   ovelay.classList.remove("hidden");
// })

// const cerrarModal = function () {
//   modal.classList.add("hidden");
//   ovelay.classList.add("hidden");
// }

// closeBtn.addEventListener("click", cerrarModal);

// let currentBtn = 1;
// const numberOfSlides = modalContent.length;

// const btnLeft = document.querySelector(".btn-back");
// const btnRight = document.querySelector(".btn-next");

// const goToBtn = function (index) {
//   // activar el boton

//   const clicked = document.querySelector(`.form-link[data-content="${index}"]`);

//   navbtns.forEach(
//     btn => btn.classList.remove("form__link--active")
//   )
//   clicked.classList.add("form__link--active");
//   currentBtn = index;
//   // activar el contenido
//   modalContent.forEach(
//     cnt => cnt.classList.remove("modal__content--active")
//   );
//   console.log(clicked.dataset.content)
//   document.querySelector(`.modal__content--${clicked.dataset.content}`).classList.add("modal__content--active")
// }

//navigation
// navContainer.addEventListener("click", function (e) {
//   console.log("click", e.target.closest(".form-link"));
//   const clicked = e.target.closest(".form-link");
//   if (!clicked) return;
//   goToBtn(clicked.dataset.content);
//   currentBtn = clicked.dataset.content;
// })

// btnRight.addEventListener("click", function () {
//   if (currentBtn < numberOfSlides) {
//     currentBtn++;
//     goToBtn(currentBtn)
//   } else return;
// })

// btnLeft.addEventListener("click", function () {
//   if (currentBtn > 1) {
//     currentBtn--;
//     goToBtn(currentBtn)
//   } else return;

// })

/*Radar Chart*/
const radarCtx = document.getElementById("myChart").getContext("2d");

let radarData = {
  labels: [
    "Coherencia del modelo de negocio",
    "Salud financiera",
    "Conocimiento del cliente",
    "Alineación en la comunicación interna",
    "Conocimiento del negocio",
  ],
  datasets: [
    {
      label: "Tu Radar",
      data: [2, 1, 2, 3, 2],
      fill: true,
      backgroundColor: "rgba(91, 100, 175, 0.2)",
      borderColor: "#5B64AF",
      pointBackgroundColor: "#5B64AF",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "#5B64AF",
    },
    {
      label: "Ideal",
      data: [4, 4, 4, 4, 4],
      fill: false,
      backgroundColor: "rgba(88, 176, 168, 0.2)",
      borderColor: "#58B0A8",
      pointBackgroundColor: "#58B0A8",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "#58B0A8",
    },
  ],
};

const radarOptions = {
  elements: {
    line: {
      borderWidth: 2,
    },
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context) {
          return context.dataset.label + ": " + context.raw;
        },
      },
    },
    legend: {
      labels: {
        font: {
          size: 16,
          family: "Lato",
        },
      },
    },
  },
  scales: {
    r: {
      ticks: {
        z: 10,
        beginAtZero: true,
        max: 4,
        stepSize: 1,
        font: {
          size: 16,
          family: "Lato",
        },
      },
      pointLabels: {
        font: {
          size: 16,
          color: "black",
          family: "Lato",
        },
      },
    },
  },
};
const radarChart = new Chart(radarCtx, {
  type: "radar",
  data: radarData,
  options: radarOptions,
});

const showResultsButton = document.querySelector(
  ".section-see-results .btn--show-modal"
);

if (showResultsButton) {
  showResultsButton.addEventListener("click", () => {
    const fieldsetIds = Array.from(
      document.querySelectorAll(".form-container fieldset")
    ).map((fieldset) => fieldset.getAttribute("data-question-id"));

    const unansweredFieldsets = fieldsetIds.filter(
      (id) => !answers.hasOwnProperty(id)
    );

    document
      .querySelectorAll(".form-container fieldset")
      .forEach((fieldset) => {
        fieldset.classList.remove("fieldset-error");
      });

    if (unansweredFieldsets.length > 0) {
      // Selecciona todos los fieldsets no respondidos
      const unansweredElements = document.querySelectorAll(
        `.form-container fieldset[data-question-id="${unansweredFieldsets.join(
          '"], .form-container fieldset[data-question-id="'
        )}"]`
      );

      // Añade la clase de error a todos los fieldsets no respondidos
      unansweredElements.forEach((fieldset) => {
        fieldset.classList.add("fieldset-error");
      });

      // Desplaza la vista para que todos los fieldsets sean visibles
      if (unansweredElements.length > 0) {
        unansweredElements[0].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    } else {
      console.log("Todas las preguntas han sido respondidas.");
      const radarSection = document.querySelector(".section-radar");
      if (radarSection) {
        radarSection.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  });
}
