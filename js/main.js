let stories = [];

fetch('./data.json')
  .then(res => res.json())
  .then(data => {
    stories = data;
    renderGrid();
  })
  .catch(err => {
    console.error('Lỗi tải dữ liệu:', err);
    document.getElementById('story-grid').innerHTML = '<p style="text-align:center;color:red;">Lỗi tải dữ liệu. Kiểm tra tệp data.json</p>';
  });

function renderGrid() {
  const container = document.getElementById('story-grid');
  if (!container || !stories.length) return;
  container.innerHTML = '';
  
  stories.forEach(story => {
    const card = document.createElement('div');
    card.className = 'story-card';
    card.innerHTML = `
      <img src="${story.image}" alt="${story.title}" class="story-img">
      <div class="story-info">
        <time class="story-date">${story.date}</time>
        <h3 class="story-title">${story.title}</h3>
      </div>
    `;
    card.addEventListener('click', () => openDetail(story.id));
    container.appendChild(card);
  });
}

function openDetail(id) {
  const story = stories.find(s => s.id === id);
  if (!story) return;
  
  showPage('detail-page');
  
  document.getElementById('detail-image').src = story.image;
  document.getElementById('detail-image').alt = story.title;
  document.getElementById('detail-date').textContent = story.date;
  document.getElementById('detail-title').textContent = story.title;
  document.getElementById('detail-content').innerHTML = `<p>${story.content}</p>`;
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.top-nav a, .sub-nav a').forEach(l => l.classList.remove('active'));
  
  if (pageId === 'all' || pageId === 'detail-page') {
    document.getElementById('all-page').classList.add('active');
    document.querySelector(`.sub-nav a[data-page="all"]`)?.classList.add('active');
  }
  
  const targetPage = document.getElementById(pageId);
  if (targetPage) targetPage.classList.add('active');
  
  document.querySelector(`.top-nav a[data-page="${pageId}"]`)?.classList.add('active');
  document.querySelector(`.sub-nav a[data-page="${pageId}"]`)?.classList.add('active');
}

document.addEventListener('click', e => {
  const link = e.target.closest('a[data-page]');
  if (link) {
    e.preventDefault();
    showPage(link.dataset.page);
  }
});
