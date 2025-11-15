const o=`<div id="header-container"></div>
<div id="hero-container"></div>
<div id="main-content">
    <!-- About Section -->
    <div id="about-section-container"></div>

    <!-- Research Section -->
    <div id="research-section-container"></div>

    <!-- Projects Section -->
    <div id="projects-section-container"></div>

    <!-- Resume Section -->
    <div id="resume-section-container"></div>
</div>

<!-- Footer -->
<div id="footer-container"></div>`,a=`<section id="about" class="section-padding bg-gray-50">
    <div class="max-w-4xl mx-auto">
        <h3 class="section-title mb-8 text-center fade-in-up">{{sections.about}}</h3>
        <div class="prose prose-lg mx-auto text-center">
            <p class="text-lg text-gray-700 leading-relaxed mb-6">
                {{content.about_description}}
            </p>
            <p class="text-lg text-gray-700 leading-relaxed">
                {{content.about_extended}}
            </p>
        </div>
    </div>
</section>`,r=`<section id="research" class="py-12">
    <div class="max-w-6xl mx-auto px-6">
        <h3 class="section-title mb-8 text-center">{{sections.research_focus}}</h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div class="grid grid-cols-1 gap-4" id="research-areas-container">
                <!-- Research areas will be loaded here -->
            </div>
            <div class="three-container bg-gradient-to-br from-gray-50 to-gray-100">
                <div id="research-three-scene" class="w-full h-full">
                    <div class="flex items-center justify-center h-full text-gray-500">
                        <div class="text-center">
                            <div class="animate-pulse mb-2">
                                <svg class="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                                </svg>
                            </div>
                            <p class="text-sm">{{status.loading_3d_viz}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>`,l=`<section id="projects" class="section-padding bg-gray-50">
    <div class="max-w-6xl mx-auto">
        <h3 class="section-title mb-12 text-center">{{sections.featured_projects}}</h3>
        <div id="projects-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {{placeholders.projects_loading}}
        </div>
    </div>
</section>`,c=`<section id="resume" class="section-padding">
    <div class="max-w-4xl mx-auto text-center">
        <h3 class="section-title mb-8">{{sections.academic_cv}}</h3>
        <p class="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            {{content.cv_description}}
        </p>
        <div class="space-x-4">
            <button id="view-cv-btn" class="btn-primary inline-flex items-center mr-4">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                {{buttons.view_online_cv}}
            </button>
            <a href="{{assets.resume_pdf}}" class="btn-secondary inline-flex items-center" download>
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                {{buttons.download_cv}}
            </a>
        </div>
    </div>
</section>`,d=`<footer class="bg-gray-900 text-white py-12">
    <div class="max-w-6xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
                <h4 class="text-xl font-semibold mb-4">{{personal.name}}</h4>
                <p class="text-gray-300">{{personal.title}}</p>
            </div>
            <div>
                <h4 class="text-lg font-semibold mb-4">{{sections.research_areas}}</h4>
                <ul class="space-y-2 text-gray-300" id="footer-research-areas">
                    <!-- Research areas will be populated here -->
                </ul>
            </div>
            <div>
                <h4 class="text-lg font-semibold mb-4">{{sections.connect}}</h4>
                <div class="flex space-x-4" id="footer-social-links">
                    <!-- Social links will be populated here -->
                </div>
            </div>
        </div>
        <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>{{site.copyright}}</p>
        </div>
    </div>
</footer>`,v=`<section id="hero" class="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white">
    <div class="max-w-6xl mx-auto px-6 py-20 lg:py-32">
        <div class="text-center fade-in-up">
            <h2 class="hero-title mb-6">
                Machine Learning Research Engineer
            </h2>
            <p class="text-xl lg:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                Advancing autonomous systems through deep learning, computer vision, and
                multi-agent reinforcement learning for UAVs, ground robots, and distributed systems.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#projects" class="btn-secondary">
                    View Projects
                </a>
                <a href="#research" class="btn-primary">
                    Core Expertise
                </a>
            </div>
        </div>

        <div class="mt-16 relative">
            <div class="three-container bg-gradient-to-r from-blue-800/30 to-purple-800/30 backdrop-blur-sm">
                <div id="hero-three-scene" class="w-full h-full flex items-center justify-center">
                    <div class="text-center text-blue-200">
                        <div class="animate-pulse mb-4">
                            <svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <p class="text-sm">Interactive 3D visualization loading...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>`,h=`<header class="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
    <nav class="max-w-6xl mx-auto px-6 py-4">
        <div class="flex justify-between items-center">
            <div class="flex items-center space-x-4">
                <h1 class="text-2xl font-bold">Victor Retamal</h1>
                <span class="text-sm text-gray-300 hidden md:block">ML Research Engineer</span>
            </div>

            <div class="hidden md:flex space-x-8">
                <a href="#about" class="nav-link hover:text-blue-400 transition-colors">About</a>
                <a href="#projects" class="nav-link hover:text-blue-400 transition-colors">Projects</a>
                <a href="#research" class="nav-link hover:text-blue-400 transition-colors">Research</a>
                <a href="/blog" class="nav-link hover:text-blue-400 transition-colors">Blog</a>
                <a href="#resume" class="nav-link hover:text-blue-400 transition-colors">Resume</a>
            </div>

            <button id="mobile-menu-btn" class="md:hidden p-2">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
        </div>

        <div id="mobile-menu" class="md:hidden mt-4 pb-4 hidden">
            <a href="#about" class="block py-2 hover:text-blue-400 transition-colors">About</a>
            <a href="#projects" class="block py-2 hover:text-blue-400 transition-colors">Projects</a>
            <a href="#research" class="block py-2 hover:text-blue-400 transition-colors">Research</a>
            <a href="/blog" class="block py-2 hover:text-blue-400 transition-colors">Blog</a>
            <a href="#resume" class="block py-2 hover:text-blue-400 transition-colors">Resume</a>
        </div>
    </nav>
</header>`,p=`<div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm sticky top-0 z-40">
        <div class="max-w-6xl mx-auto px-6 py-4">
            <div class="flex items-center justify-between">
                <button id="back-btn" class="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Back to Portfolio
                </button>
                <h1 class="text-xl font-semibold text-gray-900">Victor Retamal</h1>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="project-hero" class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16">
        <div class="max-w-6xl mx-auto px-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                    <div class="flex items-center mb-6">
                        <span id="project-category" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500 text-white">
                            Category
                        </span>
                        <span id="project-year" class="ml-4 text-sm opacity-75">2024</span>
                    </div>
                    <h1 id="project-title" class="text-4xl lg:text-5xl font-bold mb-6">Project Title</h1>
                    <p id="project-description" class="text-xl text-blue-100 mb-8">Project description will go here.</p>
                    <div id="project-links" class="flex flex-wrap gap-4">
                        <!-- Links will be inserted here -->
                    </div>
                </div>
                <div class="three-container bg-white/10 backdrop-blur-sm">
                    <div id="project-three-scene" class="w-full h-full">
                        <div class="flex items-center justify-center h-full text-white/70">
                            <div class="text-center">
                                <div class="animate-pulse mb-2">
                                    <svg class="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"></path>
                                    </svg>
                                </div>
                                <p class="text-sm">3D Visualization Loading...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Content Section -->
    <section class="py-16">
        <div class="max-w-4xl mx-auto px-6">
            <div class="prose prose-lg max-w-none">
                <h2 class="text-3xl font-bold mb-8">Project Overview</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div class="bg-white p-6 rounded-lg shadow-sm">
                        <h3 class="text-lg font-semibold mb-4">Technologies</h3>
                        <div id="project-technologies" class="flex flex-wrap gap-2">
                            <!-- Technologies will be inserted here -->
                        </div>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-sm">
                        <h3 class="text-lg font-semibold mb-4">Category</h3>
                        <span id="project-category-detail" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500 text-white">
                            Category
                        </span>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-sm">
                        <h3 class="text-lg font-semibold mb-4">Year</h3>
                        <p id="project-year-detail" class="text-2xl font-bold text-gray-900">2024</p>
                    </div>
                </div>

                <div class="bg-white p-8 rounded-lg shadow-sm">
                    <h3 class="text-2xl font-bold mb-6">Detailed Description</h3>
                    <div id="project-content" class="space-y-4 text-gray-700">
                        <!-- Detailed content will be inserted here -->
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>`,m=`<div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Project Not Found</h1>
        <p class="text-gray-600 mb-8">The project you're looking for doesn't exist.</p>
        <button id="back-btn" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Back to Portfolio
        </button>
    </div>
</div>`,x={"/src/templates/main-layout.html":o,"/src/templates/about-section.html":a,"/src/templates/research-section.html":r,"/src/templates/projects-section.html":l,"/src/templates/resume-section.html":c,"/src/templates/footer.html":d,"/src/templates/hero.html":v,"/src/templates/header.html":h,"/src/templates/project-detail.html":p,"/src/templates/project-not-found.html":m};function u(e){return x[e]}async function g(e){try{{const n=u(e);if(n)return n;throw new Error(`Template not found: ${e}`)}const t=await fetch(e);if(!t.ok)throw new Error(`Failed to load template: ${e}`);return await t.text()}catch(t){return console.error(`Error loading template ${e}:`,t),""}}function b(e,t="",n=""){const s=document.createElement(e);return t&&(s.className=t),n&&(s.innerHTML=n),s}function f(e){const t=document.getElementById(e);t&&t.scrollIntoView({behavior:"smooth",block:"start"})}function w(e,t,n={}){const s=new IntersectionObserver(i=>{i.forEach(t)},{threshold:.1,rootMargin:"0px 0px -100px 0px",...n});return e.forEach(i=>s.observe(i)),s}export{w as a,b as c,g as l,f as s};
//# sourceMappingURL=utils-BK8-gvwP.js.map
