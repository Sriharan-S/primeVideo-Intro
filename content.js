(function() {
    // 1. Read Settings
    chrome.storage.local.get(['enabled', 'playAlways', 'muted', 'hideTip'], (settings) => {
        
        if (settings.enabled === false) return;

        const sessionKey = 'splash_shown_session';
        const shouldPlayAlways = settings.playAlways !== false;
        
        if (!shouldPlayAlways && sessionStorage.getItem(sessionKey)) {
            return; 
        }

        // --- START ---

        const videoURL = chrome.runtime.getURL("intro.mp4");

        // 2. CSS PART 1: The "Flash Preventer" (Temporary)
        // We only need this for the milliseconds before our overlay is ready.
        const flashPreventer = document.createElement('style');
        flashPreventer.innerHTML = `
            html, body { 
                visibility: hidden !important; 
                background-color: #000 !important; 
            }
        `;
        document.documentElement.appendChild(flashPreventer);

        // 3. CSS PART 2: The "Scroll Lock" (Persists until video ends)
        // This ensures the site loads in background, but user can't scroll it.
        const scrollLock = document.createElement('style');
        scrollLock.innerHTML = `
            html, body { 
                overflow: hidden !important; 
            }
        `;
        document.documentElement.appendChild(scrollLock);

        // 4. CSS PART 3: UI (Overlay + Tip)
        const uiStyle = document.createElement('style');
        uiStyle.innerHTML = `
            /* OVERLAY */
            #my-splash-overlay {
                visibility: visible !important;
                opacity: 1 !important;
                position: fixed;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background: #000;
                z-index: 2147483647;
                overflow: hidden;
                cursor: default;
                transition: opacity 1.5s ease-in-out; /* Smooth Fade */
            }
            #my-splash-video {
                position: absolute;
                top: 50%; left: 50%;
                width: 100vw; height: auto; 
                transform: translate(-50%, -50%);
                display: block;
            }
            #my-splash-hint {
                position: absolute;
                bottom: 40px;
                width: 100%;
                text-align: center;
                color: rgba(255, 255, 255, 0.7);
                font-family: "Amazon Ember", Arial, sans-serif;
                font-size: 14px;
                pointer-events: none;
                z-index: 2147483648;
                text-transform: uppercase;
                letter-spacing: 2px;
                text-shadow: 0 2px 4px rgba(0,0,0,0.8);
                display: none;
            }

            /* TIP (TOP RIGHT) */
            #splash-tip-container {
                position: fixed;
                top: 20px; right: 20px;
                width: 300px;
                background: rgba(25, 30, 35, 0.95);
                border-left: 4px solid #00a8e1;
                color: white;
                padding: 15px;
                font-family: "Amazon Ember", Arial, sans-serif;
                border-radius: 4px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.5);
                z-index: 2147483646; 
                display: none;
                opacity: 0;
                transform: translateX(20px);
                transition: opacity 0.5s ease, transform 0.5s ease;
            }
            #splash-tip-title {
                font-size: 14px; font-weight: bold; color: #00a8e1;
                margin-bottom: 5px; display: flex; align-items: center; gap: 8px;
            }
            #splash-tip-text {
                font-size: 12px; line-height: 1.4; color: #ddd; margin-bottom: 12px;
            }
            #splash-tip-actions { display: flex; gap: 10px; }
            .splash-tip-btn {
                background: none; border: none; color: #aaa; font-size: 11px;
                cursor: pointer; padding: 0; text-decoration: underline;
            }
            .splash-tip-btn:hover { color: white; }
        `;
        document.documentElement.appendChild(uiStyle);

        // 5. Create DOM Elements
        const overlay = document.createElement('div');
        overlay.id = "my-splash-overlay";
        
        const video = document.createElement('video');
        video.id = "my-splash-video";
        video.src = videoURL;
        video.playsInline = true;
        video.muted = true;

        overlay.appendChild(video);
        
        const hint = document.createElement('div');
        hint.id = "my-splash-hint";
        hint.innerText = "Click anywhere to unmute";
        overlay.appendChild(hint);

        document.documentElement.appendChild(overlay);

        // --- KEY FIX: BACKGROUND LOADING ---
        // Now that the overlay (which is black) is covering the screen,
        // we can safely remove the "Flash Preventer".
        // This makes the underlying site "Visible" to the browser engine,
        // so it loads fully in the background while the video plays on top.
        requestAnimationFrame(() => {
            if(flashPreventer.parentNode) flashPreventer.parentNode.removeChild(flashPreventer);
        });

        // 6. Interaction Listener
        overlay.addEventListener('click', () => {
            if(video.muted) {
                video.muted = false;
                if(video.paused) video.play();
                hint.style.display = 'none';
            }
        });

        // 7. Finish Logic
        const finish = () => {
            if (overlay.dataset.finished) return;
            overlay.dataset.finished = "true";

            sessionStorage.setItem(sessionKey, 'true');
            
            // Fade out the overlay (revealing the already-loaded site)
            overlay.style.opacity = "0"; 

            // Allow Scrolling again
            if(scrollLock.parentNode) scrollLock.parentNode.removeChild(scrollLock);

            // Show Tip
            if (settings.hideTip !== true) {
                showTip();
            }

            // Cleanup DOM after fade
            setTimeout(() => {
                if(overlay.parentNode) overlay.parentNode.removeChild(overlay);
            }, 1600); 
        };

        video.onended = finish;
        setTimeout(finish, 12000); 

        // 8. Play Logic
        const playPromise = video.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                const userWantsSound = settings.muted !== true; 
                if (userWantsSound) {
                    video.muted = false;
                    if (video.paused) {
                        console.log("Audio blocked. Waiting for interaction.");
                        video.muted = true;
                        video.play();
                        hint.style.display = 'block';
                        overlay.style.cursor = 'pointer';
                    } else {
                        hint.style.display = 'none';
                    }
                }
            }).catch(error => {
                console.error("Autoplay failed:", error);
                finish(); 
            });
        }

        // --- TIP LOGIC ---
        function showTip() {
            const tipBox = document.createElement('div');
            tipBox.id = 'splash-tip-container';
            tipBox.innerHTML = `
                <div id="splash-tip-title">
                    <span>🔊</span> Enable Auto-Sound
                </div>
                <div id="splash-tip-text">
                    Browser blocked the sound? Go to <b>Site Settings > Sound > Allow</b> to hear it automatically next time.
                </div>
                <div id="splash-tip-actions">
                    <button id="splash-tip-close" class="splash-tip-btn">Close</button>
                    <button id="splash-tip-never" class="splash-tip-btn">Don't Show Again</button>
                </div>
            `;
            document.body.appendChild(tipBox);

            setTimeout(() => {
                tipBox.style.display = 'block';
                tipBox.offsetHeight; 
                tipBox.style.opacity = '1';
                tipBox.style.transform = 'translateX(0)';
            }, 1000);

            document.getElementById('splash-tip-close').addEventListener('click', () => {
                removeTip(tipBox);
            });

            document.getElementById('splash-tip-never').addEventListener('click', () => {
                chrome.storage.local.set({ hideTip: true });
                removeTip(tipBox);
            });
        }

        function removeTip(element) {
            element.style.opacity = '0';
            element.style.transform = 'translateX(20px)';
            setTimeout(() => {
                if (element.parentNode) element.parentNode.removeChild(element);
            }, 500);
        }
    });
})();