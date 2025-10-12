// 页面加载完成后隐藏加载动画
window.addEventListener('load', function() {
    const loadTime = performance.now();
    document.getElementById('loadTime').textContent = Math.round(loadTime);
    
    setTimeout(function() {
        document.getElementById('loader').classList.add('hidden');
    }, 1000);
    
    // 初始化懒加载
    const observer = lozad('.lazyload', {
        rootMargin: '100px 0px',
        threshold: 0.1,
        loaded: function(el) {
            el.classList.add('loaded');
        }
    });
    observer.observe();
});

// 时间显示功能
function updateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    document.getElementById('current-time').textContent = 
        `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

// 初始更新
updateTime();

// 每秒更新一次
setInterval(updateTime, 1000);

// 回到顶部功能
const backBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    backBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
});
backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 为所有链接添加平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 主题切换功能
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = '🌓 切换暗色';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = '🌓 切换亮色';
    }
});

// 检查本地存储的主题设置
if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '🌓 切换亮色';
}

// 评论系统
const submitComment = document.getElementById('submitComment');
submitComment.addEventListener('click', () => {
    const name = document.getElementById('commentName').value.trim();
    const text = document.getElementById('commentText').value.trim();
    
    if (!name || !text) {
        alert('请输入姓名和评论内容');
        return;
    }
    
    // 转义HTML防止XSS
    const safeName = escapeHtml(name);
    const safeText = escapeHtml(text);
    
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const commentHTML = `
        <div class="comment">
            <div class="comment-header">
                <span class="comment-author">${safeName}</span>
                <span class="comment-date">${dateStr}</span>
            </div>
            <p>${safeText}</p>
        </div>
    `;
    
    document.getElementById('commentsList').insertAdjacentHTML('afterbegin', commentHTML);
    
    // 清空输入框
    document.getElementById('commentName').value = '';
    document.getElementById('commentText').value = '';
    
    // 保存到本地存储
    saveComment(safeName, safeText, dateStr);
});

// HTML转义函数
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// 保存评论到本地存储
function saveComment(name, text, date) {
    let comments = JSON.parse(localStorage.getItem('comments') || '[]');
    comments.unshift({name, text, date});
    localStorage.setItem('comments', JSON.stringify(comments));
}

// 加载本地存储的评论
function loadComments() {
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    const commentsList = document.getElementById('commentsList');
    
    commentsList.innerHTML = ''; // 清空现有评论
    
    comments.forEach(comment => {
        const commentHTML = `
            <div class="comment">
                <div class="comment-header">
                    <span class="comment-author">${comment.name}</span>
                    <span class="comment-date">${comment.date}</span>
                </div>
                <p>${comment.text}</p>
            </div>
        `;
        commentsList.innerHTML += commentHTML;
    });
}

// 页面加载时加载评论
loadComments();

// 反馈表单提交
document.getElementById('submitFeedback').addEventListener('click', () => {
    const name = document.getElementById('feedbackName').value.trim();
    const email = document.getElementById('feedbackEmail').value.trim();
    const text = document.getElementById('feedbackText').value.trim();
    
    if (!name || !email || !text) {
        alert('请填写所有字段');
        return;
    }
    
    // 转义HTML防止XSS
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeText = escapeHtml(text);
    
    // 保存反馈到本地存储
    let feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    feedbacks.unshift({
        name: safeName, 
        email: safeEmail, 
        text: safeText, 
        date: new Date().toISOString()
    });
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    
    alert('感谢您的反馈！');
    
    // 清空表单
    document.getElementById('feedbackName').value = '';
    document.getElementById('feedbackEmail').value = '';
    document.getElementById('feedbackText').value = '';
});

// 搜索功能
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

// 网站内容索引
const searchIndex = [
    { title: '极域电子教室破解工具', content: '功能强大的教学辅助工具', url: 'download.html' },
    { title: '数据备份助手', content: '自动化数据保护解决方案', url: 'download.html' },
    { title: '网络监测工具', content: '实时网络状态分析工具', url: 'download.html' },
    { title: 'Python开发', content: '专注于实用工具开发', url: 'index.html' },
    { title: '关于我', content: 'Python开发者，技术爱好者', url: 'index.html#about' },
    { title: '项目亮点', content: '展示所有开发的项目', url: 'index.html#projects' },
    { title: '联系我', content: '通过多种方式联系SYSTEM-HTY', url: 'index.html#contact' }
];

searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    
    if (query.length < 2) {
        searchResults.style.display = 'none';
        return;
    }
    
    const results = searchIndex.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.content.toLowerCase().includes(query)
    );
    
    if (results.length > 0) {
        searchResults.innerHTML = results.map(item => `
            <div class="search-result-item" data-url="${item.url}">
                <strong>${item.title}</strong><br>
                <span>${item.content}</span>
            </div>
        `).join('');
        
        searchResults.style.display = 'block';
        
        // 添加点击事件
        document.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                window.location.href = item.getAttribute('data-url');
            });
        });
    } else {
        searchResults.innerHTML = '<div class="search-result-item">没有找到相关结果</div>';
        searchResults.style.display = 'block';
    }
});

// 点击页面其他区域关闭搜索结果
document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.style.display = 'none';
    }
});

// PWA支持 - 添加到主屏幕提示
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    // 防止浏览器默认的提示
    e.preventDefault();
    // 存储事件以便后续使用
    deferredPrompt = e;
    
    // 显示自定义安装提示
    setTimeout(() => {
        if (confirm('想将本网站添加到主屏幕以便快速访问吗？')) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('用户接受了安装提示');
                } else {
                    console.log('用户拒绝了安装提示');
                }
                deferredPrompt = null;
            });
        }
    }, 3000);
});

// 注册Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
            console.log('SW注册成功: ', registration);
        })
        .catch((registrationError) => {
            console.log('SW注册失败: ', registrationError);
        });
    });
}

// 性能监控
if ('performance' in window) {
    // 报告核心Web指标给控制台
    setTimeout(() => {
        const navigationTiming = performance.getEntriesByType('navigation')[0];
        console.log('页面加载时间:', navigationTiming.loadEventEnd - navigationTiming.startTime, 'ms');
        
        const paintTiming = performance.getEntriesByType('paint');
        paintTiming.forEach((entry) => {
            console.log(`${entry.name}: ${entry.startTime}ms`);
        });
    }, 0);
}