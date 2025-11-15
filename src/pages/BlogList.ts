import { createElement } from '../utils/dom.js';
import { Navigation } from '../utils/navigation.js';
import * as yaml from 'js-yaml';
import blogDataYaml from '../data/blog-posts.yaml?raw';

interface BlogPost {
    slug: string;
    title: string;
    date: string;
    tags: string[];
    summary: string;
    readTime: string;
    notebook: string;
    featured: boolean;
}

interface BlogData {
    posts: BlogPost[];
}

export class BlogListPage {
    private container: HTMLElement;
    private blogData: BlogData | null = null;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    public async render(): Promise<void> {
        try {
            await this.loadBlogData();
            await this.renderBlogList();
            this.setupEventListeners();
        } catch (error) {
            console.error('Blog List Page: Error during render:', error);
            throw error; // Re-throw to let router handle it
        }
    }

    private async loadBlogData(): Promise<void> {
        try {
            // Load blog data from YAML file
            const parsedData = yaml.load(blogDataYaml) as any;
            this.blogData = {
                posts: parsedData.posts || []
            };
        } catch (error) {
            console.error('Failed to load blog data:', error);
            this.blogData = null;
        }
    }

    private async renderBlogList(): Promise<void> {
        document.title = 'Blog - Victor Retamal';

        if (!this.blogData) {
            this.renderError();
            return;
        }

        this.container.innerHTML = `
            <div class="min-h-screen bg-white">
                <!-- Header -->
                <header class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                    <div class="max-w-4xl mx-auto px-6 py-12">
                        <div class="flex justify-between items-center">
                            <div>
                                <h1 class="text-4xl font-bold mb-2">Research Blog</h1>
                                <p class="text-xl text-blue-100 mb-4">Machine Learning & Mathematics</p>
                                <p class="text-blue-100">Jupyter notebooks, research insights, and technical deep-dives</p>
                            </div>
                            <div>
                                <button id="back-btn" class="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center">
                                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                                    </svg>
                                    Back to Portfolio
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <!-- Blog Posts -->
                <main class="max-w-4xl mx-auto px-6 py-12">
                    <div id="blog-posts-container" class="space-y-8">
                        <!-- Blog posts will be loaded here -->
                    </div>
                </main>
            </div>
        `;

        this.populateBlogPosts();
    }

    private populateBlogPosts(): void {
        if (!this.blogData) return;

        const container = document.getElementById('blog-posts-container');
        if (!container) return;

        container.innerHTML = '';

        // Sort posts by date in descending order (newest first)
        const sortedPosts = [...this.blogData.posts].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB.getTime() - dateA.getTime(); // Descending order
        });

        sortedPosts.forEach(post => {
            const postElement = this.createBlogPostCard(post);
            container.appendChild(postElement);
        });
    }

    private createBlogPostCard(post: BlogPost): HTMLElement {
        const card = createElement('article', 'bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer');

        card.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <div class="flex items-center space-x-4">
                    <span class="text-sm text-gray-500">${this.formatDate(post.date)}</span>
                    <span class="text-sm text-gray-500">${post.readTime} read</span>
                </div>
            </div>

            <h2 class="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">${post.title}</h2>

            <p class="text-gray-700 mb-4 leading-relaxed">${post.summary}</p>

            <div class="flex flex-wrap gap-2 mb-4">
                ${post.tags.map(tag => `
                    <span class="px-3 py-1 text-xs font-medium rounded-full ${this.getTagColor(tag)}">
                        ${tag}
                    </span>
                `).join('')}
            </div>

            <div class="flex items-center justify-between">
                <button class="read-more-btn text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center" data-slug="${post.slug}">
                    Read Full Post
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </button>
                ${post.notebook ? '<span class="text-sm text-gray-500">📓 Jupyter Notebook</span>' : '<span class="text-sm text-gray-500">📝 Article</span>'}
            </div>
        `;

        // Add click handler for the entire card
        card.addEventListener('click', () => {
            Navigation.toBlogPost(post.slug);
        });

        return card;
    }

    private getTagColor(tag: string): string {
        const colors: { [key: string]: string } = {
            'machine-learning': 'bg-blue-100 text-blue-800',
            'mathematics': 'bg-green-100 text-green-800',
            'transformers': 'bg-purple-100 text-purple-800',
            'attention': 'bg-yellow-100 text-yellow-800',
            'cnn': 'bg-red-100 text-red-800',
            'computer-vision': 'bg-indigo-100 text-indigo-800',
            'research': 'bg-pink-100 text-pink-800'
        };
        return colors[tag] || 'bg-gray-100 text-gray-800';
    }

    private formatDate(date: string): string {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return new Date(date).toLocaleDateString('en-US', options);
    }

    private renderError(): void {
        this.container.innerHTML = `
            <div class="min-h-screen bg-gray-50 flex items-center justify-center">
                <div class="text-center">
                    <h1 class="text-4xl font-bold text-gray-900 mb-4">Blog Unavailable</h1>
                    <p class="text-gray-600 mb-6">Failed to load blog posts. Please try again later.</p>
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
            Navigation.toHome();
        });

        // Handle read more buttons
        const readMoreBtns = document.querySelectorAll('.read-more-btn');
        readMoreBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click
                const slug = (btn as HTMLElement).dataset.slug;
                if (slug) {
                    Navigation.toBlogPost(slug);
                }
            });
        });
    }

    public destroy(): void {
        // Cleanup if needed
    }
}