let stories = [];
let currentStory = null;
let currentChapterIndex = 0;

// Tải dữ liệu
fetch('data.json')
  .then(res => res.json())
  .then(data => {
    stories = data;
    renderList();
  })
  .catch(err => console.error('Lỗi tải dữ liệu:', err));

// Hiển thị danh sách truyện
function renderList() {
  const listEl = document.getElementById('stories-list');
  listEl.innerHTML = '';
  
  stories.forEach(story => {
    const article = document.createElement('article');
    article.className = 'post-item';
    article.innerHTML = `
      <time class="post-date">${story.date}</time>
      <h2 class="post-title">
        <a href="#${story.slug}" class="story-link">${story.title}</a>
      </h2>
      <a href="#${story.slug}" class="read-link">Read Article →</a>
    `;
    listEl.appendChild(article);
  });

  // Gắn sự kiện nhấp vào truyện
  document.querySelectorAll('.story-link, .read-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const slug = link.getAttribute('href').slice(1);
      openStory(slug);
    });
  });
}

// Mở truyện cụ thể
function openStory(slug) {
  currentStory = stories.find(s => s.slug === slug);
  if (!currentStory) return;
  
  currentChapterIndex = 0;
  
  // Hiển thị khung đọc, ẩn danh sách
  document.getElementById('list-view').style.display = 'none';
  document.getElementById('story-view').style.display = 'block';
  
  document.getElementById('story-title').textContent = currentStory.title;
  document.getElementById('story-date').textContent = currentStory.date;
  
  renderChapterSelect();
  renderChapter();
}

// Tạo danh sách chọn chương
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

// Hiển thị nội dung chương hiện tại
function renderChapter() {
  const chapter = currentStory.chapters[currentChapterIndex];
  document.getElementById('chapter-content').textContent = chapter.content;
  
  // Cập nhật nút Lùi/Tiến
  document.getElementById('prev-chapter').style.visibility = 
    currentChapterIndex > 0 ? 'visible' : 'hidden';
  document.getElementById('next-chapter').style.visibility = 
    currentChapterIndex < currentStory.chapters.length - 1 ? 'visible' : 'hidden';
  
  // Cập nhật lựa chọn trong danh sách
  document.getElementById('chapter-select').value = currentChapterIndex;
}

// Nút điều hướng chương
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

// Nút quay lại danh sách
document.getElementById('back-link').addEventListener('click', e => {
  e.preventDefault();
  document.getElementById('story-view').style.display = 'none';
  document.getElementById('list-view').style.display = 'block';
  currentStory = null;
});
