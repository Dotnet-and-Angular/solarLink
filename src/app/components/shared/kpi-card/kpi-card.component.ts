import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-kpi-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './kpi-card.component.html',
    styleUrl: './kpi-card.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KPICardComponent {
    @Input() title: string = '';
    @Input() subtitle: string = '';
    @Input() value: string | number | null = '';
    @Input() unit: string = '';
    @Input() valueColor: 'success' | 'danger' | 'warning' | 'accent' | 'primary' = 'primary';
    @Input() changeValue: number | null = null;
    @Input() footerText: string = '';
    @Input() isLoading: boolean = false;

    protected readonly Math = Math;

    get changeType(): 'positive' | 'negative' | 'neutral' {
        if (this.changeValue === null) return 'neutral';
        return this.changeValue > 0 ? 'positive' : this.changeValue < 0 ? 'negative' : 'neutral';
    }
}
