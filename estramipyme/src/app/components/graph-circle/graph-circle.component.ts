import { Component, ElementRef, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import { GlobalProviderService } from '@services/global-provider.service';

export interface Circle {
  what: number[];
  how: number[];
  why: number[];
}

@Component({
  selector: 'app-graph-circle',
  standalone: true,
  imports: [],
  templateUrl: './graph-circle.component.html',
  styleUrl: './graph-circle.component.css',
})
export class GraphCircleComponent {
  chart!: echarts.ECharts;
  @ViewChild('circle') circleEl!: ElementRef;
  globalProvider!: GlobalProviderService;

  constructor(private el: ElementRef, globalProvider: GlobalProviderService) {
    this.globalProvider = globalProvider;
  }

  ngOnInit() {
    this.globalProvider.CircleData$.subscribe((value: Circle) => {
      if (this.circleEl) this.renderCicle(value);
    });
  }

  renderCicle(value: Circle) {
    this.chart = echarts.init(this.circleEl.nativeElement);

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: ({d}%)',
      },
      series: [
        {
          name: '¿Por qué?',
          type: 'pie',
          selectedMode: 'single',
          radius: [0, '30%'],
          label: {
            show: true,
            position: 'inside',
            fontSize: 14,
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              value: value.why[0],
              name: '¿Por qué?',
              itemStyle: { color: '#E5A900' },
            },
            { value: value.why[1], name: '', itemStyle: { color: 'none' } },
          ],
        },
        {
          name: '¿Cómo?',
          type: 'pie',
          radius: ['30%', '50%'],
          label: {
            show: true,
            position: 'inside',
            fontSize: 14,
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              value: value.how[0],
              name: '¿Cómo?',
              itemStyle: { color: '#F7C600' },
            },
            { value: value.how[1], name: '', itemStyle: { color: 'none' } },
          ],
        },
        {
          name: '¿Qué?',
          type: 'pie',
          radius: ['50%', '70%'],
          label: {
            show: true,
            position: 'inside',
            fontSize: 14,
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              value: value.what[0],
              name: '¿Qué?',
              itemStyle: { color: '#F8D300 ' },
            },
            { value: value.what[1], name: '', itemStyle: { color: 'none' } },
          ],
        },
      ],
    };
    this.chart.setOption(option);
  }
}
