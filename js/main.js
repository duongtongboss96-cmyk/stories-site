let stories = [];

fetch('data.json')
  .then(res => res.json())
  .then(data => {
    stories = data;
    renderGrid();
  });

function renderGrid() {
  const container = document.getElementById('storyGrid');
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
  document.querySelectorAll('nav a').forEach(l => l.classList.remove('active'));
  
  if (pageId === 'detail-page') {
    document.getElementById('detail-page').classList.add('active');
  } else {
    const target = document.getElementById(pageId + '-page');
    if (target) target.classList.add('active');
    const activeLink = document.querySelector(`[data-page="${pageId}"]`);
    if (activeLink) activeLink.classList.add('active');
  }
}
