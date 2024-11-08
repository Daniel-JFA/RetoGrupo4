import {Component} from '@angular/core';
import { GraphCircleComponent } from "../graph-circle/graph-circle.component";
import { GraphsComponent } from "../graphs/graphs.component";




@Component({
  selector: 'app-pdf-generator',
  standalone: true,
  imports: [GraphCircleComponent, GraphsComponent],
  templateUrl: './pdf-generator.component.html',
  styleUrl: './pdf-generator.component.css'
})

export class PdfGeneratorComponent {
  clickPdf(){
    alert('Aquí tienes tu reporte')
  }
}


