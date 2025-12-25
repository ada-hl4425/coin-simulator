# 🪙 Coin Flip Physics Simulator

A physics-based coin flip simulator that demonstrates deterministic chaos in a simple mechanical system. Built with vanilla JavaScript and canvas rendering.

## 🎯 Features

### Core Functionality
- **Real-time Physics Simulation**: Accurate physics modeling including gravity, air resistance, wind, and collisions
- **Interactive Parameters**: Adjust 7 different physical parameters in real-time
- **Multiple Simulation Modes**:
  - Single flip with visual feedback
  - Batch mode (100 flips) for statistical analysis
  - Chaos demonstration with 8 coins at slightly different initial conditions

### Physics Parameters
- **Initial Height** (0.5-3m): Starting position of the coin
- **Throw Velocity** (2-10 m/s): Initial upward velocity
- **Spin Rate** (5-50 rad/s): Angular velocity of the coin
- **Throw Angle** (60-90°): Launch angle from horizontal
- **Wind Speed** (-2 to 2 m/s): Horizontal air flow
- **Ground Elasticity** (0.1-0.9): Coefficient of restitution for bounces
- **Air Resistance** (0-0.02): Drag coefficient

### Visualization Options
- **Trajectory Tracking**: Shows the path of the coin through the air
- **Grid Display**: Optional reference grid for spatial awareness
- **Color-coded Results**: Blue for heads, pink for tails
- **Multi-coin Chaos Demo**: Different colors for each coin to track divergence

### Statistics
- Total flips counter
- Heads/Tails distribution
- Real-time percentage calculation
- Visual progress bars
- Persistent statistics across sessions

## 🚀 Quick Start

### Option 1: GitHub Pages Deployment

1. Fork or clone this repository
2. Go to repository Settings → Pages
3. Set Source to "main" branch
4. Your simulator will be available at: `https://yourusername.github.io/coin-flip-simulator/`

### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/coin-flip-simulator.git

# Navigate to directory
cd coin-flip-simulator

# Open in browser
# Simply open index.html in your web browser
# OR use a local server:
python -m http.server 8000
# Then visit http://localhost:8000
```

## 📖 How to Use

### Single Flip
1. Adjust parameters using the sliders
2. Click "FLIP ONCE" to simulate a single coin flip
3. Watch the physics animation
4. See the result (HEADS or TAILS) displayed

### Batch Simulation
1. Set your desired parameters
2. Click "RUN 100 TIMES" for statistical analysis
3. Watch the statistics panel update in real-time
4. Observe how parameter changes affect the probability distribution

### Chaos Demonstration
1. Click "CHAOS DEMO" to launch 8 coins simultaneously
2. Each coin has a slightly different initial velocity (±0.7% variation)
3. Observe how small differences lead to completely different outcomes
4. This demonstrates the "butterfly effect" in a simple physical system

## 🧪 Physics Model

The simulation implements classical mechanics:

### Forces and Motion
```
F = ma (Newton's Second Law)
- Gravity: ay = g = 9.81 m/s²
- Air resistance: F_drag = 0.5 * C_d * ρ * A * v²
- Wind force: F_wind = constant horizontal acceleration
```

### Collisions
```
- Coefficient of restitution: e ∈ [0.1, 0.9]
- Velocity after bounce: v' = -e * v
- Angular momentum conservation with friction losses
```

### Result Determination
```
- Heads: coin angle ∈ [0°, 90°) ∪ [270°, 360°)
- Tails: coin angle ∈ [90°, 270°)
- Settled when: |v| < 0.1 m/s for 0.5 seconds
```

## 🎓 Educational Applications

This simulator demonstrates several important concepts:

1. **Deterministic Chaos**: Small changes in initial conditions lead to dramatically different outcomes
2. **Sensitivity Analysis**: Observe which parameters most affect the result
3. **Statistical Mechanics**: Long-run probability distributions emerge from deterministic rules
4. **Classical Mechanics**: Real-world application of Newton's laws

### Suggested Experiments

1. **Test for Fairness**: Run 100 flips with default parameters. Is it 50/50?
2. **Parameter Sensitivity**: Which parameter change has the biggest impact on outcomes?
3. **Chaos Exploration**: Run chaos demo multiple times. Do you see consistent divergence?
4. **Wind Effects**: How much wind is needed to bias the coin significantly?

## 🔧 Technical Details

- **No Dependencies**: Pure vanilla JavaScript, HTML5, and CSS3
- **Canvas Rendering**: 60 FPS physics simulation
- **Responsive Design**: Works on desktop and mobile devices
- **Performance**: Optimized for smooth animation even with multiple coins

### Browser Compatibility
- Chrome/Edge: ✅ Fully supported
- Firefox: ✅ Fully supported
- Safari: ✅ Fully supported
- Mobile browsers: ✅ Responsive design

## 📊 Connection to Atmospheric Chemistry

This simulator shares conceptual parallels with atmospheric chemistry modeling:

| Aspect | Coin Flip | Atmospheric Chemistry |
|--------|-----------|----------------------|
| **Deterministic Laws** | Newton's mechanics | Chemical rate equations |
| **Sensitivity** | Initial conditions | Emissions, meteorology |
| **Chaos** | Trajectory divergence | Turbulent mixing |
| **Ensemble Methods** | Multiple coins | Monte Carlo simulations |
| **Uncertainty** | Measurement limits | Parameterization errors |

Both systems are:
- Governed by deterministic physical laws
- Highly sensitive to initial conditions
- Require statistical treatment of uncertainty
- Benefit from ensemble simulation approaches

## 🛠️ Future Enhancements

Potential improvements:
- [ ] 3D visualization with Three.js
- [ ] Export simulation data as CSV
- [ ] Parameter sensitivity heatmaps
- [ ] Monte Carlo analysis with uncertainty quantification
- [ ] Multiple coin types (different masses/sizes)
- [ ] Advanced statistics (variance, confidence intervals)

## 📝 License

MIT License - feel free to use for educational purposes, research, or your own projects!

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Use this for educational purposes

---

**Live Demo**: ada-hl4425.github.io/coin-simulator/

**Questions or feedback?** Open an issue on GitHub!
