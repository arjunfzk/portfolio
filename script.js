"use strict";
(() => {
  // Suppress known harmless warnings from extensions and PDF.js
  const originalConsoleWarn = console.warn;
  console.warn = function(...args) {
    const message = args.join(' ');
    // Filter out known harmless warnings
    if (message.includes('InstallTrigger is deprecated') ||
        message.includes('onmozfullscreenchange is deprecated') ||
        message.includes('onmozfullscreenerror is deprecated') ||
        message.includes('cross-origin object as property')) {
      return; // Suppress these warnings
    }
    originalConsoleWarn.apply(console, args);
  };
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  const commandEl = document.getElementById('terminal-command');
  const commandCursor = document.getElementById('command-cursor');
  const outputEl = document.getElementById('terminal-output');
  const finalCursorLine = document.getElementById('final-cursor-line');
  
  // Get all paragraph elements for the output
  const outputParas = Array.from({length: 20}, (_, i) => document.getElementById(`output-p${i + 1}`));

  if (commandEl && outputEl && outputParas.every(p => p)) {
      const commandToType = "./introduce.sh";
      const terminalBody = document.querySelector('.terminal-body');
      
      // New text lines
      const texts = [
          "Hey, I'm Arjun.",
          "",
          "I build AI products that generate revenue. Solo. End-to-end.",
          "",
          "Live Now:",
          "10 iOS apps. 4 with production agentic backends—LLM orchestration, RAG pipelines, and multi-step reasoning in real user workflows.",
          "",
          "Background:",
          "4+ years in Data Science → 1.5 years building products from scratch. Design, development, marketing, deployment, optimization, support. Everything.",
          "",
          "What that means:",
          "• I've debugged hallucinations at 2am.",
          "• Optimized RAG for actual user queries.",
          "• I've built and shipped AI systems that people pay for.",
          "",
          "I've proven the model solo. Now, I want to tackle challenges at a scale that's impossible alone.",
          "↓ Scroll to see the apps in action ↓"
      ];

      // Pre-calculate height and width by rendering all text invisibly
      const preCalculateHeight = () => {
          const terminalWindow = document.querySelector('.terminal-window');
          
          // Temporarily show and populate all paragraphs invisibly
          outputEl.style.opacity = '0';
          outputEl.style.visibility = 'visible';
          finalCursorLine.style.display = 'flex';
          
          texts.forEach((text, index) => {
              outputParas[index].textContent = text;
              // Apply section-header class for proper styling calculation
              if (text === "Live Now:" || text === "Background:" || text === "What that means:" || text === "↓ Scroll to see the apps in action ↓") {
                  outputParas[index].classList.add('section-header');
              }
          });
          
          // Measure the height and width
          const calculatedHeight = terminalBody.offsetHeight;
          const calculatedWidth = terminalWindow.offsetWidth;
          
          // Set fixed dimensions
          terminalBody.style.height = `${calculatedHeight}px`;
          terminalWindow.style.width = `${calculatedWidth}px`;
          
          // Clear all text and restore visibility for typewriter effect
          outputParas.forEach(p => p.textContent = '');
          outputEl.style.opacity = '1';
          outputEl.style.visibility = 'hidden';
          finalCursorLine.style.display = 'none';
      };

      const typewriter = (element, text, onComplete, speed = 20) => {
          let i = 0;
          element.textContent = '';
          const interval = setInterval(() => {
              if (i < text.length) {
                  element.textContent += text.charAt(i);
                  i++;
              } else {
                  clearInterval(interval);
                  // Add section-header class to specific headers
                  if (text === "Live Now:" || text === "Background:" || text === "What that means:" || text === "↓ Scroll to see the apps in action ↓") {
                      element.classList.add('section-header');
                  }
                  if (onComplete) setTimeout(onComplete, 200); // Shorter delay between lines
              }
          }, speed);
      };

      const typeLinesSequentially = (index = 0) => {
          if (index < texts.length) {
              typewriter(outputParas[index], texts[index], () => typeLinesSequentially(index + 1));
          } else {
              // All lines typed, show final cursor
              finalCursorLine.style.display = 'flex';
          }
      };

      // Pre-calculate the terminal height before animation starts
      preCalculateHeight();

      setTimeout(() => {
          typewriter(commandEl, commandToType, () => {
              commandCursor.style.display = 'none';
              outputEl.style.visibility = 'visible';
              typeLinesSequentially(); // Start typing the output lines
          }, 80);
      }, 1000);
  }

  const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
          if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
          }
      });
  }, { threshold: 0.1 });
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
  
  // Active nav link
  const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
  const sections = document.querySelectorAll("section[id]");
  const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              const id = entry.target.getAttribute('id');
              navLinks.forEach(link => {
                  link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
              });
          }
      });
  }, { rootMargin: "-30% 0px -40% 0px", threshold: 0.2 });
  sections.forEach(section => navObserver.observe(section));

  // Interactive card spotlight
  const cards = document.querySelectorAll('.card');
  window.addEventListener('mousemove', (e) => {
      cards.forEach(card => {
          const rect = card.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          card.style.setProperty('--x', `${(mouseX / rect.width) * 100}%`);
          card.style.setProperty('--y', `${(mouseY / rect.height) * 100}%`);
      });
  });
  
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavLinks = mobileNav.querySelectorAll('a');
  
  const toggleMobileNav = () => {
      const isOpen = document.body.classList.toggle('mobile-nav-open');
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
  };

  if (hamburgerBtn) {
      hamburgerBtn.addEventListener('click', toggleMobileNav);
      mobileNavLinks.forEach(link => {
          link.addEventListener('click', () => {
              if (document.body.classList.contains('mobile-nav-open')) {
                  toggleMobileNav();
              }
          });
      });
  }

  // Video autoplay, preloading, and loading indicator management
  const projectVideos = document.querySelectorAll('[data-project-video]');
  const videoLoadingStates = new Map(); // Track loading state of each video
  
  // Initialize loading overlays for all videos
  projectVideos.forEach(video => {
      const container = video.closest('.project-video-container');
      const loadingOverlay = container.querySelector('.video-loading-overlay');
      const videoIndex = parseInt(video.getAttribute('data-video-index'));
      
      videoLoadingStates.set(video, {
          isPreloaded: false,
          isLoading: false,
          canPlay: false,
          index: videoIndex
      });
      
      // Show loading indicator when video starts loading
      video.addEventListener('loadstart', () => {
          const state = videoLoadingStates.get(video);
          state.isLoading = true;
          if (loadingOverlay) {
              loadingOverlay.classList.add('visible');
          }
      });
      
      // Hide loading indicator when video can play
      video.addEventListener('canplay', () => {
          const state = videoLoadingStates.get(video);
          state.canPlay = true;
          state.isLoading = false;
          if (loadingOverlay) {
              loadingOverlay.classList.remove('visible');
          }
      });
      
      // Show loading indicator when video is waiting/buffering
      // Also PAUSE background loading to give this video priority
      video.addEventListener('waiting', () => {
          if (loadingOverlay) {
              loadingOverlay.classList.add('visible');
          }
          
          // If this is the currently playing video, pause background loading
          if (video === currentlyPlayingVideo) {
              isBackgroundLoadingPaused = true;
              console.log('Active video buffering - pausing background loading');
          }
      });
      
      // Hide loading indicator when video starts playing
      // Resume background loading since video is playing smoothly
      video.addEventListener('playing', () => {
          if (loadingOverlay) {
              loadingOverlay.classList.remove('visible');
          }
          
          // Track currently playing video
          currentlyPlayingVideo = video;
          
          // Load adjacent videos in background
          loadAdjacentVideos(video);
          
          // Resume background loading after a short delay (ensure video is stable)
          setTimeout(() => {
              if (video === currentlyPlayingVideo && !video.paused) {
                  resumeBackgroundLoading();
              }
          }, 2000);
      });
      
      // Also hide on 'canplaythrough' for smooth experience
      video.addEventListener('canplaythrough', () => {
          if (loadingOverlay) {
              loadingOverlay.classList.remove('visible');
          }
      });
      
      // When video is paused, clear it as currently playing
      video.addEventListener('pause', () => {
          if (video === currentlyPlayingVideo) {
              currentlyPlayingVideo = null;
          }
      });
  });
  
  // Smart preloading function - loads a single video
  const preloadVideo = (video) => {
      const state = videoLoadingStates.get(video);
      
      if (state && !state.isPreloaded && !state.isLoading) {
          state.isPreloaded = true;
          video.preload = 'auto';
          video.load();
      }
  };
  
  // Global state for bandwidth management
  let currentlyPlayingVideo = null;
  let isBackgroundLoadingPaused = false;
  let backgroundLoadQueue = [];
  
  // Smart video preloader - continuous loading with bandwidth management
  const preloadAllVideosSequentially = () => {
      const sortedVideos = Array.from(projectVideos).sort((a, b) => {
          const stateA = videoLoadingStates.get(a);
          const stateB = videoLoadingStates.get(b);
          return (stateA?.index || 0) - (stateB?.index || 0);
      });
      
      // Preload first 3 videos aggressively, then continue loading all videos
      const PRIORITY_COUNT = 3;
      let currentVideoIndex = 0;
      let failedVideos = 0;
      
      const loadNextVideo = () => {
          // Check if background loading is paused due to active video buffering
          if (isBackgroundLoadingPaused && currentVideoIndex >= PRIORITY_COUNT) {
              console.log('Background loading paused - active video has priority');
              backgroundLoadQueue.push(currentVideoIndex);
              return;
          }
          
          if (currentVideoIndex >= sortedVideos.length) {
              console.log(`Video preloading complete: ${sortedVideos.length - failedVideos}/${sortedVideos.length} successful`);
              return;
          }
          
          const video = sortedVideos[currentVideoIndex];
          const state = videoLoadingStates.get(video);
          const isPriority = currentVideoIndex < PRIORITY_COUNT;
          
          if (state && !state.isPreloaded) {
              console.log(`Preloading video ${currentVideoIndex + 1}/${sortedVideos.length} (${isPriority ? 'priority' : 'background'})`);
              state.isPreloaded = true;
              
              // Load ALL videos with 'auto' for continuous preloading
              video.preload = 'auto';
              video.load();
              
              // Use 'canplaythrough' for priority videos, 'canplay' for background
              const eventToWaitFor = isPriority ? 'canplaythrough' : 'canplay';
              
              const onReady = () => {
                  video.removeEventListener(eventToWaitFor, onReady);
                  video.removeEventListener('error', onError);
                  console.log(`Video ${currentVideoIndex + 1} ready`);
                  
                  // Very short delay for continuous loading
                  const delay = isPriority ? 300 : 500;
                  setTimeout(() => {
                      currentVideoIndex++;
                      loadNextVideo();
                  }, delay);
              };
              
              const onError = (error) => {
                  video.removeEventListener(eventToWaitFor, onReady);
                  video.removeEventListener('error', onError);
                  console.warn(`Video ${currentVideoIndex + 1} failed to load:`, error.type || 'unknown error');
                  failedVideos++;
                  
                  // Continue to next video even if one fails
                  setTimeout(() => {
                      currentVideoIndex++;
                      loadNextVideo();
                  }, 200);
              };
              
              // Add timeout to prevent hanging
              const timeout = setTimeout(() => {
                  video.removeEventListener(eventToWaitFor, onReady);
                  video.removeEventListener('error', onError);
                  console.warn(`Video ${currentVideoIndex + 1} timed out`);
                  failedVideos++;
                  currentVideoIndex++;
                  loadNextVideo();
              }, isPriority ? 20000 : 15000);
              
              const onReadyWithTimeout = () => {
                  clearTimeout(timeout);
                  onReady();
              };
              
              const onErrorWithTimeout = (error) => {
                  clearTimeout(timeout);
                  onError(error);
              };
              
              video.addEventListener(eventToWaitFor, onReadyWithTimeout, { once: true });
              video.addEventListener('error', onErrorWithTimeout, { once: true });
          } else {
              // Skip if already preloaded
              currentVideoIndex++;
              loadNextVideo();
          }
      };
      
      // Start the sequential loading process
      loadNextVideo();
  };
  
  // Resume background loading when active video is stable
  const resumeBackgroundLoading = () => {
      if (!isBackgroundLoadingPaused) return;
      
      isBackgroundLoadingPaused = false;
      console.log('Resuming background video loading');
      
      // Resume any queued loads
      if (backgroundLoadQueue.length > 0) {
          const nextIndex = backgroundLoadQueue.shift();
          // Trigger continuation of loading
          setTimeout(() => {
              const sortedVideos = Array.from(projectVideos).sort((a, b) => {
                  const stateA = videoLoadingStates.get(a);
                  const stateB = videoLoadingStates.get(b);
                  return (stateA?.index || 0) - (stateB?.index || 0);
              });
              
              // Find next unloaded video and load it
              for (let i = nextIndex; i < sortedVideos.length; i++) {
                  const video = sortedVideos[i];
                  const state = videoLoadingStates.get(video);
                  if (state && !state.isPreloaded && video.preload !== 'auto') {
                      console.log(`Loading next video ${i + 1} after pause`);
                      state.isPreloaded = true;
                      video.preload = 'auto';
                      video.load();
                      break;
                  }
              }
          }, 1000);
      }
  };
  
  // Load adjacent videos when a video starts playing
  const loadAdjacentVideos = (currentVideo) => {
      const sortedVideos = Array.from(projectVideos).sort((a, b) => {
          const stateA = videoLoadingStates.get(a);
          const stateB = videoLoadingStates.get(b);
          return (stateA?.index || 0) - (stateB?.index || 0);
      });
      
      const currentIndex = sortedVideos.indexOf(currentVideo);
      if (currentIndex === -1) return;
      
      // Load next 2 videos if not already loading/loaded
      for (let i = 1; i <= 2; i++) {
          const nextIndex = currentIndex + i;
          if (nextIndex < sortedVideos.length) {
              const nextVideo = sortedVideos[nextIndex];
              const state = videoLoadingStates.get(nextVideo);
              
              if (state && !state.isPreloaded && nextVideo.preload !== 'auto' && !isBackgroundLoadingPaused) {
                  console.log(`Loading adjacent video ${nextIndex + 1}`);
                  state.isPreloaded = true;
                  nextVideo.preload = 'auto';
                  nextVideo.load();
              }
          }
      }
  };
  
  // Pause all videos except the one passed as parameter
  const pauseOtherVideos = (currentVideo) => {
      projectVideos.forEach(video => {
          if (video !== currentVideo && !video.paused) {
              video.pause();
          }
      });
  };

  // Add play event listeners to pause other videos
  projectVideos.forEach(video => {
      video.addEventListener('play', () => {
          pauseOtherVideos(video);
      });
  });

  // Intersection Observer for autoplay when in viewport with smart loading
  const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          const video = entry.target;
          const card = video.closest('.card');
          const state = videoLoadingStates.get(video);
          
          if (entry.isIntersecting) {
              // Add in-focus class to highlight the active card
              if (card) {
                  card.classList.add('in-focus');
              }
              
              // If video was only preloaded with metadata, upgrade to full preload
              if (video.preload === 'metadata' && state && !state.isLoading) {
                  console.log('Upgrading video to full preload (in viewport)');
                  state.isLoading = true;
                  video.preload = 'auto';
                  video.load();
              }
              
              // Wait for video to be ready before playing
              const attemptPlay = () => {
                  if (video.readyState >= 3) { // HAVE_FUTURE_DATA or better
                      video.play().catch(error => {
                          console.log('Autoplay prevented:', error);
                      });
                  } else {
                      // Video not ready yet, wait for canplay event
                      const onCanPlay = () => {
                          video.removeEventListener('canplay', onCanPlay);
                          video.play().catch(error => {
                              console.log('Autoplay prevented:', error);
                          });
                      };
                      video.addEventListener('canplay', onCanPlay, { once: true });
                      
                      // Fallback timeout in case canplay doesn't fire
                      setTimeout(() => {
                          video.removeEventListener('canplay', onCanPlay);
                          if (video.readyState >= 2) {
                              video.play().catch(error => {
                                  console.log('Autoplay prevented:', error);
                              });
                          }
                      }, 3000);
                  }
              };
              
              setTimeout(attemptPlay, 100);
          } else {
              // Video is out of viewport - pause it and remove focus styling
              video.pause();
              if (card) {
                  card.classList.remove('in-focus');
              }
          }
      });
  }, { 
      threshold: 0.5, // Trigger when 50% of video is visible
      rootMargin: '-50px' // Add some margin for better UX
  });

  // Observe all project videos
  projectVideos.forEach(video => {
      videoObserver.observe(video);
  });
  
  // Proximity observer - ensures videos are loaded as backup
  // (Most videos should already be loaded by continuous preloader)
  const proximityObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          const video = entry.target;
          const state = videoLoadingStates.get(video);
          
          // When video is approaching viewport, ensure it's loading
          if (entry.isIntersecting && video.preload !== 'auto' && state && !state.isLoading) {
              console.log('Video approaching viewport (backup load)');
              state.isLoading = true;
              video.preload = 'auto';
              video.load();
          }
      });
  }, { 
      threshold: 0,
      rootMargin: '150% 0px 150% 0px' // Trigger when video is within 1.5 screens above or below
  });
  
  // Observe all project videos for proximity loading
  projectVideos.forEach(video => {
      proximityObserver.observe(video);
  });
  
  // Start preloading all videos sequentially on page load
  // Small delay to let page render first
  setTimeout(() => {
      preloadAllVideosSequentially();
  }, 1000);

  // Experience card expand/collapse functionality
  const experienceCards = document.querySelectorAll('[data-experience-card]');
  
  experienceCards.forEach(card => {
      const expandBtn = card.querySelector('[data-expand-btn]');
      const expandText = expandBtn.querySelector('.expand-text');
      
      expandBtn.addEventListener('click', () => {
          const isExpanded = card.classList.toggle('is-expanded');
          expandText.textContent = isExpanded ? 'Show less' : 'Show details';
      });
  });

  // Resume modal functionality with PDF.js
  const resumeModal = document.getElementById('resume-modal');
  const viewResumeBtn = document.getElementById('view-resume-btn');
  const viewResumeMobileBtn = document.getElementById('view-resume-mobile-btn');
  const resumeModalClose = document.querySelector('.resume-modal-close');
  const resumeModalOverlay = document.querySelector('.resume-modal-overlay');
  const resumeLoader = document.getElementById('resume-loader');
  const canvas = document.getElementById('resume-pdf-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  let pdfDoc = null;
  let pageNum = 1;
  let pageRendering = false;
  let pageNumPending = null;

  // Simple approach: iframe for viewing, GitHub for download
  const pdfViewUrl = 'https://pub-896246ffffb148728a685d63cc7960d2.r2.dev/Resume_Arjun_G.pdf'; // Cloudflare CDN for viewing
  const downloadUrl = 'https://github.com/arjunfzk/portfolio-assets/raw/main/Resume_Arjun_G.pdf'; // GitHub for download

  // Configure PDF.js worker
  if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  // Check if PDF.js is loaded
  const checkPdfJs = () => {
    if (typeof pdfjsLib === 'undefined') {
      console.error('PDF.js library not loaded');
      if (resumeLoader) {
        resumeLoader.innerHTML = '<p style="color: #ef4444;">PDF viewer failed to load. Please use the download button.</p>';
      }
      return false;
    }
    return true;
  };

  const renderPage = (num) => {
    pageRendering = true;
    
    pdfDoc.getPage(num).then((page) => {
      const container = document.getElementById('resume-viewer-container');
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      // Calculate scale based on device width with higher DPI for crisp rendering
      const viewport = page.getViewport({ scale: 1.0 });
      const isMobile = window.innerWidth <= 768;
      
      let scale;
      if (isMobile) {
        // On mobile: fit full page width with high DPI
        const scaleWidth = (containerWidth * 0.95) / viewport.width;
        scale = Math.max(scaleWidth, 1.5); // Minimum 1.5x for crisp text
      } else {
        // On desktop: show 70% of page height with high DPI
        const scaleHeight = (containerHeight / viewport.height) * 0.7;
        const scaleWidth = containerWidth / viewport.width;
        scale = Math.max(Math.min(scaleWidth, scaleHeight), 1.8); // Minimum 1.8x for crisp text
      }

      const scaledViewport = page.getViewport({ scale });

      // Set canvas size with high DPI
      const devicePixelRatio = window.devicePixelRatio || 1;
      canvas.height = scaledViewport.height * devicePixelRatio;
      canvas.width = scaledViewport.width * devicePixelRatio;
      
      // Scale the canvas back down using CSS
      canvas.style.height = scaledViewport.height + 'px';
      canvas.style.width = scaledViewport.width + 'px';
      
      // Scale the drawing context so everything draws at the higher resolution
      ctx.scale(devicePixelRatio, devicePixelRatio);

      const renderContext = {
        canvasContext: ctx,
        viewport: scaledViewport
      };

      const renderTask = page.render(renderContext);

      renderTask.promise.then(() => {
        pageRendering = false;
        if (pageNumPending !== null) {
          renderPage(pageNumPending);
          pageNumPending = null;
        }
        
        // Hide loader after first render
        if (resumeLoader && num === 1) {
          setTimeout(() => {
            resumeLoader.style.opacity = '0';
            setTimeout(() => {
              resumeLoader.style.display = 'none';
            }, 300);
          }, 300);
        }
      });
    });

    // Update page counters
    const pageNumEl = document.getElementById('page-num');
    if (pageNumEl) {
      pageNumEl.textContent = num;
    }
  };

  const queueRenderPage = (num) => {
    if (pageRendering) {
      pageNumPending = num;
    } else {
      renderPage(num);
    }
  };

  const onPrevPage = () => {
    if (pageNum <= 1) return;
    pageNum--;
    queueRenderPage(pageNum);
    updatePageButtons();
  };

  const onNextPage = () => {
    if (pageNum >= pdfDoc.numPages) return;
    pageNum++;
    queueRenderPage(pageNum);
    updatePageButtons();
  };

  const updatePageButtons = () => {
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    if (prevBtn) {
      prevBtn.disabled = pageNum <= 1;
    }
    if (nextBtn && pdfDoc) {
      nextBtn.disabled = pageNum >= pdfDoc.numPages;
    }
  };

  // For iframe fallback, track page manually
  let iframePage = 1;
  const iframeMaxPages = 2;

  const updateIframePageButtons = () => {
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageNumEl = document.getElementById('page-num');
    
    if (prevBtn) prevBtn.disabled = iframePage <= 1;
    if (nextBtn) nextBtn.disabled = iframePage >= iframeMaxPages;
    if (pageNumEl) pageNumEl.textContent = iframePage;
  };

  const navigateIframePage = (direction) => {
    const fallbackIframe = document.getElementById('resume-pdf-iframe-fallback');
    if (!fallbackIframe || !fallbackIframe.src) return;
    
    if (direction === 'next' && iframePage < iframeMaxPages) {
      iframePage++;
    } else if (direction === 'prev' && iframePage > 1) {
      iframePage--;
    }
    
    // Use the PDF view URL for navigation
    const baseUrl = pdfViewUrl;
    
    // Mobile gets fit-to-page, desktop gets 85% zoom
    const isMobile = window.innerWidth <= 768;
    const zoom = isMobile ? 'page-fit' : '85';
    fallbackIframe.src = `${baseUrl}#page=${iframePage}&toolbar=0&navpanes=0&scrollbar=1&zoom=${zoom}`;
    updateIframePageButtons();
  };

  const loadPDFInIframe = () => {
    console.log('Loading PDF in iframe viewer');
    const fallbackIframe = document.getElementById('resume-pdf-iframe-fallback');
    const canvasContainer = document.querySelector('.resume-canvas-container');
    const pageControls = document.querySelector('.resume-page-controls');
    
    if (fallbackIframe && canvasContainer) {
      // Hide canvas, show iframe
      canvasContainer.style.display = 'none';
      fallbackIframe.style.display = 'block';
      
      // Use Cloudflare CDN for viewing (best quality)
      const currentUrl = pdfViewUrl;
      // Mobile gets fit-to-page, desktop gets 85% zoom for better quality
      const isMobile = window.innerWidth <= 768;
      const zoom = isMobile ? 'page-fit' : '85';
      fallbackIframe.src = `${currentUrl}#page=1&toolbar=0&navpanes=0&scrollbar=1&zoom=${zoom}`;
      
      console.log(`Loading iframe with URL: ${currentUrl}`);
      
      // Simple load handler - PDFs in iframes usually work
      const onIframeLoad = () => {
        console.log('Iframe loaded successfully');
        
        // Hide the loader after iframe loads
        setTimeout(() => {
          if (resumeLoader) {
            resumeLoader.style.opacity = '0';
            setTimeout(() => {
              resumeLoader.style.display = 'none';
            }, 300);
          }
        }, 1000);
      };
      
      // Error handler - if iframe fails, show download option
      const onIframeError = () => {
        console.warn('Iframe failed, showing download option');
        if (resumeLoader) {
          resumeLoader.innerHTML = `
            <div style="text-align: center; color: var(--text-muted);">
              <p>Unable to load PDF viewer.</p>
              <p style="margin: 16px 0;">Click below to download the resume:</p>
              <a href="${downloadUrl}" target="_blank" style="color: var(--accent); text-decoration: none; border: 1px solid var(--accent); padding: 8px 16px; border-radius: 8px; display: inline-block;">
                Download Resume PDF
              </a>
            </div>
          `;
        }
      };
      
      fallbackIframe.addEventListener('load', onIframeLoad, { once: true });
      fallbackIframe.addEventListener('error', onIframeError, { once: true });
      
      // Show page controls for 2-page resume
      if (pageControls) {
        pageControls.style.opacity = '1';
      }
      
      // Set flag that we're using iframe
      window.usingIframeFallback = true;
      updateIframePageButtons();
    }
  };

  const loadPDF = () => {
    // Simple approach: just use iframe directly
    loadPDFInIframe();
  };

  const openResumeModal = () => {
    // Close mobile nav if it's open
    if (document.body.classList.contains('mobile-nav-open')) {
      document.body.classList.remove('mobile-nav-open');
      if (hamburgerBtn) {
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    }
    
    resumeModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    
    // Load PDF when modal opens (if not already loaded)
    if (!pdfDoc) {
      setTimeout(loadPDF, 100); // Small delay to ensure modal is rendered
    }
  };

  const closeResumeModal = () => {
    resumeModal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  // Event listeners for opening modal
  if (viewResumeBtn) {
    viewResumeBtn.addEventListener('click', openResumeModal);
  }
  
  if (viewResumeMobileBtn) {
    viewResumeMobileBtn.addEventListener('click', openResumeModal);
  }

  // Event listeners for closing modal
  if (resumeModalClose) {
    resumeModalClose.addEventListener('click', closeResumeModal);
  }

  if (resumeModalOverlay) {
    resumeModalOverlay.addEventListener('click', closeResumeModal);
  }

  // Download button using GitHub raw link
  const downloadResumeBtn = document.getElementById('download-resume-btn');
  if (downloadResumeBtn) {
    downloadResumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Open GitHub raw download link in new tab
      window.open(downloadUrl, '_blank');
    });
  }

  // Page navigation with iframe fallback support
  const prevPageBtn = document.getElementById('prev-page');
  const nextPageBtn = document.getElementById('next-page');
  
  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
      if (window.usingIframeFallback) {
        navigateIframePage('prev');
      } else {
        onPrevPage();
      }
    });
  }
  
  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
      if (window.usingIframeFallback) {
        navigateIframePage('next');
      } else {
        onNextPage();
      }
    });
  }

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal.classList.contains('is-open')) {
      closeResumeModal();
    }
  });

  // Re-render on window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    if (resumeModal.classList.contains('is-open') && pdfDoc) {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        renderPage(pageNum);
      }, 250);
    }
  });
})();
