let stories = [];
let currentStory = null;
let currentChapterIndex = 0;

fetch('data.json')
  .then(res => res.json())
  .then(data => {
    stories = Array.isArray(data) ? data : [data];
    renderStoryList();
  })
  .catch(err => {
    document.getElementById('storyList').innerHTML = `<p style="color:red;">Lỗi tải dữ liệu: ${err.message}</p>`;
  });

function renderStoryList() {
  const container = document.getElementById('storyList');
  container.innerHTML = '';
  
  stories.forEach(story => {
    const article = document.createElement('article');
    article.className = 'post-item';
    article.innerHTML = `
      <time class="post-date">${story.date}</time>
      <h3 class="post-title">
        <a href="#${story.id}" class="story-link">${story.title}</a>
      </h3>
      <div class="chapter-list">
        ${story.chapters.map((ch, idx) => `
          <span class="chapter-item" data-story="${story.id}" data-chapter="${idx}">
            ${ch.title}
          </span>
        `).join('')}
      </div>
    `;
    container.appendChild(article);
  });

  document.querySelectorAll('.chapter-item').forEach(item => {
    item.addEventListener('click', () => {
      const storyId = item.getAttribute('data-story');
      const chapterIdx = parseInt(item.getAttribute('data-chapter'));
      openChapter(storyId, chapterIdx);
    });
  });
}

function openChapter(storyId, chapterIdx) {
  currentStory = stories.find(s => s.id === storyId);
  if (!currentStory) return;
  
  currentChapterIndex = chapterIdx;
  
  showPage('chapter-page');
  
  document.getElementById('story-title').textContent = currentStory.title;
  document.getElementById('story-date').textContent = currentStory.date;
  
  renderChapterSelect();
  renderChapter();
}

function renderChapterSelect() {
  const select = document.getElementById('chapter-select');
  select.innerHTML = '';
  
  currentStory.chapters.forEach((ch, idx) => {
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = ch.title;
    if (idx === currentChapterIndex) opt.selected = true;
    select.appendChild(opt);
  });
  
  select.onchange = () => {
    currentChapterIndex = parseInt(select.value);
    renderChapter();
  };
}

function renderChapter() {
  const chapter = currentStory.chapters[currentChapterIndex];
  document.getElementById('chapter-content').textContent = chapter.content;
  
  const hasPrev = currentChapterIndex > 0;
  const hasNext = currentChapterIndex < currentStory.chapters.length - 1;
  
  document.getElementById('prev-chapter').style.visibility = hasPrev ? 'visible' : 'hidden';
  document.getElementById('next-chapter').style.visibility = hasNext ? 'visible' : 'hidden';
  document.getElementById('bottom-prev').style.visibility = hasPrev ? 'visible' : 'hidden';
  document.getElementById('bottom-next').style.visibility = hasNext ? 'visible' : 'hidden';
  
  document.getElementById('chapter-select').value = currentChapterIndex;
}

document.getElementById('prev-chapter').addEventListener('click', e => {
  e.preventDefault();
  if (currentChapterIndex > 0) {
    currentChapterIndex--;
    renderChapter();
  }
});

document.getElementById('next-chapter').addEventListener('click', e => {
  e.preventDefault();
  if (currentChapterIndex < currentStory.chapters.length - 1) {
    currentChapterIndex++;
    renderChapter();
  }
});

document.getElementById('bottom-prev').addEventListener('click', e => {
  e.preventDefault();
  if (currentChapterIndex > 0) {
    currentChapterIndex--;
    renderChapter();
  }
});

document.getElementById('bottom-next').addEventListener('click', e => {
  e.preventDefault();
  if (currentChapterIndex < currentStory.chapters.length - 1) {
    currentChapterIndex++;
    renderChapter();
  }
});

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('nav a').forEach(l => l.classList.remove('active'));
  
  if (pageId === 'chapter-page') {
    document.getElementById('chapter-page').classList.add('active');
  } else {
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) targetPage.classList.add('active');
    const activeLink = document.querySelector(`[data-page="${pageId}"]`);
    if (activeLink) activeLink.classList.add('active');
  }
}
