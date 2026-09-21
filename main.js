let stories = [];
let currentStoryIndex = 0;
let currentChapterIndex = 0;
const ITEMS_PER_PAGE = 5;
let currentPage = 0;

async function loadStories() {
  try {
    const res = await fetch('stories.json');
    stories = await res.json();
    renderPage();
  } catch (err) {
    console.error('Error loading stories:', err);
  }
}

function renderPage() {
  const listEl = document.getElementById('story-list');
  if (!listEl) return;

  listEl.innerHTML = '';
  const start = currentPage * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageItems = stories.slice(start, end);

  pageItems.forEach((story, idx) => {
    const itemEl = document.createElement('div');
    itemEl.className = 'story-item';
    const storyIndex = start + idx;
    itemEl.innerHTML = `
      <h2><a href="chapter.html?story=${storyIndex}&chapter=0">${story.title}</a></h2>
      <p class="story-meta">${story.date} · ${story.totalChapters} chapters</p>
      <p class="story-excerpt">${story.chapters[0]?.content.substring(0, 150) || ''}...</p>
    `;
    listEl.appendChild(itemEl);
  });

  document.getElementById('prev-btn').disabled = currentPage === 0;
  document.getElementById('next-btn').disabled = end >= stories.length;
}

function renderChapter() {
  if (!window.location.pathname.includes('chapter.html')) return;

  const params = new URLSearchParams(window.location.search);
  const storyIdx = parseInt(params.get('story') || '0');
  const chapterIdx = parseInt(params.get('chapter') || '0');

  if (!stories[storyIdx]) return;
  const story = stories[storyIdx];
  const chapter = story.chapters[chapterIdx];
  if (!chapter) return;

  document.getElementById('chapter-title').textContent = chapter.title;
  document.getElementById('page-title').textContent = chapter.title;
  document.getElementById('chapter-date').textContent = story.date;
  document.getElementById('chapter-body').innerHTML = `<p>${chapter.content.replace(/\n\n/g, '</p><p>')}</p>`;

  document.getElementById('prev-chapter').disabled = chapterIdx === 0;
  document.getElementById('next-chapter').disabled = chapterIdx >= story.chapters.length - 1;

  document.getElementById('prev-chapter').onclick = () => {
    if (chapterIdx > 0) {
      window.location.href = `chapter.html?story=${storyIdx}&chapter=${chapterIdx - 1}`;
    }
  };
  document.getElementById('next-chapter').onclick = () => {
    if (chapterIdx < story.chapters.length - 1) {
      window.location.href = `chapter.html?story=${storyIdx}&chapter=${chapterIdx + 1}`;
    }
  };
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadStories();

  if (document.getElementById('story-list')) {
    document.getElementById('prev-btn')?.addEventListener('click', () => {
      if (currentPage > 0) {
        currentPage--;
        renderPage();
      }
    });
    document.getElementById('next-btn')?.addEventListener('click', () => {
      if ((currentPage + 1) * ITEMS_PER_PAGE < stories.length) {
        currentPage++;
        renderPage();
      }
    });
  }

  if (document.getElementById('chapter-title')) {
    renderChapter();
  }
});
