import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationComponent } from './navigation.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('NavigationComponent', () => {
    let component: NavigationComponent;
    let fixture: ComponentFixture<NavigationComponent>;
    let debugElement: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NavigationComponent, RouterTestingModule],
        }).compileComponents();

        fixture = TestBed.createComponent(NavigationComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display logo', () => {
        const logo = debugElement.query(By.css('.nav-logo'));
        expect(logo).toBeTruthy();
        expect(logo.nativeElement.textContent).toContain('SolarLink');
    });

    it('should display logo icon', () => {
        const logoIcon = debugElement.query(By.css('.logo-icon'));
        expect(logoIcon).toBeTruthy();
        expect(logoIcon.nativeElement.textContent).toBe('☀️');
    });

    it('should display navigation links', () => {
        const navLinks = debugElement.queryAll(By.css('.nav-link'));
        expect(navLinks.length).toBe(2);
    });

    it('should display Customer Dashboard link', () => {
        const links = debugElement.queryAll(By.css('.nav-link'));
        expect(links[0].nativeElement.textContent).toContain('Customer Dashboard');
    });

    it('should display Admin Dashboard link', () => {
        const links = debugElement.queryAll(By.css('.nav-link'));
        expect(links[1].nativeElement.textContent).toContain('Admin Dashboard');
    });

    it('should have router links configured', () => {
        const links = debugElement.queryAll(By.css('.nav-link'));
        const customerLink = links[0].nativeElement;
        const adminLink = links[1].nativeElement;

        expect(customerLink.getAttribute('routerlink')).toBe('/customer');
        expect(adminLink.getAttribute('routerlink')).toBe('/admin');
    });

    it('should apply active class on current route', () => {
        const links = debugElement.queryAll(By.css('.nav-link'));
        fixture.detectChanges();
        // One link should have the active class based on current route
        const hasActive = links.some(link =>
            link.nativeElement.classList.contains('active')
        );
        expect(hasActive).toBe(true);
    });

    it('should have navigation container', () => {
        const container = debugElement.query(By.css('.nav-container'));
        expect(container).toBeTruthy();
    });

    it('should have main navigation element', () => {
        const nav = debugElement.query(By.css('.main-navigation'));
        expect(nav).toBeTruthy();
    });

    it('should use OnPush change detection', () => {
        const metadata = (component.constructor as any).ɵcmp;
        expect(metadata.changeDetection).toBe(1); // ChangeDetectionStrategy.OnPush = 1
    });

    it('should display nav icons', () => {
        const icons = debugElement.queryAll(By.css('.nav-icon'));
        expect(icons.length).toBe(2);
        expect(icons[0].nativeElement.textContent).toBe('👤');
        expect(icons[1].nativeElement.textContent).toBe('🛠️');
    });

    it('should apply router link active styling', () => {
        const links = debugElement.queryAll(By.css('.nav-link'));
        const activeLink = links.find(link =>
            link.nativeElement.classList.contains('active')
        );
        expect(activeLink).toBeTruthy();
    });
});
