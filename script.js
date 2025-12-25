// Physics constants
const GRAVITY = 9.81;
const SCALE = 100; // pixels per meter

// Canvas and context
let canvas, ctx;
let canvasWidth, canvasHeight;

// Simulation state
let coin = null;
let isSimulating = false;
let trajectoryPoints = [];
let chaosCoins = [];

// Statistics
let stats = {
    total: 0,
    heads: 0,
    tails: 0
};

// Parameters
let params = {
    height: 1.5,
    velocity: 5,
    spin: 20,
    angle: 75,
    wind: 0,
    restitution: 0.6,
    drag: 0.005
};

// Options
let showTrajectory = true;
let showGrid = false;

// Coin class
class Coin {
    constructor(x, y, params, colorIndex = 0) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(params.angle * Math.PI / 180) * params.velocity;
        this.vy = -Math.sin(params.angle * Math.PI / 180) * params.velocity;
        this.angle = 0;
        this.angularVelocity = params.spin;
        this.radius = 0.12; // 12cm diameter coin
        this.mass = 0.01; // 10g
        this.restitution = params.restitution;
        this.drag = params.drag;
        this.wind = params.wind;
        this.isSettled = false;
        this.settleTimer = 0;
        this.trajectory = [];
        this.colorIndex = colorIndex;
        this.result = null;
    }

    update(dt) {
        if (this.isSettled) return;

        // Apply gravity
        this.vy += GRAVITY * dt;

        // Apply air resistance
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const dragForce = 0.5 * this.drag * speed * speed;
        const dragX = -dragForce * (this.vx / speed);
        const dragY = -dragForce * (this.vy / speed);
        
        this.vx += dragX * dt;
        this.vy += dragY * dt;

        // Apply wind
        this.vx += this.wind * dt * 0.5;

        // Update position
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        // Update rotation
        this.angle += this.angularVelocity * dt;

        // Store trajectory
        if (this.trajectory.length < 1000) {
            this.trajectory.push({ x: this.x, y: this.y });
        }

        // Ground collision
        const groundY = canvasHeight / SCALE - 0.05;
        if (this.y + this.radius > groundY) {
            this.y = groundY - this.radius;
            
            // Bounce
            this.vy = -this.vy * this.restitution;
            this.vx *= 0.95; // friction
            this.angularVelocity *= 0.9; // angular friction

            // Check if settled
            if (Math.abs(this.vy) < 0.1 && Math.abs(this.vx) < 0.1) {
                this.settleTimer += dt;
                if (this.settleTimer > 0.5) {
                    this.isSettled = true;
                    this.vx = 0;
                    this.vy = 0;
                    this.angularVelocity = 0;
                    this.determineResult();
                }
            } else {
                this.settleTimer = 0;
            }
        }

        // Wall collisions
        if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.vx = -this.vx * 0.8;
        }
        if (this.x + this.radius > canvasWidth / SCALE) {
            this.x = canvasWidth / SCALE - this.radius;
            this.vx = -this.vx * 0.8;
        }
    }

    determineResult() {
        // Determine heads or tails based on angle
        const normalizedAngle = ((this.angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const quarterTurn = Math.PI / 2;
        
        // Heads if coin is face-up (0-90 or 270-360 degrees)
        if (normalizedAngle < quarterTurn || normalizedAngle > 3 * quarterTurn) {
            this.result = 'heads';
        } else {
            this.result = 'tails';
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x * SCALE, this.y * SCALE);
        ctx.rotate(this.angle);

        // Coin colors for chaos demo
        const colors = [
            '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', 
            '#10b981', '#06b6d4', '#f97316', '#84cc16'
        ];

        // Draw coin
        const currentAngle = ((this.angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const isHeadsUp = currentAngle < Math.PI / 2 || currentAngle > 3 * Math.PI / 2;
        
        // 3D effect based on rotation
        const scaleY = Math.abs(Math.cos(this.angle)) * 0.3 + 0.7;
        
        ctx.beginPath();
        ctx.ellipse(0, 0, this.radius * SCALE, this.radius * SCALE * scaleY, 0, 0, 2 * Math.PI);
        
        if (chaosCoins.length > 1) {
            ctx.fillStyle = colors[this.colorIndex % colors.length];
        } else {
            ctx.fillStyle = isHeadsUp ? '#3b82f6' : '#ec4899';
        }
        
        ctx.fill();
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw markings
        ctx.fillStyle = '#1e293b';
        ctx.font = `${this.radius * SCALE * 0.8}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        if (scaleY > 0.5) {
            ctx.fillText(isHeadsUp ? 'H' : 'T', 0, 0);
        }

        ctx.restore();

        // Draw trajectory
        if (showTrajectory && this.trajectory.length > 1) {
            ctx.strokeStyle = chaosCoins.length > 1 
                ? colors[this.colorIndex % colors.length] + '80'
                : '#3b82f680';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.trajectory[0].x * SCALE, this.trajectory[0].y * SCALE);
            for (let i = 1; i < this.trajectory.length; i++) {
                ctx.lineTo(this.trajectory[i].x * SCALE, this.trajectory[i].y * SCALE);
            }
            ctx.stroke();
        }
    }
}

// Initialize
function init() {
    console.log('Initializing coin flip simulator...');
    
    canvas = document.getElementById('simulationCanvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    
    ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get 2D context!');
        return;
    }
    
    console.log('Canvas initialized successfully');
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Setup event listeners
    setupControls();
    
    console.log('Starting animation loop...');
    // Start animation loop
    requestAnimationFrame(animate);
}

function resizeCanvas() {
    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();
    
    // Set canvas size
    canvasWidth = Math.max(600, rect.width - 40);
    canvasHeight = 500;
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    console.log(`Canvas resized to ${canvasWidth}x${canvasHeight}`);
    
    // Redraw immediately
    if (ctx) {
        ctx.fillStyle = '#0a0f1a';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        drawGround();
    }
}

function setupControls() {
    console.log('Setting up controls...');
    
    // Parameter controls
    const controls = ['height', 'velocity', 'spin', 'angle', 'wind', 'restitution', 'drag'];
    controls.forEach(param => {
        const slider = document.getElementById(param);
        const valueDisplay = document.getElementById(param + 'Value');
        
        if (!slider) {
            console.error(`Slider not found: ${param}`);
            return;
        }
        
        slider.addEventListener('input', (e) => {
            params[param] = parseFloat(e.target.value);
            updateValueDisplay(param, params[param]);
        });
        
        // Initialize display
        updateValueDisplay(param, params[param]);
    });

    // Buttons
    const flipOnceBtn = document.getElementById('flipOnce');
    const run100Btn = document.getElementById('run100');
    const chaosDemoBtn = document.getElementById('chaosDemo');
    const resetBtn = document.getElementById('reset');
    const clearStatsBtn = document.getElementById('clearStats');
    
    if (flipOnceBtn) {
        flipOnceBtn.addEventListener('click', flipOnce);
        console.log('Flip Once button connected');
    } else {
        console.error('Flip Once button not found!');
    }
    
    if (run100Btn) {
        run100Btn.addEventListener('click', run100Times);
    }
    
    if (chaosDemoBtn) {
        chaosDemoBtn.addEventListener('click', runChaosDemo);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', reset);
    }
    
    if (clearStatsBtn) {
        clearStatsBtn.addEventListener('click', clearStats);
    }

    // Options
    const showTrajectoryCheck = document.getElementById('showTrajectory');
    const showGridCheck = document.getElementById('showGrid');
    
    if (showTrajectoryCheck) {
        showTrajectoryCheck.addEventListener('change', (e) => {
            showTrajectory = e.target.checked;
        });
    }
    
    if (showGridCheck) {
        showGridCheck.addEventListener('change', (e) => {
            showGrid = e.target.checked;
        });
    }
    
    console.log('Controls setup complete');
}

function updateValueDisplay(param, value) {
    const display = document.getElementById(param + 'Value');
    
    switch(param) {
        case 'height':
        case 'velocity':
        case 'wind':
            display.textContent = value.toFixed(1) + (param === 'height' || param === 'velocity' || param === 'wind' ? ' m' : '') + (param === 'velocity' || param === 'wind' ? '/s' : '');
            break;
        case 'spin':
            display.textContent = value.toFixed(1) + ' rad/s';
            break;
        case 'angle':
            display.textContent = value + '°';
            break;
        case 'restitution':
        case 'drag':
            display.textContent = value.toFixed(3);
            break;
    }
}

function flipOnce() {
    console.log('Flip Once clicked!');
    if (isSimulating) {
        console.log('Already simulating, ignoring click');
        return;
    }
    
    reset();
    const startX = canvasWidth / (2 * SCALE);
    const startY = canvasHeight / SCALE - params.height;
    
    console.log(`Starting coin at (${startX}, ${startY})`);
    
    coin = new Coin(startX, startY, params);
    chaosCoins = [coin];
    isSimulating = true;
    console.log('Simulation started!');
}

async function run100Times() {
    if (isSimulating) return;
    
    const button = document.getElementById('run100');
    button.disabled = true;
    button.textContent = 'Running...';
    
    for (let i = 0; i < 100; i++) {
        await runSingleFlip();
        
        // Update progress
        button.textContent = `Running... ${i + 1}/100`;
    }
    
    button.disabled = false;
    button.textContent = 'Run 100 Times';
}

function runSingleFlip() {
    return new Promise((resolve) => {
        reset();
        const startX = canvasWidth / (2 * SCALE);
        const startY = canvasHeight / SCALE - params.height;
        
        coin = new Coin(startX, startY, params);
        chaosCoins = [coin];
        isSimulating = true;
        
        const checkInterval = setInterval(() => {
            if (coin && coin.isSettled) {
                clearInterval(checkInterval);
                setTimeout(resolve, 100);
            }
        }, 100);
    });
}

function runChaosDemo() {
    if (isSimulating) return;
    
    reset();
    const startX = canvasWidth / (2 * SCALE);
    const startY = canvasHeight / SCALE - params.height;
    
    chaosCoins = [];
    
    // Create 8 coins with slightly different initial conditions
    for (let i = 0; i < 8; i++) {
        const variation = 1 + (i - 3.5) * 0.002; // ±0.7% variation
        const modifiedParams = {
            ...params,
            velocity: params.velocity * variation
        };
        const coin = new Coin(startX, startY, modifiedParams, i);
        chaosCoins.push(coin);
    }
    
    isSimulating = true;
}

function reset() {
    coin = null;
    chaosCoins = [];
    isSimulating = false;
    trajectoryPoints = [];
    
    const resultDisplay = document.getElementById('resultDisplay');
    resultDisplay.classList.remove('show', 'heads', 'tails');
}

function clearStats() {
    stats = { total: 0, heads: 0, tails: 0 };
    updateStatsDisplay();
}

function updateStats(result) {
    stats.total++;
    if (result === 'heads') {
        stats.heads++;
    } else {
        stats.tails++;
    }
    updateStatsDisplay();
}

function updateStatsDisplay() {
    document.getElementById('totalFlips').textContent = stats.total;
    document.getElementById('headsCount').textContent = stats.heads;
    document.getElementById('tailsCount').textContent = stats.tails;
    
    const headsPercent = stats.total > 0 ? (stats.heads / stats.total * 100).toFixed(1) : 0;
    const tailsPercent = stats.total > 0 ? (stats.tails / stats.total * 100).toFixed(1) : 0;
    
    document.getElementById('headsPercent').textContent = `(${headsPercent}%)`;
    document.getElementById('tailsPercent').textContent = `(${tailsPercent}%)`;
    
    document.getElementById('headsBar').style.width = headsPercent + '%';
    document.getElementById('tailsBar').style.width = tailsPercent + '%';
}

function showResult(result) {
    const resultDisplay = document.getElementById('resultDisplay');
    resultDisplay.textContent = result.toUpperCase() + '!';
    resultDisplay.classList.add('show', result);
    
    updateStats(result);
    
    setTimeout(() => {
        resultDisplay.classList.remove('show');
    }, 2000);
}

// Animation loop
let lastTime = Date.now();
let animationId = null;

function animate() {
    const currentTime = Date.now();
    const dt = Math.min((currentTime - lastTime) / 1000, 0.02); // Cap at 50 FPS
    lastTime = currentTime;

    // Clear canvas
    if (ctx && canvas) {
        ctx.fillStyle = '#0a0f1a';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Draw grid
        if (showGrid) {
            drawGrid();
        }

        // Draw ground
        drawGround();

        // Update and draw coins
        if (isSimulating && chaosCoins.length > 0) {
            let allSettled = true;
            
            chaosCoins.forEach(coin => {
                coin.update(dt);
                coin.draw(ctx);
                if (!coin.isSettled) {
                    allSettled = false;
                }
            });

            // Check if all settled (for chaos demo)
            if (allSettled) {
                isSimulating = false;
                
                // Show result for single coin flip
                if (chaosCoins.length === 1 && chaosCoins[0].result) {
                    showResult(chaosCoins[0].result);
                }
                
                // For chaos demo, show distribution
                if (chaosCoins.length > 1) {
                    const results = chaosCoins.map(c => c.result);
                    const headsCount = results.filter(r => r === 'heads').length;
                    const tailsCount = results.filter(r => r === 'tails').length;
                    
                    setTimeout(() => {
                        alert(`Chaos Demo Results:\nHeads: ${headsCount}\nTails: ${tailsCount}\n\nSame initial conditions (±0.7%) produced different outcomes!`);
                    }, 500);
                }
            }
        }
    }

    animationId = requestAnimationFrame(animate);
}

function drawGrid() {
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x <= canvasWidth; x += SCALE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeight);
        ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= canvasHeight; y += SCALE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidth, y);
        ctx.stroke();
    }
}

function drawGround() {
    const groundY = canvasHeight - 5;
    
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, groundY, canvasWidth, 5);
    
    // Ground line
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(canvasWidth, groundY);
    ctx.stroke();
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
