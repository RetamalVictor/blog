import type { Project } from '../types/index.js';

export class ProjectCard {
    private element: HTMLElement;

    constructor(private project: Project, private container: HTMLElement) {
        this.element = this.createElement();
        this.container.appendChild(this.element);
        this.setupEventListeners();
    }

    private createElement(): HTMLElement {
        const card = document.createElement('div');
        card.className = 'card group cursor-pointer';

        card.innerHTML = `
            <div class="relative overflow-hidden">
                ${this.renderImage()}
                ${this.renderOverlay()}
            </div>
            <div class="p-6">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="text-xl font-semibold text-gray-900">${this.project.title}</h4>
                    <span class="text-sm text-gray-500">${this.project.year}</span>
                </div>
                <p class="text-gray-600 mb-4 line-clamp-3">${this.project.description}</p>
                <div class="flex flex-wrap gap-2 mb-4">
                    ${this.renderTechnologies()}
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex flex-wrap gap-2">
                        ${this.renderTags()}
                    </div>
                    <div class="flex space-x-2">
                        ${this.renderLinks()}
                    </div>
                </div>
            </div>
        `;

        return card;
    }

    private renderImage(): string {
        if (this.project.imageUrl) {
            // Handle base URL for production deployment
            const baseUrl = import.meta.env.BASE_URL || '/';
            const imageSrc = this.project.imageUrl.startsWith('http')
                ? this.project.imageUrl
                : `${baseUrl}${this.project.imageUrl.replace(/^\//, '')}`;

            return `
                <img
                    src="${imageSrc}"
                    alt="${this.project.title}"
                    class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                >
            `;
        }

        return `
            <div class="w-full h-48 bg-gradient-to-br ${this.getGradientColors()} flex items-center justify-center">
                <div class="text-center text-white">
                    ${this.getCategoryIcon()}
                    <p class="mt-2 text-sm font-medium">${this.project.title}</p>
                </div>
            </div>
        `;
    }

    private renderOverlay(): string {
        return `
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <div class="transform scale-0 group-hover:scale-100 transition-transform duration-300">
                    <button class="view-details-btn bg-white text-gray-900 px-4 py-2 rounded-lg font-medium shadow-lg hover:bg-gray-100 transition-colors">
                        View Details
                    </button>
                </div>
            </div>
        `;
    }

    private renderTechnologies(): string {
        return this.project.technologies
            .slice(0, 4)
            .map(tech => `
                <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    ${tech}
                </span>
            `).join('');
    }

    private renderTags(): string {
        if (!this.project.tags || this.project.tags.length === 0) {
            // Fallback to category if no tags
            return `
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${this.getCategoryColor()}">
                    ${this.getCategoryLabel()}
                </span>
            `;
        }

        return this.project.tags
            .map(tag => `
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${this.getCategoryColor()}">
                    ${tag}
                </span>
            `).join('');
    }

    private renderLinks(): string {
        const links = [];

        if (this.project.githubUrl) {
            links.push(`
                <a href="${this.project.githubUrl}" target="_blank" rel="noopener"
                   class="text-gray-600 hover:text-gray-900 transition-colors">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd"></path>
                    </svg>
                </a>
            `);
        }

        if (this.project.demoUrl) {
            links.push(`
                <a href="${this.project.demoUrl}" target="_blank" rel="noopener"
                   class="text-gray-600 hover:text-gray-900 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                </a>
            `);
        }

        return links.join('');
    }

    private getCategoryColor(): string {
        // All categories use green color
        return 'bg-green-100 text-green-800';
    }

    private getCategoryLabel(): string {
        const labels = {
            'robotics': 'Robotics',
            'computer-vision': 'Computer Vision',
            'machine-learning': 'Machine Learning',
            'multi-agent': 'Multi-Agent Systems',
            'research': 'Research'
        };
        return labels[this.project.category] || 'Other';
    }

    private getGradientColors(): string {
        const gradients = {
            'robotics': 'from-blue-500 to-cyan-600',
            'computer-vision': 'from-purple-500 to-pink-600',
            'machine-learning': 'from-green-500 to-teal-600',
            'multi-agent': 'from-orange-500 to-red-600',
            'research': 'from-indigo-500 to-violet-600'
        };
        return gradients[this.project.category] || 'from-gray-500 to-gray-600';
    }

    private getCategoryIcon(): string {
        const icons = {
            'robotics': `<svg class="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20"><path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>`,
            'computer-vision': `<svg class="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>`,
            'machine-learning': `<svg class="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path></svg>`,
            'multi-agent': `<svg class="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>`,
            'research': `<svg class="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path></svg>`
        };
        return icons[this.project.category] || icons.research;
    }

    private setupEventListeners(): void {
        this.element.addEventListener('click', (e) => {
            // Don't navigate if clicking on external links
            if ((e.target as HTMLElement).closest('a[href^="http"]')) {
                return;
            }

            e.preventDefault();
            this.navigateToProject();
        });

        // Also handle the "View Details" button specifically
        const viewDetailsBtn = this.element.querySelector('.view-details-btn');
        if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.navigateToProject();
            });
        }
    }

    private navigateToProject(): void {
        const url = `/project/${this.project.id}`;
        window.history.pushState({}, '', url);
        window.dispatchEvent(new PopStateEvent('popstate'));
    }

    public getElement(): HTMLElement {
        return this.element;
    }

    public destroy(): void {
        this.element.remove();
    }
}