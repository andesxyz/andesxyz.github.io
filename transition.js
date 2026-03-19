// transition.js
document.addEventListener('DOMContentLoaded', () => {
    // Inject the CSS for the progress bar if not present
    if (!document.getElementById('page-progress-style')) {
        const style = document.createElement('style');
        style.id = 'page-progress-style';
        style.textContent = `
            #page-progress {
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: 3px;
                background: #a855f7;
                z-index: 99999;
                transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
                pointer-events: none;
                box-shadow: 0 0 10px rgba(168, 85, 247, 0.8), 0 0 20px rgba(168, 85, 247, 0.4);
                opacity: 0;
            }
        `;
        document.head.appendChild(style);
    }

    let progressBar = document.getElementById('page-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.id = 'page-progress';
        document.body.appendChild(progressBar);
    }

    // If navigating state is true from a previous click, fire the completion animation
    if (sessionStorage.getItem('navigating') === 'true') {
        sessionStorage.removeItem('navigating');
        progressBar.style.opacity = '1';
        progressBar.style.width = '100%';
        setTimeout(() => {
            progressBar.style.opacity = '0';
            setTimeout(() => { progressBar.style.width = '0%'; }, 300);
        }, 400);
    }

    // Attach listener globally to all anchor tags to intercept navigation
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        
        // Ensure it's a relative/internal navigation link
        if (href && !href.startsWith('#') && !href.startsWith('http') && !link.hasAttribute('target')) {
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            
            // Allow transitions even if it's technically index.html -> /
            if (href !== currentPage) {
                e.preventDefault();
                sessionStorage.setItem('navigating', 'true');
                
                progressBar.style.opacity = '1';
                progressBar.style.width = '30%';
                
                setTimeout(() => { progressBar.style.width = '70%'; }, 100);

                setTimeout(() => {
                    progressBar.style.width = '90%';
                    // Perform the actual redirect after the progress bar loads up
                    setTimeout(() => { window.location.href = href; }, 300); 
                }, 200);
            }
        }
    });
});
