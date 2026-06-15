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


// --- Project 4: Arxiv / OpenAlex Search Radar Logic ---
function setArxivQuery(query) {
    document.getElementById('arxiv-query').value = query;
    searchAcademicPapers();
}

function searchAcademicPapers() {
    const query = document.getElementById('arxiv-query').value.trim();
    const resultsEl = document.getElementById('arxiv-results');
    const statusEl = document.getElementById('arxiv-status');
    
    if (!query) {
        alert("请输入检索关键词！");
        return;
    }
    
    statusEl.innerText = "🔍 扫描中...";
    statusEl.className = "vis-status";
    resultsEl.innerHTML = '<p style="color:var(--text-secondary);text-align:center;margin-top:4rem">正在连接全球学术网关并检索文献...</p>';
    
    // Call OpenAlex API for clean JSON results
    const url = `https://api.openalex.org/works?search=${encodeURIComponent(query)}&per_page=3`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            statusEl.innerText = "完成";
            statusEl.className = "vis-status success";
            
            if (!data.results || data.results.length === 0) {
                resultsEl.innerHTML = '<p style="color:var(--text-muted);text-align:center;margin-top:4rem">未找到相关主题的前沿文献记录。</p>';
                return;
            }
            
            let htmlContent = "";
            data.results.forEach((work, idx) => {
                const title = work.title || "Untitled Paper";
                const year = work.publication_year || "Unknown Year";
                const author = work.authorships && work.authorships[0] ? work.authorships[0].author.display_name : "Anonymous";
                const source = work.primary_location && work.primary_location.source ? work.primary_location.source.display_name : "Open Access Source";
                const doi = work.doi || `https://openalex.org/${work.id}`;
                
                htmlContent += `
                    <div class="arxiv-item" style="border-bottom:1px solid var(--border-light);padding-bottom:0.8rem;margin-bottom:0.8rem">
                        <h4 style="color:#fff;margin-bottom:0.2rem;font-size:0.88rem">${idx+1}. <a href="${doi}" target="_blank" style="color:var(--accent-cyan);text-decoration:none">${title}</a></h4>
                        <p style="color:var(--text-secondary);font-size:0.75rem"><strong>作者:</strong> ${author} &middot; <strong>发表年份:</strong> ${year} &middot; <strong>出处:</strong> ${source}</p>
                    </div>
                `;
            });
            resultsEl.innerHTML = htmlContent;
        })
        .catch(err => {
            console.error(err);
            statusEl.innerText = "错误";
            statusEl.className = "vis-status";
            resultsEl.innerHTML = `<p style="color:#f43f5e;text-align:center;margin-top:4rem">❌ 检索连接失败: ${err.message}</p>`;
        });
}


// --- Project 5: AST Target Fit Calculator Logic ---
const schoolThresholds = {
    'cambridge': { math: 260, physics: 265, english: 230, name: '剑桥大学' },
    'ntu': { math: 215, physics: 210, english: 190, name: '南洋理工大学' },
    'nus': { math: 220, physics: 215, english: 195, name: '新加坡国立大学' },
    'hku': { math: 200, physics: 195, english: 185, name: '香港大学' }
};

function updateASTSliderVal(type) {
    const val = document.getElementById(`ast-${type}`).value;
    document.getElementById(`val-ast-${type}`).innerText = val;
}

function calculateASTFit() {
    const target = document.getElementById('ast-school').value;
    const math = parseInt(document.getElementById('ast-math').value);
    const physics = parseInt(document.getElementById('ast-physics').value);
    const english = parseInt(document.getElementById('ast-english').value);
    
    const thresh = schoolThresholds[target];
    if (!thresh) return;
    
    // Simple fit calculation algorithm
    const mathDiff = math - thresh.math;
    const physDiff = physics - thresh.physics;
    const engDiff = english - thresh.english;
    
    let fitIndex = 70 + (mathDiff * 0.15) + (physDiff * 0.15) + (engDiff * 0.1);
    fitIndex = Math.min(100, Math.max(20, Math.round(fitIndex)));
    
    // Render fit
    const fitEl = document.getElementById('ast-fit-percentage');
    fitEl.innerText = `${fitIndex}%`;
    
    // Render advice
    const adviceEl = document.getElementById('ast-advice');
    let adviceText = `<strong>🎯 匹配分析 (${thresh.name})：</strong><br>`;
    
    if (fitIndex >= 90) {
        adviceText += `✨ 极高匹配度！您的模拟成绩已全面超越 ${thresh.name} 的常规录取要求线（数:${thresh.math}, 物:${thresh.physics}, 英:${thresh.english}）。建议保持良好心态，继续通过真题保持手感！`;
    } else if (fitIndex >= 75) {
        adviceText += `💪 良好匹配度！您的模考成绩与该校往年录取线非常接近。`;
        if (mathDiff < 0) adviceText += ` 建议着重攻克<strong>数学压轴题</strong>以提升分数。`;
        else if (physDiff < 0) adviceText += ` 建议重点复习<strong>电磁感应与波动学部分</strong>。`;
        else adviceText += ` 建议加强学术英语的词汇积累和阅读理解精度。`;
    } else {
        adviceText += `⚠️ 需继续努力！当前模拟分距离 ${thresh.name} 常规分数线尚有一定空间。重点主攻数理大题，增加刷题量，AST 数理两科提分空间很大！`;
    }
    adviceEl.innerHTML = adviceText;
}


// --- Project 6: GitHub API Integration ---
function fetchGitHubProfile() {
    const url = "https://api.github.com/users/wxykok-code";
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.public_repos !== undefined) {
                document.getElementById('gh-repos').innerText = data.public_repos;
            }
            if (data.followers !== undefined) {
                document.getElementById('gh-followers').innerText = data.followers;
            }
        })
        .catch(err => console.error("GitHub API loading error:", err));
}


// --- Project 7: Floating AI Chatbot Dialogues ---
function toggleChatWindow() {
    document.getElementById('chat-window').classList.toggle('open');
}

const botReplies = {
    '1': "⚡ **多级电磁发射装置（电磁炮）** 是大姐独立动手研制的物理实验套件！它的电容器能够充电到最高 450V 的脉冲高压，触发时产生极强的安培力，将铁磁性弹丸瞬间以极高初速度推出。项目深入探究了法拉第电磁感应定律与楞次定律的应用，在网页的“科学实践-多级电磁发射装置”选项卡中您可以直接调整参数进行仿真试射哦！",
    '2': "🧪 在高二年级举办的 **“解构元素密码 · 绘制周期新篇”** 大赛中，大姐凭借对过渡金属外层电子轨道排布的深刻理解获得了竞赛大奖！网页中的“元素周期表解码器”就是由这一灵感设计而来的，试着点击 P, H, Y, Si, Cs 组合拼出「PHYSICS」看看？",
    '3': "📈 **大姐的升学规划** 非常明确和扎实：已在 2026 年 4 月通过雅思首考，目前正全力冲刺 2026 年 8 月的 AST（艾思特）考试，争取在 10 月份启动香港大学和香港中文大学的提前批申请，并在 2027 年 1 月申报新加坡南洋理工（NTU）和国立大学（NUS）！",
    '4': "☁️ 大姐目前已通关了 **17 个微软官方 Learn 技术路径模块**，斩获 **Level 6** 评级，积累了 25,275 XP。她的学习方向涵盖 Azure 云存储、云主机资源分配、Power Automate 业务审批流构建以及 Power BI 商业智能数据分析等，具有极强的数字化技能！"
};

function askPresetQuestion(id) {
    const questionText = {
        '1': "⚡ 电磁发射器是怎么做的？",
        '2': "🧪 大姐的化学周期表竞赛细节？",
        '3': "📈 她的港大/南洋理工升学时间线？",
        '4': "☁️ 她的微软学习记录如何？"
    }[id];
    
    appendChatMessage(questionText, "user");
    
    setTimeout(() => {
        const reply = botReplies[id] || "对不起，这个问题把我难住了。";
        appendChatMessage(reply, "bot");
    }, 500);
}

function sendUserChatMessage() {
    const inputEl = document.getElementById('chat-input');
    const questionText = inputEl.value.trim();
    if (!questionText) return;
    
    appendChatMessage(questionText, "user");
    inputEl.value = "";
    
    // Simple custom intent classifier
    setTimeout(() => {
        let reply = "你好！我已经收到你的探讨意见。大姐主要钻研应用物理和云计算自动化（如 Azure / Power BI），你可以点击下方的快捷推荐按钮来向我了解她具体的科研和升学路线哦！";
        
        const text = questionText.toLowerCase();
        if (text.includes("电磁") || text.includes("炮") || text.includes("物理")) {
            reply = botReplies['1'];
        } else if (text.includes("化学") || text.includes("周期表") || text.includes("元素")) {
            reply = botReplies['2'];
        } else if (text.includes("升学") || text.includes("大学") || text.includes("时间") || text.includes("规划")) {
            reply = botReplies['3'];
        } else if (text.includes("微软") || text.includes("learn") || text.includes("azure") || text.includes("云")) {
            reply = botReplies['4'];
        }
        
        appendChatMessage(reply, "bot");
    }, 600);
}

function appendChatMessage(text, sender) {
    const chatBody = document.getElementById('chat-body');
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;
    
    if (sender === "bot") {
        // Simple typewriter / streaming effect
        msgDiv.innerHTML = "<p></p>";
        chatBody.appendChild(msgDiv);
        let idx = 0;
        
        // Parse markdown bold markers briefly
        const parsedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        const typingTimer = setInterval(() => {
            idx++;
            msgDiv.querySelector('p').innerHTML = parsedText.substring(0, idx);
            chatBody.scrollTop = chatBody.scrollHeight;
            if (idx >= parsedText.length) {
                clearInterval(typingTimer);
            }
        }, 15);
    } else {
        msgDiv.innerHTML = `<p>${text}</p>`;
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
}


// --- Project 8: 3D Printing Simulator Engine ---
const modelData = {
    'reactor': {
        name: '反应堆夜灯 (Arc Reactor Nightlight)',
        img: 'assets/project_3dprint_reactor.jpg',
        baseTime: 12.5, // base hours
        baseWeight: 120, // base grams
        postDifficulty: '中等'
    },
    'bookmark': {
        name: '小黄人书签 (Minion Bookmark)',
        img: 'assets/project_3dprint_bookmark.jpg',
        baseTime: 1.2,
        baseWeight: 14,
        postDifficulty: '低'
    },
    'batmobile': {
        name: '蝙蝠侠战车鼠标 (Batmobile Mouse)',
        img: 'assets/project_3dprint_batmobile.jpg',
        baseTime: 16.0,
        baseWeight: 175,
        postDifficulty: '高'
    },
    'ironman': {
        name: '钢铁侠饰品收纳神器 (Iron Man Organizer)',
        img: 'assets/project_3dprint_ironman.jpg',
        baseTime: 8.5,
        baseWeight: 90,
        postDifficulty: '高'
    },
    'shower': {
        name: '环形防溅沐浴喷头 (Shower Nozzle)',
        img: 'assets/project_3dprint_shower.jpg',
        baseTime: 4.2,
        baseWeight: 45,
        postDifficulty: '极低'
    }
};

const materialPricing = {
    'PLA': { costPerGram: 0.16, densityMultiplier: 1.0, qualityName: '精细 (0.2mm标准层纹)' },
    'Resin': { costPerGram: 0.45, densityMultiplier: 1.15, qualityName: '超精细 (液态光固化微米级)' },
    'PETG': { costPerGram: 0.22, densityMultiplier: 1.05, qualityName: '精细 (工业级高抗冲击)' }
};

const postProcessingData = {
    'raw': { cost: 0, qualityText: '（素材表面）' },
    'sanded': { cost: 12, qualityText: '（手工磨砂光滑）' },
    'painted': { cost: 40, qualityText: '（艺术喷漆涂装成品级）' }
};

function update3DPrintModel() {
    const selectedModel = document.getElementById('print-model').value;
    const model = modelData[selectedModel];
    if (!model) return;
    
    // Update preview image
    const imgEl = document.getElementById('print-model-img');
    imgEl.src = model.img;
    imgEl.alt = model.name;
    
    update3DPrintParams();
}

function update3DPrintParams() {
    const selectedModel = document.getElementById('print-model').value;
    const material = document.getElementById('print-material').value;
    const postProcess = document.getElementById('post-process').value;
    const infill = parseInt(document.getElementById('infill-density').value);
    const layerHeight = parseInt(document.getElementById('layer-height').value) / 100; // in mm

    // Update Slider text representation
    document.getElementById('val-infill-density').innerText = `${infill}%`;
    document.getElementById('val-layer-height').innerText = `${layerHeight.toFixed(2)} mm`;

    const model = modelData[selectedModel];
    const mat = materialPricing[material];
    const post = postProcessingData[postProcess];
    if (!model || !mat || !post) return;

    // Calculate math variables
    // Infill multiplier: 0.3 + 0.7 * (infill / 100)
    const infillFactor = 0.3 + 0.7 * (infill / 100);
    const weight = model.baseWeight * infillFactor * mat.densityMultiplier;

    // Layer height multiplier: 0.2mm is standard. Smaller layer height = more layers = longer time
    const layerFactor = 0.20 / layerHeight;
    const time = model.baseTime * infillFactor * layerFactor;

    // Cost: material weight cost + post process cost + wear & power cost (¥0.5 per hour)
    const cost = (weight * mat.costPerGram) + post.cost + (time * 0.6);

    // Dynamic output updates
    document.getElementById('telemetry-print-weight').innerText = `${weight.toFixed(1)} g`;
    document.getElementById('telemetry-print-time').innerText = formatPrintTime(time);
    document.getElementById('telemetry-print-cost').innerText = `¥ ${cost.toFixed(2)}`;

    // Quality determination text
    let resolutionText = mat.qualityName;
    if (postProcess === 'sanded') {
        resolutionText = '光滑 ' + post.qualityText;
    } else if (postProcess === 'painted') {
        resolutionText = '完美 ' + post.qualityText;
    }
    document.getElementById('telemetry-print-resolution').innerText = resolutionText;
}

function formatPrintTime(hours) {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (h === 0) return `${m} 分钟`;
    return `${h} 小时 ${m} 分钟`;
}

let isPrintingSim = false;
function start3DPrintSimulation() {
    if (isPrintingSim) return;
    isPrintingSim = true;

    const statusEl = document.getElementById('print-status');
    const overlayEl = document.getElementById('print-layer-overlay');
    const pctEl = document.getElementById('print-percentage-overlay');
    const containerEl = document.querySelector('.print-preview-container');

    statusEl.innerText = "📁 切片并生成 G-code 中...";
    statusEl.className = "vis-status";
    pctEl.style.display = "block";
    pctEl.innerText = "0%";
    overlayEl.style.height = "0%";
    containerEl.classList.add('printing-active');

    setTimeout(() => {
        statusEl.innerText = "🖨️ 正在模拟打印首层...";
        statusEl.className = "vis-status success";

        let progress = 0;
        const printInterval = setInterval(() => {
            progress += 2;
            pctEl.innerText = `${progress}%`;
            overlayEl.style.height = `${progress}%`;

            if (progress % 20 === 0 && progress < 100) {
                statusEl.innerText = `🖨️ 正在模拟打印 (${progress}%)...`;
            }

            if (progress >= 100) {
                clearInterval(printInterval);
                statusEl.innerText = "🎉 打印完成！实体成果已呈现";
                statusEl.className = "vis-status success";
                pctEl.style.display = "none";
                overlayEl.style.height = "0%";
                containerEl.classList.remove('printing-active');
                isPrintingSim = false;
                
                const selectedModel = document.getElementById('print-model').value;
                const model = modelData[selectedModel];
                alert(`恭喜！3D打印机切片仿真完成，成功“造出”了大姐的实体文创作品「${model.name}」！您可以随时切换其他造物原型进行研究。`);
            }
        }, 60);
    }, 1200);
}

// --- Project 9: Lightbox Modal Controls for Certificates ---
function openHonorModal(imgName, title, desc) {
    const modal = document.getElementById('honor-modal');
    const modalImg = document.getElementById('honor-modal-img');
    const modalTitle = document.getElementById('honor-modal-title');
    const modalDesc = document.getElementById('honor-modal-desc');

    modalImg.src = `assets/${imgName}`;
    modalTitle.innerText = title;
    modalDesc.innerText = desc;
    modal.style.display = 'flex';
}

function closeHonorModal() {
    const modal = document.getElementById('honor-modal');
    modal.style.display = 'none';
}


// --- Dom Initialization ---
document.addEventListener("DOMContentLoaded", () => {
    fetchGitHubProfile();
    calculateASTFit();
    update3DPrintParams();
});


