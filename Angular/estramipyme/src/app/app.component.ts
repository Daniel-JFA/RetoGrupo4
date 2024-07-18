import {Component, ElementRef, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {Element} from "@angular/compiler";
import {isEmpty} from "rxjs";

interface Question {
  id: number;
  section: "cliente" | "negocio" | "coherencia" | "alineacion" | "circulo";
  question: string;
  options: string[];
}

type Answers = {} | {
  [key: string | number]: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title: String = 'estramipyme';
  private answers: any = {};
  private el: ElementRef;
  private numberOfQuestions = 50;
  #nav: HTMLHtmlElement | any;
  #navHeight: HTMLHtmlElement | any;
  #header: HTMLHtmlElement | any;
  #allSections: HTMLHtmlElement | any;
  #progress: HTMLHtmlElement | any;


  constructor(el: ElementRef) {
    this.el = el;
    console.log("constructor de la clase app");
  }


  ngOnInit() {
    console.log("ngOnInit");

    //const startTest = document.querySelector(".start-test");
    console.log("elemento nava")
    this.#nav = this.el.nativeElement.querySelector(".nav");
    this.#navHeight = this.#nav.getBoundingClientRect().height;
    const startTest = this.el.nativeElement.querySelector(".start-test")
    this.#header = this.el.nativeElement.querySelector(".header");
    this.#allSections = this.el.nativeElement.querySelectorAll(".section");
    this.#progress = document.getElementById("progreso");

    startTest.addEventListener("click", this._handlerStartTest.bind(this))
    //cargar formularios desde json server
    this._fetchData()

    // Hacer el fade in de la barra de navegacón
    this.#nav.addEventListener("mouseover", this._handleHover.bind(0.5));
    this.#nav.addEventListener("mouseout", this._handleHover.bind(1));
    const sectionObserver = new IntersectionObserver(this._revealSection.bind(this), {
      root: null,
      threshold: 0.15,
    });
    this.#allSections.forEach(function (section: HTMLHtmlElement) {
      sectionObserver.observe(section);
      section.classList.add("section--hidden");
    });
    const headerObserver = new IntersectionObserver(this._createStickyNav.bind(this), {
      root: null,
      threshold: 0,
      rootMargin: `${this.#navHeight}px`,
    });
    headerObserver.observe(this.#header);

  }

  _revealSection(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
    console.log("reveal section")
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    this.el.nativeElement
      .querySelectorAll(".nav__link")
      .forEach((link: HTMLElement) => link.classList.remove("selected-link"));
    const id: String = entry.target.id;
    const element: HTMLHtmlElement = this.el.nativeElement.querySelector(`.nav__link[href="#${id}"]`);

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

  _handlerStartTest(e: MouseEvent) {
    console.log("event targe")
    const target = e.target as unknown as HTMLElement;
    e.preventDefault();

    const id: String | null = target.getAttribute("href");
    //console.log(id);
    // console.log(id)
    this.el.nativeElement.querySelector(id).scrollIntoView({behavior: "smooth"});
  }

  _createForm(data: Question[], id: String | number) {
    // console.log(data)
    const form = this._createFormElement(data, id);
    const formContainer = this.el.nativeElement.querySelector(
      `#section--${id} .form-container`
    );
    formContainer.append(form);
    return form;
  }

  _getProgress() {
    if (!this.answers) return 0;
    if (!this.numberOfQuestions) return 0;
    return Math.ceil((Object.keys(this.answers).length / this.numberOfQuestions) * 100);
  }

  _fetchData() {
    fetch("http://localhost:3000/questions")
      .then((response) => {
        if (!response.ok) throw new Error("there is no data");
        return response.json();
      })
      .then((data: Question[]) => {
        this.numberOfQuestions = data.length;
        //console.log(data);
        const
          clientData = data.filter((e: Question) => e.section === "cliente");
        const businessData = data.filter((e: Question) => e.section === "negocio");
        const coherencia = data.filter((e: Question) => e.section === "coherencia");
        const alineacion = data.filter((e: Question) => e.section === "alineacion");
        const circulo = data.filter((e: Question) => e.section === "circulo");
        return [
          this._createForm(clientData, 1),
          this._createForm(businessData, 2),
          this._createForm(coherencia, 3),
          this._createForm(alineacion, 4),
          this._createForm(circulo, 5),
        ];
      })
      .then((forms: HTMLFormElement[]) => {
        //get local storage
        this._getLocalStorage();
        this.#progress.style.width = `${this._getProgress()}%`;

        // Add event listener to the forms
        forms.forEach((form) => {
          form.addEventListener("input", (e) => {
            const target = e.target as unknown as HTMLInputElement;
            const question: HTMLElement | null = target.closest(".questions");
            if (question) this._setLocalStorage(question.dataset["questionId"], target.value);
            this.#progress.style.width = `${this._getProgress()}%`;
          });
        });
      });
  }

  _setLocalStorage(id: any, value: any) {

    this.answers[id] = value;
    localStorage.setItem("estramipyme", JSON.stringify(this.answers));
  }

  _getLocalStorage() {
    const storedDataString = localStorage.getItem("estramipyme");
    if (storedDataString == null) return;
    const data: object = JSON.parse(storedDataString);
    if (!data) return;
    this.answers = data;
    if (!this.answers) return;
    for (const prop in this.answers) {
      if (this.answers.hasOwnProperty(prop)) {
        const input: HTMLInputElement = this.el.nativeElement.querySelector(
          `.radioinput[data-id="${prop}-${this.answers[prop as keyof typeof this.answers]}"]`
        );
        input.checked = true;
      }
    }
  }

  _createFormElement(data: Question[], id: String | number) {
    const formElement = document.createElement("form");
    formElement.classList.add(`form--${id}`);
    data.forEach((q: Question) => {
      const fieldset = document.createElement("fieldset");
      fieldset.classList.add("questions");
      fieldset.classList.add(`question--${q.id}`);
      fieldset.setAttribute("data-question-id", String(q.id));
      const legend = document.createElement("legend");
      legend.textContent = q.question;

      fieldset.append(legend);
      formElement.append(fieldset);
      q.options.forEach((op: String, index: any) => {
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

  _createStickyNav(entries: any) {
    const [entry] = entries;
    if (entry.isIntersecting) this.#nav.classList.add("hidden");
    else this.#nav.classList.remove("hidden");
  };
}


