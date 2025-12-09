/**
 * Component Tests
 * Basic smoke tests for React components
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('Component Smoke Tests', () => {
    it('should pass basic rendering test', () => {
        render(<div data-testid="test">Hello World</div>);
        expect(screen.getByTestId('test')).toBeInTheDocument();
        expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('should render elements with proper attributes', () => {
        render(
            <button data-testid="btn" disabled>
                Click me
            </button>
        );
        const button = screen.getByTestId('btn');
        expect(button).toBeDisabled();
        expect(button).toHaveTextContent('Click me');
    });

    it('should handle className correctly', () => {
        render(<div data-testid="styled" className="test-class another-class" />);
        expect(screen.getByTestId('styled')).toHaveClass('test-class');
        expect(screen.getByTestId('styled')).toHaveClass('another-class');
    });
});
