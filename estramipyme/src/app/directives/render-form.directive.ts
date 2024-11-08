import { Directive, inject, ElementRef, signal, Input } from '@angular/core';
import { DataProcService } from '@services/data-proc.service';
import { Question } from '@models/question.model';
import { GlobalProviderService } from '@services/global-provider.service';

@Directive({
  selector: '[appRenderForm]',
  standalone: true,
})
export class RenderFormDirective {
  element = inject(ElementRef);
  questions = signal<Question[]>([]);
  @Input({ required: true }) url!: string;

  private dataProc = inject(DataProcService);
  private form!: HTMLFormElement | undefined;
  private provider!: GlobalProviderService;

  constructor(provider: GlobalProviderService) {
    this.provider = provider;
  }

  ngOnInit() {
    this.dataProc.getItems(this.url).subscribe({
      next: (questions) => {
        this.questions.set(questions);
        this._createForm(questions, 1);
        this._getLocalStorage();

        this.element.nativeElement
          .querySelector('.form--1')
          .addEventListener('input', (e: Event) => {
            const target = e.target as unknown as HTMLInputElement;
            const question: HTMLElement | null = target.closest('.questions');
            if (question)
              this.provider.setLocalStorage(
                question.dataset['questionId']!,
                target.value
              );
          });
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.provider.Progress$.subscribe((progress) => {
      if (progress === 0)
        this.element.nativeElement.querySelector('.form--1').reset();
    });
  }

  _createForm(data: Question[], id: String | number) {
    const form = this._createFormElement(data, id);
    const formContainer = this.element.nativeElement as HTMLElement;
    formContainer.append(form);
    return form;
  }

  _createFormElement(data: Question[], id: String | number) {
    const formElement = document.createElement('form');
    formElement.classList.add(`form--${id}`);
    data.forEach((q: Question) => {
      const fieldset = document.createElement('fieldset');
      fieldset.classList.add('questions');
      fieldset.classList.add(`question--${q.id}`);
      fieldset.setAttribute('data-question-id', String(q.id));
      const legend = document.createElement('legend');
      legend.textContent = q.question;

      fieldset.append(legend);
      formElement.append(fieldset);
      q.options.forEach((op: String, index: any) => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.setAttribute('type', 'radio');
        input.setAttribute('name', `$Q${q.id}`);
        input.setAttribute('value', index);
        label.innerHTML = `
      <input type="radio" name="Q${q.id}" value=${
          index + 1
        } class="radioinput radioinput__section--${id}" data-id="${q.id}-${
          index + 1
        }">${op}
      `;

        fieldset.append(label);
      });
    });
    return formElement;
  }

  _getLocalStorage() {
    this.provider.getLocalStorage();
    if (!this.provider.answers()) return;
    for (const prop in this.provider.answers()) {
      if (this.provider.answers().hasOwnProperty(prop)) {
        const answer = this.provider.answers();
        const input: HTMLInputElement =
          this.element.nativeElement.querySelector(
            `.radioinput[data-id="${prop}-${
              answer[prop as keyof typeof answer]
            }"]`
          ) as HTMLInputElement;
        if (input) {
          input.checked = true;
        }
      }
    }
  }
}
