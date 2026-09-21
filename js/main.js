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
    document.getElementById('storyList').innerHTML = `
      <div class="story-card">
        <p style="color:red;">Lỗi: Kiểm tra tệp data.json đã tải lên đúng chưa</p>
        <p>${err}</p>
      </div>
    `;
  });

function renderStoryList() {
  const container = document.getElementById('storyList');
  container.innerHTML = '';
  
  stories.forEach(story => {
    const card = document.createElement('div');
    card.className = 'story-card';
    card.innerHTML = `
      <time class="post-date">${story.date}</time>
      <h2 class="post-title">${story.title}</h2>
      <div class="story-meta">📚 ${story.totalChapters} chapters</div>
      <div class="chapter-list">
        ${story.chapters.map(ch => `
          <div class="chapter-item" data-story="${story.id}" data-chapter="${ch.number}">
            ${ch.title}
          </div>
        `).join('')}
      </div>
    `;
    container.appendChild(card);
  });

  document.querySelectorAll('.chapter-item').forEach(item => {
    item.addEventListener('click', () => {
      const storyId = item.getAttribute('data-story');
      const chapterNum = parseInt(item.getAttribute('data-chapter'));
      openChapter(storyId, chapterNum);
    });
  });
}

function openChapter(storyId, chapterNumber) {
  currentStory = stories.find(s => s.id === storyId);
  if (!currentStory) return;
  
  currentChapterIndex = currentStory.chapters.findIndex(c => c.number === chapterNumber);
  if (currentChapterIndex === -1) return;
  
  showCurrentChapter();
  
  document.getElementById('storyList').style.display = 'none';
  document.getElementById('chapterView').style.display = 'block';
}

function showCurrentChapter() {
  const chapter = currentStory.chapters[currentChapterIndex];
  document.getElementById('chapterTitle').textContent = chapter.title;
  document.getElementById('chapterContent').textContent = chapter.content;
  updateNavButtons();
}

function updateNavButtons() {
  const prevBtn = document.getElementById('prevChapter');
  const nextBtn = document.getElementById('nextChapter');
  
  prevBtn.style.visibility = currentChapterIndex > 0 ? 'visible' : 'hidden';
  nextBtn.style.visibility = currentChapterIndex < currentStory.chapters.length - 1 ? 'visible' : 'hidden';
}

document.getElementById('backBtn').addEventListener('click', () => {
  document.getElementById('storyList').style.display = 'block';
  document.getElementById('chapterView').style.display = 'none';
  currentStory = null;
  currentChapterIndex = 0;
});

document.getElementById('prevChapter').addEventListener('click', () => {
  if (currentChapterIndex > 0) {
    currentChapterIndex--;
    showCurrentChapter();
  }
});

document.getElementById('nextChapter').addEventListener('click', () => {
  if (currentChapterIndex < currentStory.chapters.length - 1) {
    currentChapterIndex++;
    showCurrentChapter();
  }
});
