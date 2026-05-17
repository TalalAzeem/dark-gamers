/* 
=================================================
  ECOTRACK - INTERACTIVE LOGIC
=================================================
  This file handles all JavaScript logic including:
  1. Lenis Smooth Scrolling
  2. Three.js 3D Earth rendering
  3. GSAP Animations (Scroll reveals, interactions)
  4. Chart.js Data Visualization
  5. Interactive UI effects (Magnetic buttons, tilts)
*/

// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. LENIS SMOOTH SCROLLING SETUP
    // ==========================================
    // Initialize Lenis for buttery smooth scrolling
    const lenis = new Lenis({
        duration: 1.2, // Scroll duration
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing function
        smooth: true,
    });

    // Synchronize Lenis with the browser's requestAnimationFrame
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate Lenis with GSAP ScrollTrigger
    // This ensures ScrollTrigger calculations match the smooth scroll position
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);

    // ==========================================
    // 2. THREE.JS 3D EARTH ANIMATION
    // ==========================================
    function initThreeJSEarth() {
        const container = document.getElementById('earth-container');
        if (!container) return; // Exit if container doesn't exist

        // Create the scene, camera, and renderer
        const scene = new THREE.Scene();
        // PerspectiveCamera parameters: FOV, Aspect Ratio, Near plane, Far plane
        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); // alpha: true makes background transparent
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio); // Optimize for high DPI displays
        container.appendChild(renderer.domElement);

        // Move camera back so we can see the origin (0,0,0)
        camera.position.z = 5;

        // Create the Earth Geometry (Sphere)
        const geometry = new THREE.SphereGeometry(1.5, 64, 64);
        
        // Create a futuristic wireframe/hologram material
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x00ff88, // Neon green
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        
        const earth = new THREE.Mesh(geometry, material);
        scene.add(earth);

        // Create a second sphere slightly larger for a glowing effect
        const glowGeometry = new THREE.SphereGeometry(1.52, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x00e5ff, // Neon cyan
            transparent: true,
            opacity: 0.1,
            blending: THREE.AdditiveBlending // Makes it look like light
        });
        const glowEarth = new THREE.Mesh(glowGeometry, glowMaterial);
        scene.add(glowEarth);

        // Add some particle "satellites" orbiting the earth
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 200;
        const posArray = new Float32Array(particlesCount * 3);

        for(let i = 0; i < particlesCount * 3; i++) {
            // Position particles randomly within a spherical volume
            posArray[i] = (Math.random() - 0.5) * 5;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            color: 0x00ff88,
            transparent: true,
            opacity: 0.8
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Animation Loop
        function animateEarth() {
            requestAnimationFrame(animateEarth);

            // Rotate the earth and its glow
            earth.rotation.y += 0.002;
            earth.rotation.x += 0.001;
            glowEarth.rotation.y += 0.002;
            
            // Slowly rotate the satellite particles
            particlesMesh.rotation.y -= 0.001;

            renderer.render(scene, camera);
        }
        
        animateEarth();

        // Handle window resize to adjust the camera and renderer
        window.addEventListener('resize', () => {
            if (container.clientWidth && container.clientHeight) {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            }
        });
    }
    
    initThreeJSEarth();

    // ==========================================
    // 3. GSAP ANIMATIONS
    // ==========================================
    
    // 3A. Hero Section Animations (Run on load)
    const tl = gsap.timeline();
    
    // Fade in Navbar
    tl.from('.navbar', { y: -50, opacity: 0, duration: 1, ease: 'power3.out' })
      // Reveal Hero Title words stagger
      .from('.hero-title', { y: 50, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.5')
      .from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
      .from('.hero-buttons button', { y: 20, opacity: 0, duration: 0.6, stagger: 0.2, ease: 'power2.out' }, '-=0.4')
      .from('.hud', { opacity: 0, duration: 1, stagger: 0.3 }, '-=0.5');

    // Number counter animation for CO2 saved
    gsap.to('#hero-co2-counter', {
        innerHTML: 14059,
        duration: 3,
        ease: 'power2.out',
        snap: { innerHTML: 1 }, // Ensure it snaps to integers
        onUpdate: function() {
            // Add comma formatting
            document.getElementById('hero-co2-counter').innerHTML = Math.round(this.targets()[0].innerHTML).toLocaleString();
        }
    });

    // 3B. Scroll-triggered Animations
    // Features Title Reveal
    gsap.from('.features-section .section-title', {
        scrollTrigger: {
            trigger: '.features-section',
            start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 1
    });

    // Stagger reveal feature cards
    gsap.from('.feature-card', {
        scrollTrigger: {
            trigger: '.features-grid',
            start: 'top 75%',
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2, // Delay between each card animating in
        ease: 'back.out(1.5)' // Gives a slight bounce effect
    });

    // Dashboard reveal
    gsap.from('.dashboard-grid > div', {
        scrollTrigger: {
            trigger: '.dashboard-section',
            start: 'top 70%',
        },
        scale: 0.9,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: 'power3.out'
    });

    // ==========================================
    // 4. CHART.JS DASHBOARD INITIALIZATION
    // ==========================================
    function initDashboardCharts() {
        const ctx = document.getElementById('impactChart');
        if (!ctx) return;

        // Gradient for the area under the line
        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(0, 255, 136, 0.5)'); // Neon green transparent
        gradient.addColorStop(1, 'rgba(0, 255, 136, 0.0)'); // Fade to transparent

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
                datasets: [{
                    label: 'Cheat Activation Rate',
                    data: [45, 58, 71, 85, 82, 93, 99],
                    borderColor: '#00f0ff', // Neon cyan line
                    backgroundColor: gradient, // Fill gradient
                    borderWidth: 3,
                    pointBackgroundColor: '#ff008c', // Neon pink points
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#00f0ff',
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    fill: true,
                    tension: 0.36 // Smooth curves
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#f0f0f0', font: { family: 'Inter' } }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(5, 5, 5, 0.9)',
                        titleColor: '#00ff88',
                        bodyColor: '#f0f0f0',
                        borderColor: 'rgba(0, 255, 136, 0.3)',
                        borderWidth: 1,
                        padding: 10,
                        displayColors: false
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#a0a0a0' }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#a0a0a0' }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    // Initialize chart when dashboard is scrolled into view
    ScrollTrigger.create({
        trigger: '.dashboard-section',
        start: 'top 70%',
        onEnter: () => {
            initDashboardCharts();
        },
        once: true // Only run once
    });

    // ==========================================
    // 5. INTERACTIVE UI EFFECTS
    // ==========================================
    
    // 5A. 3D Tilt Effect for Glass Cards
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            // Calculate mouse position relative to the center of the card
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Calculate rotation amount based on mouse position
            // Division factor controls how strong the tilt is (higher = less tilt)
            const rotateX = -(y / 15);
            const rotateY = x / 15;

            // Apply the transform using GSAP for smoothness
            gsap.to(card, {
                rotationX: rotateX,
                rotationY: rotateY,
                transformPerspective: 1000,
                ease: 'power1.out',
                duration: 0.5
            });
        });

        // Reset transform when mouse leaves
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationX: 0,
                rotationY: 0,
                ease: 'elastic.out(1, 0.3)',
                duration: 1.5
            });
        });
    });

    // 5B. Background Canvas: Neon Cheat Nexus
    function initBackgroundParticles() {
        const canvas = document.getElementById('bg-canvas');
        const ctx = canvas.getContext('2d');
        
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        const codeWords = ['IDDQD', 'NOCLIP', 'UPUPDOWNDOWN', 'GODMODE', 'AIMBOT.exe', 'ACCESS_GRANTED', 'OVERRIDE', 'HACKED', 'LEVELUP', 'FRAME_DROP'];
        const rain = [];
        const particles = [];
        const hudRings = [];
        let mouseX = width / 2;
        let mouseY = height / 2;
        let glitchActive = false;
        let glitchFrames = 0;

        function resizeCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            createHudRings();
        }

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        class CodeStream {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * -height;
                this.speed = 1.6 + Math.random() * 2.6;
                this.text = codeWords[Math.floor(Math.random() * codeWords.length)];
                this.size = 14 + Math.random() * 10;
                this.opacity = 0.14 + Math.random() * 0.24;
                this.color = this.text.endsWith('.exe') ? 'rgba(255, 0, 140,' : 'rgba(0, 240, 255,';
            }

            update() {
                this.y += this.speed;
                if (this.y > height + 40) {
                    this.reset();
                    this.y = -Math.random() * 220;
                }
            }

            draw() {
                ctx.font = `${this.size}px Orbitron, sans-serif`;
                ctx.fillStyle = `${this.color}${this.opacity})`;
                ctx.fillText(this.text, this.x, this.y);
            }
        }

        class EnergyParticle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = Math.random() * 0.7 - 0.35;
                this.vy = Math.random() * 0.8 - 0.4;
                this.size = Math.random() * 2.4 + 1;
                this.alpha = 0.12 + Math.random() * 0.18;
                this.color = Math.random() > 0.5 ? 'rgba(0, 240, 255,' : 'rgba(139, 92, 246,';
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < -10 || this.x > width + 10 || this.y < -10 || this.y > height + 10) {
                    this.reset();
                    this.x = Math.random() * width;
                    this.y = Math.random() * height;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.fillStyle = `${this.color}${this.alpha})`;
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        class HudRing {
            constructor(x, y, radius, speed, color) {
                this.x = x;
                this.y = y;
                this.radius = radius;
                this.speed = speed;
                this.color = color;
                this.angle = Math.random() * Math.PI * 2;
            }

            update() {
                this.angle += this.speed;
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 1.1;
                ctx.beginPath();
                ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }
        }

        function createHudRings() {
            const centerX = width * 0.78;
            const centerY = height * 0.18;
            hudRings.length = 0;
            hudRings.push(new HudRing(centerX, centerY, 58, 0.0028, 'rgba(0, 240, 255, 0.32)'));
            hudRings.push(new HudRing(centerX, centerY, 88, -0.0018, 'rgba(139, 92, 246, 0.2)'));
            hudRings.push(new HudRing(centerX, centerY, 112, 0.0012, 'rgba(255, 0, 140, 0.16)'));
        }

        function drawPerspectiveGrid() {
            const horizon = height * 0.25;
            const centerX = width / 2;
            ctx.lineWidth = 1;
            for (let i = -14; i <= 14; i += 1) {
                ctx.strokeStyle = i % 2 === 0 ? 'rgba(0, 240, 255, 0.08)' : 'rgba(139, 92, 246, 0.06)';
                ctx.beginPath();
                ctx.moveTo(centerX + i * 90, height);
                ctx.lineTo(centerX + i * 12, horizon);
                ctx.stroke();
            }
            for (let row = 0; row < 12; row += 1) {
                const y = horizon + row * ((height - horizon) / 12);
                const opacity = 0.08 - row * 0.005;
                ctx.strokeStyle = `rgba(0, 240, 255, ${Math.max(0, opacity)})`;
                ctx.beginPath();
                ctx.moveTo(centerX - 540 + row * 24, y);
                ctx.lineTo(centerX + 540 - row * 24, y);
                ctx.stroke();
            }
        }

        function drawHudInterface() {
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.14)';
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.7;
            ctx.strokeRect(width * 0.06, height * 0.08, 220, 160);
            ctx.strokeRect(width * 0.06, height * 0.28, 180, 120);
            ctx.globalAlpha = 1;

            ctx.strokeStyle = 'rgba(255, 0, 140, 0.16)';
            ctx.beginPath();
            ctx.moveTo(width * 0.08, height * 0.12);
            ctx.lineTo(width * 0.18, height * 0.12);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(width * 0.08, height * 0.16);
            ctx.lineTo(width * 0.16, height * 0.16);
            ctx.stroke();

            hudRings.forEach(ring => {
                ring.update();
                ring.draw();
            });

            ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
            ctx.beginPath();
            ctx.moveTo(width * 0.08, height * 0.36);
            ctx.lineTo(width * 0.28, height * 0.36);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(width * 0.08, height * 0.41);
            ctx.lineTo(width * 0.20, height * 0.41);
            ctx.stroke();

            ctx.font = '11px Orbitron, sans-serif';
            ctx.fillStyle = 'rgba(0, 240, 255, 0.24)';
            ctx.fillText('HACK STATUS: ONLINE', width * 0.1, height * 0.35);
            ctx.fillText('NODE SYNC: 97%', width * 0.1, height * 0.40);
        }

        function drawGlitch() {
            const glitchLines = 4 + Math.floor(Math.random() * 3);
            for (let i = 0; i < glitchLines; i += 1) {
                const y = Math.random() * height;
                const thickness = 1 + Math.random() * 2;
                ctx.fillStyle = `rgba(255, 0, 140, ${0.08 + Math.random() * 0.08})`;
                ctx.fillRect(0, y, width, thickness);
                ctx.fillStyle = `rgba(0, 240, 255, ${0.06 + Math.random() * 0.05})`;
                ctx.fillRect(0, y + thickness * 2, width, thickness * 0.8);
            }
        }

        function initScene() {
            rain.length = 0;
            particles.length = 0;
            for (let i = 0; i < 28; i += 1) rain.push(new CodeStream());
            for (let i = 0; i < 95; i += 1) particles.push(new EnergyParticle());
            createHudRings();
        }

        function animateScene() {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = 'rgba(5, 8, 22, 0.22)';
            ctx.fillRect(0, 0, width, height);

            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            drawPerspectiveGrid();
            ctx.restore();

            drawHudInterface();

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            rain.forEach(stream => {
                stream.update();
                stream.draw();
            });

            const pulseRadius = 120 + Math.sin(Date.now() * 0.002) * 25;
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.14)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(mouseX, mouseY, pulseRadius, 0, Math.PI * 2);
            ctx.stroke();

            if (!glitchActive && Math.random() < 0.007) {
                glitchActive = true;
                glitchFrames = 5 + Math.floor(Math.random() * 5);
            }

            if (glitchActive) {
                drawGlitch();
                glitchFrames -= 1;
                if (glitchFrames <= 0) glitchActive = false;
            }

            requestAnimationFrame(animateScene);
        }

        initScene();
        animateScene();
    }

    initBackgroundParticles();

    // ==========================================
    // 6. CHEAT CODE CHATBOT LOGIC
    // ==========================================
    const chatBtn = document.querySelector('.ai-assistant-btn');
    const chatWindow = document.getElementById('chatWindow');
    const closeChatBtn = document.getElementById('closeChat');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatMessages = document.getElementById('chatMessages');

    // Toggle Chat Window
    if(chatBtn && chatWindow) {
        chatBtn.addEventListener('click', () => {
            chatWindow.classList.toggle('active');
            if(chatWindow.classList.contains('active')) {
                chatInput.focus();
            }
        });

        closeChatBtn.addEventListener('click', () => {
            chatWindow.classList.remove('active');
        });
    }

    // Cheat Code Database (Hardcoded)
    const cheatDatabase = {
        "gta": "GTA San Andreas Cheats:<br>- HESOYAM: Health, Armor, $250k<br>- UZUMYMW: Weapon Set 3<br>- AEZAKMI: Never Wanted<br>- JUMPJET: Spawn Hydra",
        "doom": "DOOM (1993) Cheats:<br>- IDDQD: God Mode<br>- IDKFA: All Weapons/Keys/Ammo<br>- IDCLIP: No Clipping (Walk through walls)",
        "sims": "The Sims 4 Cheats:<br>- motherlode: 50,000 Simoleons<br>- rosebud: 1,000 Simoleons<br>- testingcheats true: Enable advanced cheats",
        "age of empires": "Age of Empires II Cheats:<br>- how do you turn this on: Cobra Car<br>- marco: Reveal Map<br>- polo: Remove Fog of War<br>- cheese steak jimmy's: 10,000 Food",
        "minecraft": "Minecraft Commands:<br>- /gamemode creative<br>- /give @p diamond_sword<br>- /time set day<br>- /weather clear"
    };

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
        msgDiv.innerHTML = text; // Using innerHTML to support <br> tags
        chatMessages.appendChild(msgDiv);
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTyping() {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', 'bot-message', 'typing');
        msgDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        msgDiv.id = 'typingIndicator';
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTyping() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    function handleUserInput() {
        const text = chatInput.value.trim();
        if (!text) return;

        // 1. Show User Message
        addMessage(text, 'user');
        chatInput.value = '';

        // 2. Show Typing Indicator
        showTyping();

        // 3. Process Input and Respond
        setTimeout(() => {
            removeTyping();
            const lowerText = text.toLowerCase();
            let found = false;

            // Simple keyword matching
            for (const key in cheatDatabase) {
                if (lowerText.includes(key)) {
                    addMessage(cheatDatabase[key], 'bot');
                    found = true;
                    break;
                }
            }

            if (!found) {
                const genericCheats = [
                    `Universal Override Code for ${text}: <br>- UP UP DOWN DOWN LEFT RIGHT LEFT RIGHT B A START`,
                    `God Mode unlocked for ${text}. Proceed with caution.`,
                    `Injecting memory address for ${text}... <br>- Infinite Health enabled.`,
                    `Found generic exploit for ${text}: <br>- Open console and type "IDDQD".`,
                    `Bypassing mainframe for ${text}... <br>- All weapons and infinite ammo granted.`
                ];
                const randomResponse = genericCheats[Math.floor(Math.random() * genericCheats.length)];
                addMessage(randomResponse, 'bot');
            }
        }, 1000 + Math.random() * 1000); // 1-2 second delay
    }

    // Event Listeners for Input
    if(sendBtn && chatInput) {
        sendBtn.addEventListener('click', handleUserInput);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleUserInput();
            }
        });
    }
});
