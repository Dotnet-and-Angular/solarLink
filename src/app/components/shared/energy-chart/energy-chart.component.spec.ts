import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnergyChartComponent } from './energy-chart.component';
import { EnergyDataPoint } from '../../../models/solar-system.model';

describe('EnergyChartComponent', () => {
    let component: EnergyChartComponent;
    let fixture: ComponentFixture<EnergyChartComponent>;

    const mockEnergyData: EnergyDataPoint[] = [
        { timestamp: new Date(2024, 0, 1, 6), generatedKwh: 0, consumedKwh: 0.5, temperature: 22, irradiance: 0 },
        { timestamp: new Date(2024, 0, 1, 7), generatedKwh: 2, consumedKwh: 1, temperature: 24, irradiance: 150 },
        { timestamp: new Date(2024, 0, 1, 8), generatedKwh: 5, consumedKwh: 1.5, temperature: 26, irradiance: 400 },
        { timestamp: new Date(2024, 0, 1, 12), generatedKwh: 8, consumedKwh: 2, temperature: 32, irradiance: 850 },
        { timestamp: new Date(2024, 0, 1, 16), generatedKwh: 4, consumedKwh: 1.8, temperature: 30, irradiance: 500 },
        { timestamp: new Date(2024, 0, 1, 18), generatedKwh: 1, consumedKwh: 2, temperature: 26, irradiance: 100 },
        { timestamp: new Date(2024, 0, 1, 20), generatedKwh: 0, consumedKwh: 1.5, temperature: 22, irradiance: 0 },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EnergyChartComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EnergyChartComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
        expect(component.title).toBe('Energy Generation vs Consumption (24h)');
        expect(component.showLegend).toBe(true);
        expect(component.showStats).toBe(true);
        expect(component.energyData).toEqual([]);
    });

    it('should set custom title', () => {
        component.title = 'Custom Chart Title';
        fixture.detectChanges();
        const title = fixture.nativeElement.querySelector('.energy-chart__title');
        expect(title.textContent).toContain('Custom Chart Title');
    });

    it('should hide legend when showLegend is false', () => {
        component.showLegend = false;
        fixture.detectChanges();
        const legend = fixture.nativeElement.querySelector('.energy-chart__legend');
        expect(legend).toBeNull();
    });

    it('should hide stats when showStats is false', () => {
        component.energyData = mockEnergyData;
        component.showStats = false;
        fixture.detectChanges();
        const stats = fixture.nativeElement.querySelector('.energy-chart__stats');
        expect(stats).toBeNull();
    });

    it('should calculate dimensions on init', () => {
        component.ngOnInit();
        expect(component.chartWidth).toBe(920); // width - margin.left - margin.right
        expect(component.chartHeight).toBe(340); // height - margin.top - margin.bottom
        expect(component.svgViewBox).toBe('0 0 1000 400');
    });

    it('should generate grid lines', () => {
        component.energyData = mockEnergyData;
        component.ngOnInit();
        expect(component.gridLines.length).toBe(5);
        expect(component.yAxisLabels.length).toBe(5);
    });

    it('should calculate chart points', () => {
        component.energyData = mockEnergyData;
        component.ngOnInit();
        expect(component.generatedPoints.length).toBe(mockEnergyData.length);
        expect(component.consumedPoints.length).toBe(mockEnergyData.length);
    });

    it('should generate paths for curves', () => {
        component.energyData = mockEnergyData;
        component.ngOnInit();
        expect(component.generatedPath).toBeTruthy();
        expect(component.consumedPath).toBeTruthy();
        expect(component.generatedPath).toContain('M ');
        expect(component.generatedPath).toContain('C ');
    });

    it('should generate x-axis labels', () => {
        component.energyData = mockEnergyData;
        component.ngOnInit();
        expect(component.xAxisLabels.length).toBeGreaterThan(0);
        expect(component.xAxisLabels[0]).toMatch(/\d{2}:00/);
    });

    it('should calculate peak generation', () => {
        component.energyData = mockEnergyData;
        component.ngOnInit();
        expect(component.peakGeneration).toBe(8);
    });

    it('should calculate average consumption', () => {
        component.energyData = mockEnergyData;
        component.ngOnInit();
        const expected = (0.5 + 1 + 1.5 + 2 + 1.8 + 2 + 1.5) / 7;
        expect(component.avgConsumption).toBeCloseTo(expected, 2);
    });

    it('should calculate surplus energy', () => {
        component.energyData = mockEnergyData;
        component.ngOnInit();
        const totalGenerated = 20;
        const totalConsumed = 10.3;
        const expected = totalGenerated - totalConsumed;
        expect(component.surplusEnergy).toBeCloseTo(expected, 2);
    });

    it('should update chart on data changes', () => {
        component.ngOnInit();
        const initialPathLength = component.generatedPath.length;

        component.energyData = mockEnergyData;
        component.ngOnChanges({
            energyData: { previousValue: [], currentValue: mockEnergyData, firstChange: false, isFirstChange: () => false },
        });

        expect(component.generatedPath.length).toBeGreaterThan(initialPathLength);
    });

    it('should render energy chart container', () => {
        fixture.detectChanges();
        const container = fixture.nativeElement.querySelector('.energy-chart__container');
        expect(container).toBeTruthy();
    });

    it('should render SVG element', () => {
        fixture.detectChanges();
        const svg = fixture.nativeElement.querySelector('.energy-chart__svg');
        expect(svg).toBeTruthy();
    });

    it('should display legend items when showLegend is true', () => {
        component.showLegend = true;
        fixture.detectChanges();
        const legendItems = fixture.nativeElement.querySelectorAll('.legend-item');
        expect(legendItems.length).toBe(2);
    });

    it('should display stats section when data is available and showStats is true', () => {
        component.energyData = mockEnergyData;
        component.showStats = true;
        component.ngOnInit();
        fixture.detectChanges();
        const stats = fixture.nativeElement.querySelector('.energy-chart__stats');
        expect(stats).toBeTruthy();
    });

    it('should handle empty energy data gracefully', () => {
        component.energyData = [];
        component.ngOnInit();
        expect(component.generatedPath).toBe('');
        expect(component.consumedPath).toBe('');
    });

    it('should use OnPush change detection', () => {
        const metadata = (component.constructor as any).ɵcmp;
        expect(metadata.changeDetection).toBe(1); // ChangeDetectionStrategy.OnPush = 1
    });
});
