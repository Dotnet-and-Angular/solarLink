import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/angular';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
    it('should render and toggle theme', async () => {
        const { getByText } = await render(HeaderComponent, {
            componentProperties: { isDarkMode: false }
        });

        expect(getByText('Sign Up')).toBeTruthy();
    });
});
