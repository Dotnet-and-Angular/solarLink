import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    @Input() isDarkMode = false;
    @Output() toggleTheme = new EventEmitter<void>();

    onToggle(): void {
        this.toggleTheme.emit();
    }
}
