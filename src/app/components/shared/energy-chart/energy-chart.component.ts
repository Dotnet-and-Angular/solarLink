import {
    Component,
    Input,
    OnInit,
    ViewChild,
    ElementRef,
    ChangeDetectionStrategy,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnergyDataPoint } from '../../../models/solar-system.model';

interface ChartData {
    label: string;
    value: number;
}

@Component({
    selector: 'app-energy-chart',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './energy-chart.component.html',
    styleUrl: './energy-chart.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnergyChartComponent implements OnInit, OnChanges {
    @Input() energyData: EnergyDataPoint[] = [];
    @Input() title: string = 'Energy Generation vs Consumption (24h)';
    @Input() showLegend: boolean = true;
    @Input() showStats: boolean = true;

    @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;

    width = 1000;
    height = 400;
    margin = { top: 20, right: 20, bottom: 40, left: 60 };

    chartWidth = 0;
    chartHeight = 0;

    svgViewBox = '';

    generatedPath = '';
    consumedPath = '';
    generatedPoints: { x: number; y: number }[] = [];
    consumedPoints: { x: number; y: number }[] = [];
    xAxisLabels: string[] = [];
    yAxisLabels: string[] = [];
    gridLines: number[] = [];

    peakGeneration = 0;
    avgConsumption = 0;
    surplusEnergy = 0;

    ngOnInit(): void {
        this.calculateDimensions();
        this.updateChart();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['energyData'] && !changes['energyData'].firstChange) {
            this.updateChart();
        }
    }

    private calculateDimensions(): void {
        this.chartWidth = this.width - this.margin.left - this.margin.right;
        this.chartHeight = this.height - this.margin.top - this.margin.bottom;
        this.svgViewBox = `0 0 ${this.width} ${this.height}`;
    }

    private updateChart(): void {
        if (this.energyData.length === 0) return;

        const generatedValues = this.energyData.map((d) => d.generatedKwh);
        const consumedValues = this.energyData.map((d) => d.consumedKwh);

        const maxGenerated = Math.max(...generatedValues, 1);
        const maxConsumed = Math.max(...consumedValues, 1);
        const maxValue = Math.max(maxGenerated, maxConsumed);

        // Generate grid lines and Y-axis labels
        this.generateGridLines(maxValue);

        // Calculate points
        this.generatedPoints = this.calculatePoints(generatedValues, maxValue);
        this.consumedPoints = this.calculatePoints(consumedValues, maxValue);

        // Generate paths
        this.generatedPath = this.generatePath(this.generatedPoints);
        this.consumedPath = this.generatePath(this.consumedPoints);

        // Generate axis labels
        this.generateAxisLabels();

        // Calculate stats
        this.calculateStats();
    }

    private calculatePoints(
        values: number[],
        maxValue: number
    ): { x: number; y: number }[] {
        return values.map((value, index) => {
            const x = this.margin.left + (index / (values.length - 1)) * this.chartWidth;
            const y =
                this.height -
                this.margin.bottom -
                (value / maxValue) * this.chartHeight;
            return { x, y };
        });
    }

    private generatePath(points: { x: number; y: number }[]): string {
        if (points.length === 0) return '';

        let path = `M ${points[0].x} ${points[0].y}`;

        for (let i = 1; i < points.length; i++) {
            const p1 = points[i - 1];
            const p2 = points[i];
            const cp1x = p1.x + (p2.x - p1.x) / 3;
            const cp1y = p1.y;
            const cp2x = p2.x - (p2.x - p1.x) / 3;
            const cp2y = p2.y;

            path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
        }

        return path;
    }

    private generateGridLines(maxValue: number): void {
        this.gridLines = [];
        for (let i = 0; i <= 4; i++) {
            this.gridLines.push(this.height - this.margin.bottom - (i / 4) * this.chartHeight);
        }

        this.yAxisLabels = [];
        for (let i = 4; i >= 0; i--) {
            const value = Math.round((i / 4) * maxValue);
            this.yAxisLabels.push(value.toString());
        }
    }

    private generateAxisLabels(): void {
        this.xAxisLabels = [];
        const interval = Math.ceil(this.energyData.length / 6);

        for (let i = 0; i < this.energyData.length; i += interval) {
            const time = this.energyData[i].timestamp;
            const hours = time.getHours().toString().padStart(2, '0');
            this.xAxisLabels.push(`${hours}:00`);
        }
    }

    private calculateStats(): void {
        const generated = this.energyData.map((d) => d.generatedKwh);
        const consumed = this.energyData.map((d) => d.consumedKwh);

        this.peakGeneration = parseFloat(Math.max(...generated).toFixed(2));
        this.avgConsumption = parseFloat(
            (consumed.reduce((a, b) => a + b, 0) / consumed.length).toFixed(2)
        );
        const totalGenerated = generated.reduce((a, b) => a + b, 0);
        const totalConsumed = consumed.reduce((a, b) => a + b, 0);
        this.surplusEnergy = parseFloat((totalGenerated - totalConsumed).toFixed(2));
    }
}
