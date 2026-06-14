/* -------------------------------------------------------------
   Astrid Wang Academic Portfolio - Client-Side Interactive Engine
   ------------------------------------------------------------- */

// --- Global Section Navigation ---
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

function showSection(sectionId) {
    sections.forEach(sec => {
        if (sec.id === sectionId) {
            sec.classList.add('active-section');
        } else {
            sec.classList.remove('active-section');
        }
    });

    navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Auto-scroll to top of section
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        showSection(targetId);
    });
});


// --- Project Tabs Navigation ---
function switchProjectTab(tabId) {
    // Tab buttons active status
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        if (btn.getAttribute('onclick').includes(tabId)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Panel display status
    const panels = document.querySelectorAll('.project-panel');
    panels.forEach(panel => {
        if (panel.id === `panel-${tabId}`) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    });
}


// --- Project 1: Coilgun Simulator Logic ---
let isLaunching = false;

function simulateLaunch() {
    if (isLaunching) return;
    isLaunching = true;

    // Read input values
    const voltageVal = parseFloat(document.getElementById('voltage').value);
    const capVal = parseFloat(document.getElementById('capacitance').value); // in uF
    const massVal = parseFloat(document.getElementById('projectile-mass').value); // in g

    const statusEl = document.getElementById('launch-status');
    const bulletEl = document.getElementById('bullet');
    const targetEl = document.querySelector('.target-area');
    
    const stage1 = document.getElementById('stage-1');
    const stage2 = document.getElementById('stage-2');
    const stage3 = document.getElementById('stage-3');

    // 1. Calculate realistic physics telemetry values
    const C = capVal * 1e-6; // Farad
    const energy = 0.5 * C * voltageVal * voltageVal; // Joules = 0.5 * C * V^2
    const current = voltageVal / 0.4; // Peak current mock (Resistance R = 0.4 ohm)
    const magneticField = (current * 0.005).toFixed(2); // Mock tesla field
    
    // Efficiency: ~1.8% conversion of electrical energy to mechanical kinetic energy
    const efficiency = 0.018; 
    const projectileKg = massVal * 0.001;
    const velocity = Math.sqrt((2 * energy * efficiency) / projectileKg);

    // Dynamic output updates
    document.getElementById('telemetry-energy').innerText = `${energy.toFixed(2)} J`;
    document.getElementById('telemetry-magnetic').innerText = `${magneticField} T`;
    document.getElementById('telemetry-current').innerText = `${current.toFixed(0)} A`;
    document.getElementById('telemetry-velocity').innerText = `${velocity.toFixed(1)} m/s`;

    // 2. Charging Phase
    statusEl.innerText = "🔌 电容充电中 (0%)...";
    statusEl.className = "vis-status";
    bulletEl.style.left = "10px";
    bulletEl.classList.remove('firing');
    targetEl.classList.remove('hit');
    
    stage1.classList.add('charging');
    stage2.classList.add('charging');
    stage3.classList.add('charging');

    let chargeProgress = 0;
    const chargeInterval = setInterval(() => {
        chargeProgress += 20;
        statusEl.innerText = `🔌 电容充电中 (${chargeProgress}%)...`;
        if (chargeProgress >= 100) {
            clearInterval(chargeInterval);
            
            // 3. Firing Phase
            statusEl.innerText = "⚡ 触发脉冲放电!";
            statusEl.className = "vis-status success";
            
            stage1.classList.remove('charging');
            stage2.classList.remove('charging');
            stage3.classList.remove('charging');
            
            // Accelerating Stage highlights
            setTimeout(() => { stage1.classList.add('firing'); bulletEl.classList.add('firing'); }, 100);
            setTimeout(() => { stage1.classList.remove('firing'); stage2.classList.add('firing'); }, 250);
            setTimeout(() => { stage2.classList.remove('firing'); stage3.classList.add('firing'); }, 400);
            
            // Bullet flying animation
            bulletEl.style.transition = "left 0.5s cubic-bezier(0.55, 0.055, 0.675, 0.19)";
            setTimeout(() => {
                bulletEl.style.left = "calc(70% + 40px)"; 
            }, 100);

            // Target collision
            setTimeout(() => {
                stage3.classList.remove('firing');
                targetEl.classList.add('hit');
                statusEl.innerText = "🎯 发射成功！弹丸命中";
                isLaunching = false;
            }, 600);
        }
    }, 250);
}


// --- Project 2: Chemistry Periodic Table Decoder Logic ---
const elementDetails = {
    'H': { name: '氢 (Hydrogen)', config: '1s¹', desc: '原子序数 1。宇宙中最丰富的元素，高能燃料的首选。' },
    'C': { name: '碳 (Carbon)', config: '[He] 2s² 2p²', desc: '原子序数 6。生命的基础，有机化学核心，拥有无限的成键可能。' },
    'N': { name: '氮 (Carbon)', config: '[He] 2s² 2p³', desc: '原子序数 7。空气的主角，化学性质稳定，液氮广泛应用于超导冷冻。' },
    'O': { name: '氧 (Oxygen)', config: '[He] 2s² 2p⁴', desc: '原子序数 8。极强的氧化性，助燃剂，也是有氧呼吸的分子载体。' },
    'Si': { name: '硅 (Silicon)', config: '[Ne] 3s² 3p²', desc: '原子序数 14。半导体工业的基石，芯片与光伏电池的灵魂材料。' },
    'P': { name: '磷 (Phosphorus)', config: '[Ne] 3s² 3p³', desc: '原子序数 15。生命DNA双螺旋骨架的核心元素，能量分子ATP的组成部分。' },
    'S': { name: '硫 (Sulfur)', config: '[Ne] 3s² 3p⁴', desc: '原子序数 16。经典的易燃非金属，常见于火山喷发物与火药配方中。' },
    'Co': { name: '钴 (Cobalt)', config: '[Ar] 3d⁷ 4s²', desc: '原子序数 27。重要的磁性与超合金过渡金属，常用于锂电池正极材料。' },
    'Y': { name: '钇 (Yttrium)', config: '[Kr] 4d¹ 5s²', desc: '原子序数 39。稀土金属，用于超导材料（如YBCO）及激光晶体制造。' },
    'I': { name: '碘 (Iodine)', config: '[Kr] 4d¹⁰ 5s² 5p⁵', desc: '原子序数 53。卤族元素，常温易升华，具有独特的紫黑色金属光泽。' },
    'Cs': { name: '铯 (Cesium)', config: '[Xe] 6s¹', desc: '原子序数 55$. 极其活泼的碱金属，常温下为金黄色液体，是制造原子钟的核心。' },
    'Es': { name: '锿 (Einsteinium)', config: '[Rn] 5f¹¹ 7s²', desc: '原子序数 99$. 超铀人造放射性金属，以物理学家爱因斯坦命名。' }
};

let currentCombo = [];

function clickElement(symbol, atomicNum) {
    const detailsEl = document.getElementById('element-details');
    const comboEl = document.getElementById('combo-display');
    const statusEl = document.getElementById('game-status');
    
    // Find the element card element
    const cardEl = document.querySelector(`.element-card[data-symbol="${symbol}"]`);
    
    // Toggle element selection
    if (cardEl.classList.contains('selected')) {
        cardEl.classList.remove('selected');
        currentCombo = currentCombo.filter(item => item !== symbol);
    } else {
        cardEl.classList.add('selected');
        currentCombo.push(symbol);
    }

    // Show Details
    const details = elementDetails[symbol];
    if (details) {
        detailsEl.innerHTML = `
            <div class="element-details-title">${details.name} (Atomic No. ${atomicNum})</div>
            <p><strong>外层电子排布：</strong><code>${details.config}</code></p>
            <p style="margin-top:0.3rem">${details.desc}</p>
        `;
    }

    // Update Combo text representation
    if (currentCombo.length > 0) {
        comboEl.innerText = currentCombo.join(" - ");
    } else {
        comboEl.innerText = "点击元素开始破译...";
    }

    // Check game target strings
    const spelledWord = currentCombo.join("");
    // Target combinations: 
    // 1. P - H - Y - Si - Cs -> spells "PHYSiCs" (Physics)
    // 2. Co - I - N - S -> spells "CoINS"
    if (spelledWord === "PHYSiCs") {
        statusEl.innerText = "🎉 解密成功：PHYSICS (物理)";
        statusEl.className = "vis-status success";
        setTimeout(() => alert("恭喜你！成功利用周期表拼出了密码「PHYSICS」（物理学），展示了优秀的交叉学科理解！"), 100);
    } else if (spelledWord === "CoINS") {
        statusEl.innerText = "🎉 解密成功：COINS (硬币)";
        statusEl.className = "vis-status success";
    } else {
        statusEl.innerText = "解密中...";
        statusEl.className = "vis-status";
    }
}

function resetChemistryGame() {
    currentCombo = [];
    document.querySelectorAll('.element-card').forEach(card => card.classList.remove('selected'));
    document.getElementById('combo-display').innerText = "点击元素开始破译...";
    document.getElementById('game-status').innerText = "解密中...";
    document.getElementById('game-status').className = "vis-status";
    document.getElementById('element-details').innerHTML = `
        <p>💡 点击上方任何元素卡片，即可在此查看其详细原子结构、外层电子配置及其化学反应特性。</p>
    `;
}


// --- Project 3: Speech Audio Simulation Logic ---
let isSpeechPlaying = false;
let speechTimer = null;
let currentSpeechIndex = 0;
const teleprompterLines = document.querySelectorAll('.speech-teleprompter .speech-line');

function playSpeechMock() {
    const audioStatusEl = document.getElementById('audio-status');
    const prompterEl = document.getElementById('teleprompter');
    
    if (isSpeechPlaying) {
        // Stop
        clearInterval(speechTimer);
        isSpeechPlaying = false;
        audioStatusEl.innerText = "停止";
        audioStatusEl.className = "vis-status";
        return;
    }

    isSpeechPlaying = true;
    audioStatusEl.innerText = "▶ 正在播放 (原声音频模拟中)...";
    audioStatusEl.className = "vis-status success";

    // Reset styles
    teleprompterLines.forEach(line => line.classList.remove('active'));
    currentSpeechIndex = 0;
    
    // Highlight first English & Chinese lines
    teleprompterLines[0].classList.add('active');
    teleprompterLines[1].classList.add('active');

    speechTimer = setInterval(() => {
        // Move to next pair (step of 2 since English and Chinese are paired)
        teleprompterLines.forEach(line => line.classList.remove('active'));
        currentSpeechIndex += 2;
        
        if (currentSpeechIndex >= teleprompterLines.length) {
            clearInterval(speechTimer);
            isSpeechPlaying = false;
            audioStatusEl.innerText = "播放完毕";
            audioStatusEl.className = "vis-status";
            return;
        }

        // Activate new lines
        teleprompterLines[currentSpeechIndex].classList.add('active');
        teleprompterLines[currentSpeechIndex + 1].classList.add('active');
        
        // Auto scroll to active lines
        const activeLineEl = teleprompterLines[currentSpeechIndex];
        prompterEl.scrollTo({
            top: activeLineEl.offsetTop - prompterEl.offsetTop - 30,
            behavior: 'smooth'
        });
    }, 4500); // 4.5 seconds per line pair
}

function toggleTranslation() {
    const chnLines = document.querySelectorAll('.speech-teleprompter .speech-line.chn');
    chnLines.forEach(line => {
        line.classList.toggle('hide-translation');
    });
}
