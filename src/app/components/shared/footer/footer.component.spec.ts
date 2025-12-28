import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/angular';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
    it('should render footer links', async () => {
        const { getByText } = await render(FooterComponent);

        expect(getByText('©2025 All Rights Reserved SolarLink.')).toBeTruthy();
    });
});
