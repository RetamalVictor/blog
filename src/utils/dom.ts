import { getTemplate } from '../templates/index.js';

export async function loadTemplate(templatePath: string): Promise<string> {
    try {
        // In production, use pre-imported templates
        if (process.env.NODE_ENV === 'production') {
            const template = getTemplate(templatePath);
            if (template) {
                return template;
            }
            throw new Error(`Template not found: ${templatePath}`);
        }

        // In development, fetch templates dynamically
        const response = await fetch(templatePath);
        if (!response.ok) {
            throw new Error(`Failed to load template: ${templatePath}`);
        }
        return await response.text();
    } catch (error) {
        console.error(`Error loading template ${templatePath}:`, error);
        return '';
    }
}

export function createElement(tag: string, classes: string = '', content: string = ''): HTMLElement {
    const element = document.createElement(tag);
    if (classes) element.className = classes;
    if (content) element.innerHTML = content;
    return element;
}

export function smoothScrollTo(targetId: string): void {
    const target = document.getElementById(targetId);
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

export function debounce<T extends (...args: any[]) => void>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

export function throttle<T extends (...args: any[]) => void>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

export function isElementInViewport(el: Element): boolean {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

export function addIntersectionObserver(
    elements: Element[],
    callback: (entry: IntersectionObserverEntry) => void,
    options: IntersectionObserverInit = {}
): IntersectionObserver {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(callback);
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
        ...options
    });

    elements.forEach(el => observer.observe(el));
    return observer;
}