import { createElement } from '../utils/dom.js';
import { Navigation } from '../utils/navigation.js';
import * as yaml from 'js-yaml';
import cvDataYaml from '../data/cv-data.yaml?raw';

export class CVPage {
    private container: HTMLElement;
    private cvData: any = null;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    public async render(): Promise<void> {
        console.log('CV Page: Starting render');
        await this.loadCVData();
        console.log('CV Page: Data loaded');
        await this.renderCV();
        console.log('CV Page: CV rendered');
        this.populateContent();
        console.log('CV Page: Content populated');
        this.setupEventListeners();
        console.log('CV Page: Event listeners setup');
    }

    private async loadCVData(): Promise<void> {
        try {
            // Use Vite's raw import which works in both dev and production
            this.cvData = yaml.load(cvDataYaml);
            console.log('CV data loaded successfully:', this.cvData);
        } catch (error) {
            console.error('Failed to load CV data:', error);
            this.cvData = null;
        }
    }

    private async renderCV(): Promise<void> {
        document.title = 'CV - Victor Retamal';

        if (!this.cvData) {
            this.renderError();
            return;
        }

        this.container.innerHTML = `
            <div class="min-h-screen bg-white">
                <!-- Header -->
                <header class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                    <div class="max-w-4xl mx-auto px-6 py-12">
                        <div class="flex justify-between items-start">
                            <div>
                                <h1 id="cv-name" class="text-4xl font-bold mb-2"></h1>
                                <p id="cv-label" class="text-xl text-blue-100 mb-4"></p>
                                <div id="cv-contact" class="space-y-1 text-blue-100"></div>
                            </div>
                            <div class="space-y-2">
                                <button id="download-pdf-btn" class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center">
                                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-4-4m4 4l4-4m-4-4V2"></path>
                                    </svg>
                                    Download PDF
                                </button>
                                <button id="back-btn" class="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center">
                                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                                    </svg>
                                    Back to Portfolio
                                </button>
                            </div>
                        </div>
                        <div id="cv-social" class="mt-6 flex space-x-4"></div>
                    </div>
                </header>

                <!-- Content -->
                <main class="max-w-4xl mx-auto px-6 py-12">
                    <div id="cv-sections" class="space-y-12"></div>
                </main>
            </div>
        `;
    }

    private populateContent(): void {
        if (!this.cvData) return;

        const cv = this.cvData.cv;
        const sections = this.cvData.sections;

        // Basic info
        this.updateElement('cv-name', cv.name);
        this.updateElement('cv-label', cv.label);

        // Contact info
        this.populateContact(cv);
        this.populateSocialNetworks(cv.social_networks);

        // Sections
        this.populateSections(sections);
    }

    private populateContact(cv: any): void {
        const container = document.getElementById('cv-contact');
        if (!container) return;

        const contactItems = [];
        if (cv.email) contactItems.push(`📧 ${cv.email}`);
        if (cv.phone) contactItems.push(`📞 ${cv.phone}`);
        if (cv.location) contactItems.push(`📍 ${cv.location}`);

        container.innerHTML = contactItems.map(item => `<div>${item}</div>`).join('');
    }

    private populateSocialNetworks(socialNetworks: any[]): void {
        const container = document.getElementById('cv-social');
        if (!container || !socialNetworks) return;

        container.innerHTML = '';
        socialNetworks.forEach(social => {
            const link = createElement('a', 'text-blue-100 hover:text-white transition-colors');
            link.setAttribute('href', this.getSocialUrl(social.network, social.username));
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener');
            link.textContent = `${social.network}: ${social.username}`;
            container.appendChild(link);
        });
    }

    private populateSections(sections: any): void {
        const container = document.getElementById('cv-sections');
        if (!container || !sections) return;

        container.innerHTML = '';

        // Education
        if (sections.education) {
            container.appendChild(this.createEducationSection(sections.education));
        }

        // Experience
        if (sections.experience) {
            container.appendChild(this.createExperienceSection(sections.experience));
        }

        // Publications
        if (sections.publications) {
            container.appendChild(this.createPublicationsSection(sections.publications));
        }

        // Projects
        if (sections.projects) {
            container.appendChild(this.createProjectsSection(sections.projects));
        }

        // Skills
        if (sections.skills) {
            container.appendChild(this.createSkillsSection(sections.skills));
        }

        // Awards
        if (sections.awards) {
            container.appendChild(this.createAwardsSection(sections.awards));
        }
    }

    private createEducationSection(education: any[]): HTMLElement {
        const section = this.createSection('Education');

        education.forEach(edu => {
            const item = createElement('div', 'mb-6');
            item.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h4 class="text-lg font-semibold text-gray-900">${edu.degree}</h4>
                        <p class="text-gray-700">${edu.institution}</p>
                        <p class="text-gray-600">${edu.area}</p>
                    </div>
                    <span class="text-gray-500 text-sm">${this.formatDateRange(edu.start_date, edu.end_date)}</span>
                </div>
                ${edu.highlights ? `<ul class="list-disc list-inside text-gray-600 space-y-1 ml-4">${edu.highlights.map((h: string) => `<li>${h}</li>`).join('')}</ul>` : ''}
            `;
            section.appendChild(item);
        });

        return section;
    }

    private createExperienceSection(experience: any[]): HTMLElement {
        const section = this.createSection('Experience');

        experience.forEach(exp => {
            const item = createElement('div', 'mb-6');
            item.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h4 class="text-lg font-semibold text-gray-900">${exp.position}</h4>
                        <p class="text-gray-700">${exp.company}</p>
                    </div>
                    <span class="text-gray-500 text-sm">${this.formatDateRange(exp.start_date, exp.end_date)}</span>
                </div>
                ${exp.highlights ? `<ul class="list-disc list-inside text-gray-600 space-y-1 ml-4">${exp.highlights.map((h: string) => `<li>${h}</li>`).join('')}</ul>` : ''}
            `;
            section.appendChild(item);
        });

        return section;
    }

    private createPublicationsSection(publications: any[]): HTMLElement {
        const section = this.createSection('Publications');

        publications.forEach(pub => {
            const item = createElement('div', 'mb-4');
            const authors = Array.isArray(pub.authors) ? pub.authors.join(', ') : pub.authors;
            item.innerHTML = `
                <h4 class="text-lg font-semibold text-gray-900 mb-1">${pub.title}</h4>
                <p class="text-gray-700 mb-1">${authors}</p>
                <p class="text-gray-600"><em>${pub.journal}</em>, ${pub.date}</p>
                ${pub.doi ? `<p class="text-blue-600 text-sm">DOI: ${pub.doi}</p>` : ''}
            `;
            section.appendChild(item);
        });

        return section;
    }

    private createProjectsSection(projects: any[]): HTMLElement {
        const section = this.createSection('Projects');

        projects.forEach(project => {
            const item = createElement('div', 'mb-6');
            item.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <h4 class="text-lg font-semibold text-gray-900">${project.name}</h4>
                    <span class="text-gray-500 text-sm">${project.date}</span>
                </div>
                ${project.highlights ? `<ul class="list-disc list-inside text-gray-600 space-y-1 ml-4">${project.highlights.map((h: string) => `<li>${h}</li>`).join('')}</ul>` : ''}
            `;
            section.appendChild(item);
        });

        return section;
    }

    private createSkillsSection(skills: any[]): HTMLElement {
        const section = this.createSection('Skills');

        skills.forEach(skill => {
            const item = createElement('div', 'mb-3');
            item.innerHTML = `
                <div class="flex">
                    <span class="font-semibold text-gray-900 w-40 flex-shrink-0">${skill.label}:</span>
                    <span class="text-gray-700">${skill.details}</span>
                </div>
            `;
            section.appendChild(item);
        });

        return section;
    }

    private createAwardsSection(awards: any[]): HTMLElement {
        const section = this.createSection('Awards & Honors');

        awards.forEach(award => {
            const item = createElement('div', 'mb-4');
            item.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="text-lg font-semibold text-gray-900">${award.title}</h4>
                        <p class="text-gray-700">${award.awarder}</p>
                    </div>
                    <span class="text-gray-500 text-sm">${award.date}</span>
                </div>
            `;
            section.appendChild(item);
        });

        return section;
    }

    private createSection(title: string): HTMLElement {
        const section = createElement('section');
        const header = createElement('h3', 'text-2xl font-bold text-gray-900 mb-6 border-b-2 border-blue-600 pb-2', title);
        section.appendChild(header);
        return section;
    }

    private formatDateRange(startDate: string, endDate: string): string {
        const start = startDate ? this.formatDate(startDate) : '';
        const end = endDate === 'present' ? 'Present' : (endDate ? this.formatDate(endDate) : '');
        return `${start} - ${end}`;
    }

    private formatDate(date: string): string {
        if (!date) return '';
        const parts = date.split('-');
        if (parts.length >= 2) {
            const year = parts[0];
            const month = parts[1];
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${months[parseInt(month) - 1]} ${year}`;
        }
        return date;
    }

    private getSocialUrl(network: string, username: string): string {
        const urls: { [key: string]: string } = {
            'LinkedIn': `https://linkedin.com/in/${username}`,
            'GitHub': `https://github.com/${username}`,
            'ORCID': `https://orcid.org/${username}`,
            'Twitter': `https://twitter.com/${username}`,
            'ResearchGate': `https://researchgate.net/profile/${username}`
        };
        return urls[network] || '#';
    }

    private updateElement(id: string, content: string): void {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    }

    private renderError(): void {
        this.container.innerHTML = `
            <div class="min-h-screen bg-gray-50 flex items-center justify-center">
                <div class="text-center">
                    <h1 class="text-4xl font-bold text-gray-900 mb-4">CV Unavailable</h1>
                    <p class="text-gray-600 mb-6">Failed to load CV data. Please try again later.</p>
                    <button id="back-btn" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                        Back to Portfolio
                    </button>
                </div>
            </div>
        `;
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        const backBtn = document.getElementById('back-btn');
        backBtn?.addEventListener('click', () => {
            // Use Navigation module for consistent routing
            Navigation.toHome();
        });

        const downloadBtn = document.getElementById('download-pdf-btn');
        downloadBtn?.addEventListener('click', () => {
            // This will be implemented in Phase 2
            const link = document.createElement('a');
            link.href = '/resume.pdf';
            link.download = 'CV_Victor_Retamal.pdf';
            link.click();
        });
    }

    public destroy(): void {
        // Cleanup if needed
    }
}