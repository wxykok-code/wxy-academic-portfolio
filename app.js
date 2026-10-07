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
    'ntu': { math: 215, physics: 205, english: 215, name: '南洋理工大学 (NTU 会计/海事)' },
    'smu': { math: 210, physics: 195, english: 220, name: '新加坡管理大学 (SMU 会计/商业分析)' },
    'nus': { math: 225, physics: 215, english: 220, name: '新加坡国立大学 (NUS)' },
    'hku': { math: 205, physics: 195, english: 210, name: '香港大学 (HKU 经管/理学)' },
    'cambridge': { math: 260, physics: 265, english: 230, name: '剑桥大学' }
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


// --- Project 7: Multi-Language Switcher Engine (i18n) ---
let currentLang = 'zh';

const i18n = {
    'zh': {
        // NAV
        'nav-about': '关于我',
        'nav-projects': '科学实践',
        'nav-timeline': '升学规划',
        'nav-contact': '联系 Astrid',
        
        // HERO
        'hero-tag-1': '数理实证探究',
        'hero-tag-2': '全球系统与商业分析',
        'hero-tag-3': '双语国际视野',
        'school-info': '🏫 包头市第九十五中学（原包钢一中）· 高三（2412班）',
        'motto-text': '“ 光而不耀，静水流深 ”',
        'career-text': '🎯 <strong>未来方向</strong>：定量分析与会计审计架构 / 国际海事与航运金融 / 商业信息系统',
        'bio-intro': '你好！我是王馨莹（Astrid）。就读于包头市第九十五中学（原包钢一中，始建于1960年自治区首批重点中学、WLSA世界名中学联盟校）。我是一个兼具严谨数理实证精神与敏锐全球视野的跨学科探索者。我喜欢将课本上的公式在现实中转化为可运行的物理与工程实体，更热衷于将严谨的定量科学思维拓展至现代商业架构、会计审计合规签字以及全球海事航运供应链等庞大复杂系统。目前，我已在 <strong>AST（艾思特考试）</strong> 首战斩获 <strong>631分</strong>（英语 231、数学 206、物理 194），并取得 <strong>雅思 6.5分</strong>，全力冲击新加坡南洋理工大学（NTU 会计/海事）、新加坡管理大学（SMU 会计与商业分析）、香港大学（HKU）及爱尔兰顶尖大学等世界一流学府！',
        'btn-projects': '查看科学与实践项目',
        'btn-cv': '📄 查看官方学术履历 (CV)',
        'btn-visit-site': '📄 查看官方学术履历 (CV)',
        'github-live-title': '💻 GitHub 实时动态:',
        
        // ABOUT ME STATS
        'stat-phys-title': '物理与电子实践',
        'stat-phys-desc': '自主研制多级电磁线圈发射装置（电磁炮），成功进行电容储能到高强度电磁驱动的能量转化实验。',
        'stat-chem-title': '通用技术创客',
        'stat-chem-desc': '设计并3D打印多款具有完整功能的文创手办及工业零配件，深度跑通建模、切片与后期涂装工程。',
        'stat-lang-title': '外语学术素养',
        'stat-lang-desc': '雅思首考通关，外研社杯省级一等奖。具备流利的英文学术文献阅读、论文探讨与国际交流能力。',
        'stat-ms-title': '微软技术沉淀',
        'stat-ms-desc': '已获 25,275 XP 积分，累记18个徽章和4个奖杯。主攻 Azure 云计算及 Power Platform 数字化开发。',

        // HONORS SECTION
        'honors-title': '🏆 个人荣誉与社会实践墙',
        'honors-subtitle': '在学术、艺术、社会服务中践行多元化发展',
        
        'cert1-tag': '物理学科 / 学术竞赛',
        'cert1-award': '省二等奖',
        'cert1-title': '第40届全国中学生物理竞赛',
        'cert1-desc': '全国中学生物理竞赛（内蒙古赛区）二等奖，体现出卓越电磁学与经典力学解题及实验思维。',
        
        'cert2-tag': '英语语言 / 国际认可',
        'cert2-award': '雅思通过',
        'cert2-title': 'IELTS 雅思学术类首考通关',
        'cert2-desc': '具备流畅的国际化学术沟通能力，听力与阅读基础坚实，为海外名校申请奠定坚实的语言基石。',
        
        'cert3-tag': '外语竞赛 / 学术演讲',
        'cert3-award': '省一等奖',
        'cert3-title': '外研社·国才杯英语大赛复赛',
        'cert3-desc': '荣获内蒙古赛区一等奖，展示出优秀的英语公共表达、跨文化交际与批判性思维能力。',
        
        'cert4-tag': '社会实践 / 公益助教',
        'cert4-award': '荣誉称号',
        'cert4-title': '包钢幼教十二园绘本与科学助教',
        'cert4-desc': '荣获“绘本故事讲述优秀助教”、“绘本剧创编优秀助教”、“科学实验优秀指导助教”等多项荣誉，体现极强的社会责任感与跨年龄沟通能力。',
        
        'cert5-tag': '社区服务 / 社会实践',
        'cert5-award': '积极贡献',
        'cert5-title': '少先路街道社区优秀志愿者',
        'cert5-desc': '常年参与社区垃圾分类宣传、困难人群慰问等少先路街道社会实践工作，用奉献谱写担当。',
        
        'cert6-tag': '艺术素养 / 钢琴十级',
        'cert6-award': '全国十级',
        'cert6-title': '中国音乐学院钢琴十级证书',
        'cert6-desc': '通过社会艺术水平钢琴十级考核（最高级别），展现出极高艺术审美、卓越的手眼协调与坚韧的练习毅力。',
        
        'cert7-tag': '美术专业 / 艺术水平',
        'cert7-award': '速写九级(满级)',
        'cert7-title': '中国美术学院速写九级证书',
        'cert7-desc': '荣获中国美术学院社会美术水平考级“速写九级”满级证书，具备卓越的瞬间形体捕捉、空间速记与视觉构图功底。',
        
        'cert8-tag': '美术专业 / 艺术水平',
        'cert8-award': '素描六级',
        'cert8-title': '中国美术学院素描六级证书',
        'cert8-desc': '通过中国美术学院“素描六级”考核，打下了扎实的静物透视、明暗影调与空间体积重现等美术造型底子。',
        
        'cert9-tag': '素养修身 / 意志品格',
        'cert9-award': '优秀学员',
        'cert9-title': '校级军训优秀学员荣誉',
        'cert9-desc': '在高中新生军训中，因严守纪律、刻苦训练和突出的综合意志力被授予优秀学员称号。',

        // PROJECTS SECTION
        'sec-title-projects': '🔬 科学与工程项目实践',
        'sec-subtitle-projects': '点击下方项目页签进行实时模拟与互动体验',
        'tab-coilgun': '⚡ 多级电磁发射装置',
        'tab-3dprint': '🖨️ 3D打印创客工坊',
        'tab-chemistry': '🧪 元素周期表解码器',
        'tab-speech': '🎤 梦想之龙英文演讲',
        'tab-mslearn': '☁️ Microsoft Learn 学习轨迹',
        'tab-arxiv': '📚 学术文献前沿雷达',
        'tab-ast': '🎯 AST 录取计算器',
        
        // 3D PRINT SIMULATOR
        'print-panel-title': '3D打印技术与手办文创制作的融合应用',
        'print-panel-desc': '结合高中通用技术与个性化文创设计。探究涵盖了从 3D 建模、切片参数调整到后期打磨上色组装的完整流程。项目对比了不同耗材（PLA、树脂、PETG）的力学表现与工艺成本，实现“指尖造物”的数字化智造理念。',
        'label-print-model': '选择造物原型 (实时展示 Astrid 的实体作品)',
        'label-print-material': '打印耗材',
        'option-mat-pla': 'PLA 环保塑料 (通用)',
        'option-mat-resin': '树脂 Resin (高光固化高精度)',
        'option-mat-petg': 'PETG 耐温塑料 (工业级)',
        'label-post-process': '后期表面处理',
        'option-post-raw': '无处理 (保留原始层纹)',
        'option-post-sanded': '手工打磨抛光 (亚光细腻)',
        'option-post-painted': '精细艺术喷漆 (成品模型级)',
        'label-infill-density': '填充密度:',
        'label-layer-height': '打印层高 (决定精度):',
        'btn-slice-print': '🖨️ 开始切片与仿真打印',
        'viz-print-header': '📟 3D 打印工作流终端',
        'print-status-idle': '待机中',
        'label-print-time': '⌛ 估算打印耗时:',
        'label-print-weight': '⚖️ 消耗耗材重量:',
        'label-print-cost': '💰 打印综合成本:',
        'label-print-res': '🔍 表面完工分辨率:',
        
        // COILGUN SIMULATOR
        'coilgun-panel-title': '多级线圈电磁炮物理实验模型 (EE 预备项目)',
        'coilgun-panel-desc': '基于高中电磁感应、安培力及电容储能原理自主搭建的发射模型。电磁炮通过高压电容器组快速放电，瞬间在线圈中产生极强脉冲电流与交变磁场，吸引并加速铁磁性弹丸。通过模拟电路搭建和传感器，探究电磁驱动效率。',
        'label-voltage': '电容充电电压 (V):',
        'label-capacitance': '储能电容容量 (μF):',
        'label-projectile-mass': '铁磁弹丸质量 (g):',
        'btn-launch': '⚡ 脉冲点火发射！',
        'viz-coilgun-header': '🚀 实时物理状态仿真仪',
        'coilgun-status-idle': '就绪',
        'label-telemetry-energy': '🔋 电容储能总量:',
        'label-telemetry-magnetic': '🧲 线圈峰值磁感强度:',
        'label-telemetry-current': '🔌 瞬间放电电流:',
        'label-telemetry-velocity': '📈 弹丸出口速度:',
        
        // ARXIV RADAR
        'arxiv-panel-title': '📡 全球前沿学术雷达 (定量系统与复杂网络专向)',
        'arxiv-panel-desc': '本组件实时连接至全球开源学术文献数据库。可自动检索或通过下方预设主题，实时拉取并扫描定量运筹优化、国际海事物流、商业信息系统等核心方向的最新前沿文献，用于学术储备。',
        'label-arxiv-query': '检索关键词 (英文)',
        'btn-scan-arxiv': '📡 扫描全球学术数据库',
        'arxiv-preset-label': '热门预设主题：',
        'btn-preset-coilgun': '电磁加速',
        'btn-preset-vlsi': '海事物流与航运金融',
        'btn-preset-wpt': '供应链网络优化',
        'btn-preset-robotics': '智能信息系统',
        'viz-arxiv-header': '📖 实时科研论文检索结果 (TOP 3)',
        'arxiv-status-idle': '空闲',
        'arxiv-results-placeholder': '请输入关键词或选择预设主题，点击上方“扫描”按钮实时拉取学术档案。',

        // AST Admissions Calculator
        'ast-panel-title': '🎯 AST 录取匹配度计算器 (新加坡与顶尖名校专项匹配)',
        'ast-panel-desc': '艾思特（AST）考试是世界名校遴选中国英才的重要参考。选择您的目标名校，拖动模拟分数滑块，系统会基于各大名校往年录取线与学科权重（重点考察英语、数学与物理），实时测算录取匹配指数。',
        'label-ast-school': '目标高校',
        'option-school-hku': '香港大学 (The University of Hong Kong)',
        'option-school-nus': '新加坡国立大学 (National University of Singapore)',
        'option-school-ntu': '南洋理工大学 (Nanyang Technological University)',
        'option-school-cambridge': '剑桥大学 (University of Cambridge)',
        'label-ast-math': 'AST 数学 (模拟分):',
        'label-ast-physics': 'AST 物理 (模拟分):',
        'label-ast-english': 'AST 英语 (模拟分):',
        'viz-ast-header': '📊 录取概算测成看板',
        'ast-status-ready': '就绪',
        'label-ast-fit': '🎯 目标专业录取匹配指数',
        'ast-advice-placeholder': '正在匹配中...',
        
        // TIMELINE
        'sec-title-timeline': '📅 升学路线图 & 关键里程碑',
        'sec-subtitle-timeline': '2026 - 2027 备战全球一流名校的冲刺路线',
        'timeline-date-1': '2026年6月',
        'timeline-status-1': '已完成',
        'timeline-h-1': '雅思学术类首考',
        'timeline-d-1': '于北京国试大厦完成雅思考试，听力与阅读均表现优异，具备了深厚的国际化学术阅读与科研会话水准。',
        'timeline-date-2': '2026年8月',
        'timeline-status-2': '进行中',
        'timeline-h-2': 'AST（艾思特）考试冲刺 (主攻物理/数学/英语)',
        'timeline-d-2': '参加世界名校中国英才遴选考试（AST）首考，斩获 631 分（英语突破231分）。已锁定 2026 年 12 月二战，主攻高等数学与物理冲刺更高梯队，作为直通新加坡南洋理工大学、SMU、港大及爱尔兰顶尖大学会计与海事等专业的核心凭证。',
        'timeline-date-3': '2026年10月',
        'timeline-status-3': '准备中',
        'timeline-h-3': '香港名校提早批轮次递交申请',
        'timeline-d-3': '向香港大学（通过多元卓越计划）等递交入学申请，上传高中前五学期成绩、雅思成绩单以及科学工程项目成果报告。',
        'timeline-date-4': '2027年1月',
        'timeline-status-4': '准备中',
        'timeline-h-4': '新加坡公立大学递交与补充更新',
        'timeline-d-4': '提交南洋理工大学（NTU 会计/海事）与新加坡管理大学（SMU 会计/商业分析）等入学申请，补充最新的 AST 优异成绩单与雅思评级。',

        // CONTACT CARDS & FOOTER
        'contact-sec-title': '✉️ 联系方式',
        'c-card-email-h': '官方学术邮箱',
        'c-card-email-d': '一键拉起邮箱，与 Astrid 开展学术探讨',
        'c-card-site-h': '官方学术站',
        'c-card-site-d': '浏览 Astrid 的个人学术与升学展示空间',
        'c-card-git-h': 'GitHub 开源库',
        'c-card-git-d': '查看 Astrid 的物理模拟与数字化代码库',
        'c-card-loc-h': '地理位置',
        'c-card-loc-v': '内蒙古 · 包头 / 包钢一中',
        'c-card-loc-d': 'Astrid 目前就读的学校与日常研学基地',
        'footer-text': '&copy; 2026 Astrid Wang. All rights reserved. Created with 💜 for Astrid\'s academic aspirations.'
    },
    'zh-tw': {
        // NAV
        'nav-about': '關於我',
        'nav-projects': '科學實踐',
        'nav-timeline': '升學規劃',
        'nav-contact': '聯絡 Astrid',
        
        // HERO
        'hero-tag-1': '數理實證探究',
        'hero-tag-2': '全球系統與商業分析',
        'hero-tag-3': '雙語國際視野',
        'school-info': '🏫 包頭市第九十五中學（原包鋼一中）· 高三（2412班）',
        'motto-text': '“ 光而不耀，靜水流深 ”',
        'career-text': '🎯 <strong>未來方向</strong>：定量分析與會計審計架構 / 國際海事與航運金融 / 商業資訊系統',
        'bio-intro': '你好！我是王馨瑩（Astrid）。就讀於包頭市第九十五中學（原包鋼一中，始建於1960年自治區首批重點中學、WLSA世界名中學聯盟校）。我是一個兼具嚴謹數理實證精神與敏銳全球視野的跨學科探索者。我喜歡將課本上的公式在現實中轉化為可運行的物理與工程實體，更熱衷於將嚴謹的定量科學思維拓展至現代商業架構、會計審計合規簽字以及全球海事航運供應鏈等龐大複雜系統。目前，我已在 <strong>AST（艾思特考試）</strong> 首戰斬獲 <strong>631分</strong>（英語 231、數學 206、物理 194），並取得 <strong>雅思 6.5分</strong>，全力衝擊新加坡南洋理工大學（NTU 會計/海事）、新加坡管理大學（SMU 會計與商業分析）、香港大學（HKU）及愛爾蘭頂尖大學等世界一流學府！',
        'btn-projects': '查看科學與實踐項目',
        'btn-cv': '📄 查看官方學術履歷 (CV)',
        'btn-visit-site': '📄 查看官方學術履歷 (CV)',
        'github-live-title': '💻 GitHub 即時動態:',
        
        // ABOUT ME STATS
        'stat-phys-title': '物理與電子實踐',
        'stat-phys-desc': '自主研製多級電磁線圈發射裝置（電磁炮），成功進行電容儲能到高強度電磁驅動的能量轉化實驗。',
        'stat-chem-title': '通用技術創客',
        'stat-chem-desc': '設計並3D打印多款具有完整功能的文創手辦及工業零配件，深度跑通建模、切片與後期塗裝工程。',
        'stat-lang-title': '外語學術素養',
        'stat-lang-desc': '雅思首考通關，外研社杯省級一等獎。具備流利的英文學術文獻閱讀、論文探討與國際交流能力。',
        'stat-ms-title': '微軟技術沉澱',
        'stat-ms-desc': '已獲 25,275 XP 積分，累積18個徽章和4個獎杯。主攻 Azure 雲端運算及 Power Platform 數位化開發。',

        // HONORS SECTION
        'honors-title': '🏆 個人榮譽與社會實踐牆',
        'honors-subtitle': '在學術、藝術、社會服務中踐行多元化發展',
        
        'cert1-tag': '物理學科 / 學術競賽',
        'cert1-award': '省二等獎',
        'cert1-title': '第40屆全國中學生物理競賽',
        'cert1-desc': '全國中學生物理競賽（內蒙古賽區）二等獎，體現出卓越電磁學與經典力學解題及實驗思維。',
        
        'cert2-tag': '英語語言 / 國際認可',
        'cert2-award': '雅思通過',
        'cert2-title': 'IELTS 雅思學術類首考通關',
        'cert2-desc': '具備流暢的國際化學術溝通能力，聽力與閱讀基礎堅實，為海外名校申請奠定堅實的語言基石。',
        
        'cert3-tag': '外語競賽 / 學術演講',
        'cert3-award': '省一等獎',
        'cert3-title': '外研社·國才杯英語大賽複賽',
        'cert3-desc': '榮獲內蒙古賽區一等獎，展示出優秀的英語公共表達、跨文化交際與批判性思維能力。',
        
        'cert4-tag': '社會實踐 / 公益助教',
        'cert4-award': '榮譽稱號',
        'cert4-title': '包鋼幼教十二園繪本與科學助教',
        'cert4-desc': '榮獲“繪本故事講述優秀助教”、“繪本劇創編優秀助教”、“科學實驗優秀指導助教”等多項榮譽，體現極強的社會責任感與跨年齡溝通能力。',
        
        'cert5-tag': '社區服務 / 社會實踐',
        'cert5-award': '積極貢獻',
        'cert5-title': '少先路街道社區優秀志願者',
        'cert5-desc': '常年參與社區垃圾分類宣傳、困難人群慰問等少先路街道社會實踐工作，用奉獻譜寫擔當。',
        
        'cert6-tag': '藝術素養 / 鋼琴十級',
        'cert6-award': '全國十級',
        'cert6-title': '中國音樂學院鋼琴十級證書',
        'cert6-desc': '通過社會藝術水平鋼琴十級考核（最高級別），展現出極高藝術審美、卓越的手眼協調與堅韌的練習毅力。',
        
        'cert7-tag': '美術專業 / 藝術水平',
        'cert7-award': '速寫九級(滿級)',
        'cert7-title': '中國美術學院速寫九級證書',
        'cert7-desc': '榮獲中國美術學院社會美術水平考級“速寫九級”滿級證書，具備卓越的瞬間形體捕捉、空間速記與視覺構圖功底。',
        
        'cert8-tag': '美術專業 / 藝術水平',
        'cert8-award': '素描六級',
        'cert8-title': '中國美術學院素描六級證書',
        'cert8-desc': '通過中國美術學院“素描六級”考核，打下了扎實的靜物透視、明暗影調與空間體積重現等美術造型底子。',
        
        'cert9-tag': '素養修身 / 意志品格',
        'cert9-award': '優秀學員',
        'cert9-title': '校級軍訓優秀學員榮譽',
        'cert9-desc': '在高中新生軍訓中，因嚴守紀律、刻苦訓練和突出的綜合意志力被授予優秀學員稱號。',

        // PROJECTS SECTION
        'sec-title-projects': '🔬 科學與工程項目實踐',
        'sec-subtitle-projects': '點擊下方項目頁簽進行即時模擬與互動體驗',
        'tab-coilgun': '⚡ 多級電磁發射裝置',
        'tab-3dprint': '🖨️ 3D打印創客工坊',
        'tab-chemistry': '🧪 元素週期表解碼器',
        'tab-speech': '🎤 夢想之龍英文演講',
        'tab-mslearn': '☁️ Microsoft Learn 學習軌跡',
        'tab-arxiv': '📚 學術文獻前沿雷達',
        'tab-ast': '🎯 AST 錄取計算器',
        
        // 3D PRINT SIMULATOR
        'print-panel-title': '3D打印技術與手辦文創製作的融合應用',
        'print-panel-desc': '結合高中通用技術與個性化文創設計。探究涵蓋了從 3D 建模、切片參數調整到後期打磨上色組裝的完整流程。項目對比了不同耗材（PLA、樹脂、PETG）的力學表現與工藝成本，實現“指尖造物”的數位化智造理念。',
        'label-print-model': '選擇造物原型 (即時展示 Astrid 的實體作品)',
        'label-print-material': '打印耗材',
        'option-mat-pla': 'PLA 環保塑料 (通用)',
        'option-mat-resin': '樹脂 Resin (高光固化高精度)',
        'option-mat-petg': 'PETG 耐溫塑料 (工業級)',
        'label-post-process': '後期表面處理',
        'option-post-raw': '無處理 (保留原始層紋)',
        'option-post-sanded': '手工打磨拋光 (亞光細緻)',
        'option-post-painted': '精細藝術噴漆 (成品模型級)',
        'label-infill-density': '填充密度:',
        'label-layer-height': '打印層高 (決定精度):',
        'btn-slice-print': '🖨️ 開始切片與仿真打印',
        'viz-print-header': '📟 3D 打印工作流終端',
        'print-status-idle': '待機中',
        'label-print-time': '⌛ 估算打印耗時:',
        'label-print-weight': '⚖️ 消耗耗材重量:',
        'label-print-cost': '💰 打印綜合成本:',
        'label-print-res': '🔍 表面完工解析度:',
        
        // COILGUN SIMULATOR
        'coilgun-panel-title': '多級線圈電磁炮物理實驗模型 (EE 預備項目)',
        'coilgun-panel-desc': '基於高中電磁感應、安培力及電容儲能原理自主搭建的發射模型。電磁炮通過高壓電容器組快速放电，瞬間線上圈中產生極強脈衝電流與交變磁場，吸引並加速鐵磁性彈丸。通過模擬電路搭建和傳感器，探究電磁驅動效率。',
        'label-voltage': '電容充電電壓 (V):',
        'label-capacitance': '儲能電容容量 (μF):',
        'label-projectile-mass': '鐵磁彈丸質量 (g):',
        'btn-launch': '⚡ 脈衝點火發射！',
        'viz-coilgun-header': '🚀 即時物理狀態仿真儀',
        'coilgun-status-idle': '就緒',
        'label-telemetry-energy': '🔋 電容儲能總量:',
        'label-telemetry-magnetic': '🧲 線圈峰值磁感強度:',
        'label-telemetry-current': '🔌 瞬間放電電流:',
        'label-telemetry-velocity': '📈 彈丸出口速度:',
        
        // ARXIV RADAR
        'arxiv-panel-title': '📡 全球前沿學術雷達 (定量系統與複雜網絡專向)',
        'arxiv-panel-desc': '本組件即時連接至全球開源學術文獻資料庫。可自動檢索或通過下方預設主題，即時拉取並掃描定量運籌優化、國際海事物流、商業資訊系統等核心方向的最新前沿文獻，用於學術儲備。',
        'label-arxiv-query': '檢索關鍵詞 (英文)',
        'btn-scan-arxiv': '📡 掃描全球學術資料庫',
        'arxiv-preset-label': '熱門預設主題：',
        'btn-preset-coilgun': '電磁加速',
        'btn-preset-vlsi': '海事物流與航運金融',
        'btn-preset-wpt': '供應鏈網絡優化',
        'btn-preset-robotics': '智能資訊系統',
        'viz-arxiv-header': '📖 即時科研論文檢索結果 (TOP 3)',
        'arxiv-status-idle': '空閒',
        'arxiv-results-placeholder': '請輸入關鍵詞或選擇預設主題，點擊上方“掃描”按鈕即時拉取學術檔案。',

        // AST Admissions Calculator
        'ast-panel-title': '🎯 AST 錄取匹配度計算器 (新加坡與頂尖名校專項匹配)',
        'ast-panel-desc': '艾思特（AST）考試是世界名校遴選中國英才的重要參考。選擇您的目標名校，拖動模擬分數滑塊，系統會基於各大名校往年錄取線與學科權重（重點考察英語、數學與物理），即時測算錄取匹配指數。',
        'label-ast-school': '目標高校',
        'option-school-hku': '香港大學 (The University of Hong Kong)',
        'option-school-nus': '新加坡國立大學 (National University of Singapore)',
        'option-school-ntu': '南洋理工大學 (Nanyang Technological University)',
        'option-school-cambridge': '劍橋大學 (University of Cambridge)',
        'label-ast-math': 'AST 數學 (模擬分):',
        'label-ast-physics': 'AST 物理 (模擬分):',
        'label-ast-english': 'AST 英語 (模擬分):',
        'viz-ast-header': '📊 錄取概算測成看板',
        'ast-status-ready': '就緒',
        'label-ast-fit': '🎯 目標專業錄取匹配指數',
        'ast-advice-placeholder': '正在匹配中...',
        
        // TIMELINE
        'sec-title-timeline': '📅 升學路線圖 & 關鍵里程碑',
        'sec-subtitle-timeline': '2026 - 2027 備戰全球一流名校的衝刺路線',
        'timeline-date-1': '2026年6月',
        'timeline-status-1': '已完成',
        'timeline-h-1': '雅思學術類首考',
        'timeline-d-1': '於北京國試大廈完成雅思考試，聽力與閱讀均表現優異，具備了深厚的國際化學術閱讀與科研會話水準。',
        'timeline-date-2': '2026年8月',
        'timeline-status-2': '進行中',
        'timeline-h-2': 'AST（艾思特）考試衝刺 (主攻物理/數學/英語)',
        'timeline-d-2': '參加世界名校中國英才遴選考試（AST）首考，斬獲 631 分（英語突破231分）。已鎖定 2026 年 12 月二戰，主攻高等數學與物理衝刺更高梯隊，作為直通新加坡南洋理工大學、SMU、港大及愛爾蘭頂尖大學會計與海事等專業的核心憑證。',
        'timeline-date-3': '2026年10月',
        'timeline-status-3': '準備中',
        'timeline-h-3': '香港名校提早批輪次遞交申請',
        'timeline-d-3': '向香港大學（通過多元卓越計劃）等遞交入學申請，上傳高中前五學期成績、雅思成績单以及科學工程項目成果報告。',
        'timeline-date-4': '2027年1月',
        'timeline-status-4': '準備中',
        'timeline-h-4': '新加坡公立大學遞交與補充更新',
        'timeline-d-4': '提交南洋理工大學（NTU 會計/海事）與新加坡管理大學（SMU 會計/商業分析）等入學申請，補充最新的 AST 優秀成績單與雅思最終評級。',

        // CONTACT CARDS & FOOTER
        'contact-sec-title': '✉️ 聯絡方式',
        'c-card-email-h': '官方學術郵箱',
        'c-card-email-d': '一鍵拉起郵箱，與 Astrid 開展學術探討',
        'c-card-site-h': '官方學術站',
        'c-card-site-d': '瀏覽 Astrid 的個人學術與升學展示空間',
        'c-card-git-h': '邊覽 Astrid 的物理模擬與數位化代碼庫',
        'c-card-git-d': '查看 Astrid 的物理模擬與數位化代碼庫',
        'c-card-loc-h': '地理位置',
        'c-card-loc-v': '內蒙古 · 包頭 / 包鋼一中',
        'c-card-loc-d': 'Astrid 目前就讀的學校與日常研學基地',
        'footer-text': '&copy; 2026 Astrid Wang. All rights reserved. Created with 💜 for Astrid\'s academic aspirations.'
    },
    'en': {
        // NAV
        'nav-about': 'About Me',
        'nav-projects': 'Research',
        'nav-timeline': 'Milestones',
        'nav-contact': 'Contact Astrid',
        
        // HERO
        'hero-tag-1': 'Quantitative & STEM Explorer',
        'hero-tag-2': 'Global Systems & Business Analytics',
        'hero-tag-3': 'Bilingual Academic Communication',
        'school-info': '🏫 Baotou No.95 Middle School (formerly Baogang No.1 High) · Senior 3 (Class 2412)',
        'motto-text': '"Light but not dazzling, still waters run deep"',
        'career-text': '🎯 <strong>Future Direction</strong>: Quantitative Analysis & Accountancy / International Maritime & Shipping Logistics / Business Information Systems',
        'bio-intro': 'Hello! I am Astrid Wang (王馨莹). I attend Baotou No.95 Middle School (formerly Baogang No.1 High School, est. 1960, premier provincial key high school and WLSA member school). I am an interdisciplinary explorer combining rigorous quantitative empirical logic with keen global industry insight. Beyond STEM experimentation, I am dedicated to applying quantitative precision to complex enterprise architectures—including statutory accountancy & audit compliance, international maritime shipping supply networks, and business analytics. Having achieved an official AST benchmark score of 631 (English 231, Math 206, Physics 194) and IELTS 6.5, I am actively targeting premier undergraduate programs at Nanyang Technological University (NTU), Singapore Management University (SMU), The University of Hong Kong (HKU), and leading global institutions.',
        'btn-projects': 'View Projects',
        'btn-cv': '📄 Official Academic CV',
        'btn-visit-site': '📄 Official Academic CV',
        'github-live-title': '💻 GitHub Live Telemetry:',
        
        // ABOUT ME STATS
        'stat-phys-title': 'Physics & EEE Projects',
        'stat-phys-desc': 'Developed a multi-stage electromagnetic coilgun launcher, analyzing capacitor energy storage discharge and electromagnetic force propulsion.',
        'stat-chem-title': 'Digital Creative Prototyping',
        'stat-chem-desc': 'Designed, sliced, and fabricated various functional parts and creative miniatures utilizing FDM/Resin 3D printers and manual finishing.',
        'stat-lang-title': 'Language Literacy',
        'stat-lang-desc': 'Cleared IELTS on the first attempt; won 1st prize in the FLTRP Cup Regional Contest. Highly competent in reading research literature and presentation.',
        'stat-ms-title': 'Microsoft Tech Stack',
        'stat-ms-desc': 'Achieved 25,275 XP, unlocking 18 badges and 4 trophies. Main focused on Azure Cloud Infrastructure and Power Platform automation.',

        // HONORS SECTION
        'honors-title': '🏆 Personal Honors & Achievements',
        'honors-subtitle': 'Pursuing multi-dimensional excellence in academics, arts, and volunteer services',
        
        'cert1-tag': 'Physics / Academic Contest',
        'cert1-award': '2nd Prize',
        'cert1-title': '40th Chinese Physics Olympiad',
        'cert1-desc': 'Awarded regional 2nd prize in Inner Mongolia, demonstrating strong skills in classical mechanics, electromagnetism, and logic.',
        
        'cert2-tag': 'Language / Global Standard',
        'cert2-award': 'IELTS Cleared',
        'cert2-title': 'IELTS Academic Exam Success',
        'cert2-desc': 'Achieved competitive scores demonstrating strong readiness for global academic learning and scientific research environments.',
        
        'cert3-tag': 'Language / Public Speaking',
        'cert3-award': '1st Prize',
        'cert3-title': 'FLTRP Cup English Literacy Contest',
        'cert3-desc': 'Won provincial 1st prize, showing strong capacity in public presentation, reasoning, and cross-cultural communication.',
        
        'cert4-tag': 'Practice / Kindergarten Assistant',
        'cert4-award': 'Honorary Star',
        'cert4-title': 'Voluntary Science & Storytelling Teaching',
        'cert4-desc': 'Honored as Outstanding Science & Reading Assistant in Baogang 12th Kindergarten, showcasing strong empathy and communication skills.',
        
        'cert5-tag': 'Practice / Neighborhood Service',
        'cert5-award': 'Volunteer Cert',
        'cert5-title': 'Community Volunteer Services Star',
        'cert5-desc': 'Regularly assisted in community organization, garbage classification promotion, and neighborhood care activities.',
        
        'cert6-tag': 'Arts / Piano Grade 10',
        'cert6-award': 'Grade 10',
        'cert6-title': 'China Conservatory Grade 10 Piano Cert',
        'cert6-desc': 'Achieved the maximum level 10 piano performance grading, illustrating years of musical training, coordination, and willpower.',
        
        'cert7-tag': 'Arts / CAA Sketching Grade 9',
        'cert7-award': 'Grade 9 (Max)',
        'cert7-title': 'CAA Social Art Sketching Grade 9',
        'cert7-desc': 'Awarded the maximum grade 9 Sketching certificate by China Academy of Art, demonstrating excellent quick form capture.',
        
        'cert8-tag': 'Arts / CAA Drawing Grade 6',
        'cert8-award': 'Grade 6',
        'cert8-title': 'CAA Social Art Drawing Grade 6',
        'cert8-desc': 'Passed CAA Grade 6 Drawing evaluation, building strong foundations in perspective, light representation, and forms rendering.',
        
        'cert9-tag': 'Character / Physical Discipline',
        'cert9-award': 'Outstanding Cadet',
        'cert9-title': 'Military Boot Camp Outstanding Cadet',
        'cert9-desc': 'Honored for extreme physical endurance, teamwork, and strong discipline during high school intensive boot camp training.',

        // PROJECTS SECTION
        'sec-title-projects': '🔬 Science & Engineering Practice',
        'sec-subtitle-projects': 'Click project tabs below for real-time simulations and interactive experiences',
        'tab-coilgun': '⚡ Electromagnetic Launcher',
        'tab-3dprint': '🖨️ 3D Printing Workshop',
        'tab-chemistry': '🧪 Periodic Table Decoder',
        'tab-speech': '🎤 Imagine Dragons Speech',
        'tab-mslearn': '☁️ Microsoft Learn Transcript',
        'tab-arxiv': '📚 Academic Literature Radar',
        'tab-ast': '🎯 AST Admissions Calculator',
        
        // 3D PRINT SIMULATOR
        'print-panel-title': '3D Printing Prototyping & Creative Integration',
        'print-panel-desc': 'Synthesizes general technology concepts with creative design. Explores the workflow from 3D modeling, slicer parameters tweaking, to post-sanding and coloring. Compares physical qualities of PLA, Resin, and PETG.',
        'label-print-model': 'Select Prototyping Model (Astrid\'s real creations)',
        'label-print-material': 'Material Filament',
        'option-mat-pla': 'PLA Eco-plastic (General)',
        'option-mat-resin': 'Resin (High-precision SLA)',
        'option-mat-petg': 'PETG (Industrial strength)',
        'label-post-process': 'Post Surface Processing',
        'option-post-raw': 'Raw (Keep original layer lines)',
        'option-post-sanded': 'Hand-sanded & Polished (Satin)',
        'option-post-painted': 'Fine Artistic Painted (Collector tier)',
        'label-infill-density': 'Infill Density:',
        'label-layer-height': 'Layer Height (Resolution):',
        'btn-slice-print': '🖨️ Start Slicing & Simulating Print',
        'viz-print-header': '📟 3D Printer Slicer Console',
        'print-status-idle': 'Idle',
        'label-print-time': '⌛ Estimated Print Time:',
        'label-print-weight': '⚖️ Filament Net Weight:',
        'label-print-cost': '💰 Fabrication Cost:',
        'label-print-res': '🔍 Surface Resolution:',
        
        // COILGUN SIMULATOR
        'coilgun-panel-title': 'Multi-stage Electromagnetic Launcher Model (EE Prep)',
        'coilgun-panel-desc': 'Built based on high-school electromagnetic induction, Ampere force, and capacitor energy storage principles. High-capacitance storage discharges instantly to create high pulse current, generating magnetic field to accelerate the projectile.',
        'label-voltage': 'Capacitor Voltage (V):',
        'label-capacitance': 'Capacitor Capacitance (μF):',
        'label-projectile-mass': 'Projectile Mass (g):',
        'btn-launch': '⚡ Pulse Discharge Fire!',
        'viz-coilgun-header': '🚀 Real-time Telemetry Simulator',
        'coilgun-status-idle': 'Ready',
        'label-telemetry-energy': '🔋 Cap Stored Energy:',
        'label-telemetry-magnetic': '🧲 Peak Magnetic Flux B:',
        'label-telemetry-current': '🔌 Pulsed Discharge Peak I:',
        'label-telemetry-velocity': '📈 Projectile Exit Velocity:',
        
        // ARXIV RADAR
        'arxiv-panel-title': '📡 Global Academic Literature Radar (Quantitative & Systems Focus)',
        'arxiv-panel-desc': 'Connected live to global open-source literature repositories. Automatically retrieves and scans cutting-edge papers across operations optimization, maritime supply networks, and business information systems.',
        'label-arxiv-query': 'Search Query (English)',
        'btn-scan-arxiv': '📡 Scan Academic Repositories',
        'arxiv-preset-label': 'Trending Focus Areas:',
        'btn-preset-coilgun': 'Electromagnetic Accelerators',
        'btn-preset-vlsi': 'Maritime & Shipping Finance',
        'btn-preset-wpt': 'Supply Chain Network Optimization',
        'btn-preset-robotics': 'Business Information Systems',
        'viz-arxiv-header': '📖 Live Academic Literature Feed (TOP 3)',
        'arxiv-status-idle': 'Idle',
        'arxiv-results-placeholder': 'Enter search keywords or select a focus topic, then click "Scan Academic Repositories" to retrieve live records.',

        // AST Admissions Calculator
        'ast-panel-title': '🎯 AST Admissions Calculator (Singapore & Global Top Match)',
        'ast-panel-desc': 'The Ameson Science & Technology Test (AST) is widely used by elite universities. Drag scores sliders to calculate your admissions fit index based on historic lines and subject coefficients (English, Math, and Physics).',
        'label-ast-school': 'Target Institution',
        'option-school-hku': 'The University of Hong Kong',
        'option-school-nus': 'National University of Singapore',
        'option-school-ntu': 'Nanyang Technological University',
        'option-school-cambridge': 'University of Cambridge',
        'label-ast-math': 'AST Math (Mock Score):',
        'label-ast-physics': 'AST Physics (Mock Score):',
        'label-ast-english': 'AST English (Mock Score):',
        'viz-ast-header': '📊 Fit Analytics Dashboard',
        'ast-status-ready': 'Ready',
        'label-ast-fit': '🎯 Target Program Fit Index',
        'ast-advice-placeholder': 'Analyzing fit indexes...',
        
        // TIMELINE
        'sec-title-timeline': '📅 Higher Education Roadmap & Milestones',
        'sec-subtitle-timeline': '2026 - 2027 Academic Sprint for Top-Tier Universities',
        'timeline-date-1': 'June 2026',
        'timeline-status-1': 'Completed',
        'timeline-h-1': 'First IELTS Academic Exam',
        'timeline-d-1': 'Completed IELTS exam at Beijing Guoshi Building, scoring 6.5. Demonstrated strong international reading and listening aptitude.',
        'timeline-date-2': 'August 2026',
        'timeline-status-2': 'Achieved (631)',
        'timeline-h-2': 'AST Examination First Attempt (Score: 631)',
        'timeline-d-2': 'Achieved an official AST score of 631 (English: 231). Locked in December 2026 retake to advance Higher Mathematics and Physics benchmarks, directly targeting NTU, SMU, HKU, and top Irish institutions.',
        'timeline-date-3': 'October 2026',
        'timeline-status-3': 'Pending',
        'timeline-h-3': 'Hong Kong Universities Early Application',
        'timeline-d-3': 'Submitting applications to HKU (via Multidimensional Excellence Scheme), PolyU, etc. Uploading transcripts and quantitative academic reports.',
        'timeline-date-4': 'January 2027',
        'timeline-status-4': 'Pending',
        'timeline-h-4': 'Singapore Admissions Submission',
        'timeline-d-4': 'Submitting applications to NTU (Accountancy / Maritime) and SMU (Accountancy / Business Analytics), updating files with outstanding AST scores and IELTS reports.',

        // CONTACT CARDS & FOOTER
        'contact-sec-title': '✉️ Contact Information',
        'c-card-email-h': 'Academic Email',
        'c-card-email-d': 'Launch mail client to discuss academic topics with Astrid',
        'c-card-site-h': 'Academic Site',
        'c-card-site-d': 'Visit Astrid\'s personal academic and admissions showcase portal',
        'c-card-git-h': 'GitHub Repo',
        'c-card-git-d': 'View Astrid\'s open-source physics simulations and codebases',
        'c-card-loc-h': 'Location',
        'c-card-loc-v': 'Baotou, Inner Mongolia / Baogang No.1 High',
        'c-card-loc-d': 'Astrid\'s current high school and research lab base',
        'footer-text': '&copy; 2026 Astrid Wang. All rights reserved. Created with 💜 for Astrid\'s academic aspirations.'
    }
};

function switchLanguage(lang) {
    currentLang = lang;
    const data = i18n[lang];
    if (!data) return;

    // Scan and translate all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (data[key]) {
            if (data[key].includes('<strong') || data[key].includes('<span') || data[key].includes('<a') || data[key].includes('&copy;') || data[key].includes('💜')) {
                el.innerHTML = data[key];
            } else {
                el.innerText = data[key];
            }
        }
    });

    // Update select element value to remain in sync
    const selectEl = document.getElementById('lang-select');
    if (selectEl) selectEl.value = lang;
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
    
    // Set high AST defaults to showcase best fit
    document.getElementById('ast-math').value = 245;
    document.getElementById('ast-physics').value = 255;
    document.getElementById('ast-english').value = 220;
    updateASTSliderVal('math');
    updateASTSliderVal('physics');
    updateASTSliderVal('english');
    calculateASTFit();
    
    // Auto-trigger academic radar with relevant research topics
    document.getElementById('arxiv-query').value = "Aerospace AI & Trajectory";
    searchAcademicPapers();
    
    // Initialize standard translations
    switchLanguage('zh');
    update3DPrintParams();
});


