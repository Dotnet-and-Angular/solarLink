import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-status-banner',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './status-banner.component.html',
    styleUrl: './status-banner.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBannerComponent {
    @Input() severity: 'danger' | 'warning' | 'success' | 'info' = 'info';
    @Input() title: string = 'System Status';
    @Input() message: string = '';
    @Input() actionText: string = '';
    @Input() isHidden: boolean = false;

    @Output() actionClick = new EventEmitter<void>();
    @Output() closed = new EventEmitter<void>();

    onActionClick(): void {
        this.actionClick.emit();
    }

    onClose(): void {
        this.closed.emit();
    }
}
