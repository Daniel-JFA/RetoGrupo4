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
  preguntas = [
    {
      "id": 1,
      "section": "cliente",
      "question": "¿Qué tan precisa es la información demográfica de sus clientes (edad, género, ubicación, etc.) en su base de datos?",
      "options": ["Notengo", "Muy poco", "Buena", "excelente"]
    },
    {
      "id": 2,
      "section": "cliente",
      "question": "¿Qué tan bien comprende el historial de compras las preferencias y los patrones de gastos de sus clientes?",
      "options": ["Lo desconozco", "Muy poco", "Bien", "Excelente"]
    },
    {
      "id": 3,
      "section": "cliente",
      "question": "¿Qué tan bien identifica las necesidades, deseos y motivaciones de sus diferentes segmentos de clientes?",
      "options": ["Lo desconozco", "Muy poco", "Bien", "Excelente"]
    },
    {
      "id": 4,
      "section": "cliente",
      "question": "¿Qué tan bien conoce los canales de comunicación preferidos de sus clientes (correo electrónico, redes sociales, teléfono, etc.)?",
      "options": ["No los conozco", "Muy poco", "Bien", "Excelente"]
    },
    {
      "id": 5,
      "section": "cliente",
      "question": "¿Qué tan bien mide y comprende la satisfacción de sus clientes con sus productos, servicios y experiencias?",
      "options": ["No los mido", "Muy poco", "Bien", "Excelente"]
    },
    {
      "id": 6,
      "section": "cliente",
      "question": "¿Qué tan bien identifica y retiene a sus clientes más valiosos y leales?",
      "options": ["No lo aplico", "Muy poco", "Bien", "Excelente"]
    },
    {
      "id": 7,
      "section": "cliente",
      "question": "¿Qué tan efectiva es su segmentación de clientes para crear campañas y ofertas personalizadas?",
      "options": ["No lo aplico", "Muy poco", "Bien", "Excelente"]
    },
    {
      "id": 8,
      "section": "cliente",
      "question": "¿Qué tan bien utiliza los datos de sus clientes para obtener información y tomar decisiones estratégicas?",
      "options": ["No la utilizo", "Muy poco", "Bien", "Excelente"]
    }
  ]


  constructor(el: ElementRef) {
    this.el = el;
    console.log("constructor de la clase app");
  }


  ngOnInit() {
    console.log("ngOnInit");
    //const startTest = document.querySelector(".start-test");
    const startTest = this.el.nativeElement.querySelector(".start-test")

    startTest.addEventListener("click", this._handlerStartTest)

    //this._createForm(this.preguntas, 1)
    this._fetchData()

  }

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
