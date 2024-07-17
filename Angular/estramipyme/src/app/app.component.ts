import {Component, ElementRef, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'estramipyme';
  el;


  constructor(el: ElementRef) {
    this.el = el;
    console.log("constructor de la clase app");
  }


  ngOnInit() {
    console.log("ngOnInit");
    //const startTest = document.querySelector(".start-test");
    console.log("elemento nava")
    const nav = this.el.nativeElement.querySelector(".nav");
    console.log(nav);
    const startTest = this.el.nativeElement.querySelector(".start-test")

    startTest.addEventListener("click", this._handlerStartTest)
    //cargar formularios desde json server
    this._fetchData()

    // Hacer el fade in de la barra de navegacón
    nav.addEventListener("mouseover", this._handleHover.bind(0.5));
    nav.addEventListener("mouseout", this._handleHover.bind(1));
    const sectionObserver = new IntersectionObserver(this._revealSection, {
      root: null,
      threshold: 0.15,
    });
  }

  _fadeInNavBar() {
  }

  _revealSection(entries: any, observer: any) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    document
      .querySelectorAll(".nav__link")
      .forEach((link) => link.classList.remove("selected-link"));
    const id = entry.target.id;
    const element = this.el.nativeElement.querySelector(`.nav__link[href="#${id}"]`);
    console.log(element)

    this.el.nativeElement.querySelector(`.nav__link[href="#${id}"]`)
      .classList.add("selected-link");
    // entry.target.classList.remove('section--hidden');
    // observer.unobserve(entry.target);
  };

  _handleHover(e: any) {
    if (e.target.classList.contains("nav__link")) {
      const link = e.target;
      const siblings = link.closest(".nav").querySelectorAll(".nav__link");
      const logo = link.closest(".nav").querySelector("img");

      siblings.forEach((el: any) => {
        if (el !== link) el.style.opacity = this;
      });
      logo.style.opacity = this;
    }
  };

  _handlerStartTest(e: any) {
    e.preventDefault();

    const id = e.target.getAttribute("href");
    // console.log(id)
    document.querySelector(id).scrollIntoView({behavior: "smooth"});
  }

  _createForm(data: any, id: any) {
    // console.log(data)
    const form = this._createFormElement(data, id);
    const formContainer = this.el.nativeElement.querySelector(
      `#section--${id} .form-container`
    );
    formContainer.append(form);
    return form;
  }

  _fetchData() {
    fetch("http://localhost:3000/questions")
      .then((response) => {
        if (!response.ok) throw new Error("there is no data");
        return response.json();
      })
      .then((data) => {
        console.log(data);
        const clientData = data.filter((e: any) => e.section === "cliente");
        const businessData = data.filter((e: any) => e.section === "negocio");
        const coherencia = data.filter((e: any) => e.section === "coherencia");
        const alineacion = data.filter((e: any) => e.section === "alineacion");
        const circulo = data.filter((e: any) => e.section === "circulo");
        return [
          this._createForm(clientData, 1),
          this._createForm(businessData, 2),
          this._createForm(coherencia, 3),
          this._createForm(alineacion, 4),
          this._createForm(circulo, 5),
        ];
      })
      .then((forms) => {
        //get local storage
        //getLocalStorage();
        //progress.style.width = `${getProgress()}%`;

        // Add event listener to the forms
        forms.forEach((form) => {
          form.addEventListener("input", (e) => {
            //const question = e.target.closest(".questions");
            //setLocalStorage(question.dataset.questionId, e.target.value);

            //progress.style.width = `${getProgress()}%`;
          });
        });
      });
  }

  _createFormElement = function (data: any, id: any) {
    const formElement = document.createElement("form");
    formElement.classList.add(`form--${id}`);
    data.forEach((q: any) => {
      const fieldset = document.createElement("fieldset");
      fieldset.classList.add("questions");
      fieldset.classList.add(`question--${q.id}`);
      fieldset.setAttribute("data-question-id", q.id);
      const legend = document.createElement("legend");
      legend.textContent = q.question;

      fieldset.append(legend);
      formElement.append(fieldset);
      q.options.forEach((op: any, index: any) => {
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
}
