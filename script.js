let userData = {
  stars: 120,
  xp: 450,
  level: 2,
  streak: 3
};

function loadSavedData() {
  const saved = localStorage.getItem('alice_gamification_data');
  if (saved) {
    try {
      userData = JSON.parse(saved);
    } catch (e) {
      console.error("Erro ao carregar dados salvos:", e);
    }
  }
  updateUI();
}

function saveData() {
  localStorage.setItem('alice_gamification_data', JSON.stringify(userData));
}

function updateUI() {
  document.getElementById('user-stars').innerText = userData.stars;
  document.getElementById('user-xp').innerText = userData.xp;
  document.getElementById('user-level').innerText = userData.level;
  document.getElementById('user-streak').innerText = `${userData.streak} Dias`;
  
  if (document.getElementById('shop-star-balance')) {
    document.getElementById('shop-star-balance').innerText = userData.stars;
  }

  const xpPercentage = Math.min(100, Math.floor((userData.xp / 1000) * 100));
  document.getElementById('xp-bar').style.width = `${xpPercentage}%`;
}

function playWinSound() {
  try {
    const synth = new Tone.Synth().toDestination();
    const now = Tone.now();
    synth.triggerAttackRelease("C5", "8n", now);
    synth.triggerAttackRelease("E5", "8n", now + 0.1);
    synth.triggerAttackRelease("G5", "8n", now + 0.2);
    synth.triggerAttackRelease("C6", "4n", now + 0.3);
  } catch (e) {
    console.log("Audio API aguardando ação.");
  }
}

function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

function showRewardModal(starsGained, xpGained) {
  document.getElementById('modal-stars-gain').innerText = `+${starsGained}`;
  document.getElementById('modal-xp-gain').innerText = `+${xpGained}`;
  document.getElementById('reward-modal').classList.remove('hidden');
}

function closeRewardModal() {
  document.getElementById('reward-modal').classList.add('hidden');
}

function scrollTabs(direction) {
  const container = document.getElementById('tabs-container');
  const scrollAmount = 200;
  if (direction === 'left') {
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  } else {
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
}

function switchTab(tabName) {
  const views = document.querySelectorAll('.view-content');
  views.forEach(v => v.classList.add('hidden'));

  const activeView = document.getElementById(`view-${tabName}`);
  if (activeView) activeView.classList.remove('hidden');

  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(t => t.classList.remove('active'));

  const activeTabBtn = document.getElementById(`tab-${tabName}`);
  if (activeTabBtn) activeTabBtn.classList.add('active');
}

// Lógica de resposta com suporte ao botão de Próxima Pergunta
function answerQuiz(containerId, isCorrect, btnElement, starsGain = 20, xpGain = 30, nextBtnId = null) {
  const container = document.getElementById(containerId);
  const buttons = container.querySelectorAll('button');

  buttons.forEach(b => {
    b.disabled = true;
    b.classList.add('opacity-50', 'cursor-not-allowed');
  });

  if (isCorrect) {
    btnElement.classList.remove('opacity-50');
    btnElement.classList.add('bg-emerald-500', 'text-white', 'border-emerald-600');
    
    userData.stars += starsGain;
    userData.xp += xpGain;
    saveData();
    updateUI();
    
    playWinSound();
    triggerConfetti();
    showRewardModal(starsGain, xpGain);
  } else {
    btnElement.classList.remove('opacity-50');
    btnElement.classList.add('bg-rose-500', 'text-white', 'border-rose-600');
  }

  // Revelar o botão de próxima pergunta se existir
  if (nextBtnId) {
    const nextBtn = document.getElementById(nextBtnId);
    if (nextBtn) nextBtn.classList.remove('hidden');
  }
}

// Transição entre perguntas da mesma disciplina
function showNextQuestion(currentQuestionId, nextQuestionId) {
  document.getElementById(currentQuestionId).classList.add('hidden');
  document.getElementById(nextQuestionId).classList.remove('hidden');
}

function toggleHomeworkStep() {
  const checkboxes = document.querySelectorAll('#homework-list input[type="checkbox"]');
  const allChecked = Array.from(checkboxes).every(cb => cb.checked);
  const finishBtn = document.getElementById('btn-finish-homework');

  if (allChecked) {
    finishBtn.disabled = false;
    finishBtn.classList.remove('bg-slate-300', 'text-slate-500', 'cursor-not-allowed');
    finishBtn.classList.add('bg-purple-600', 'hover:bg-purple-700', 'text-white', 'cursor-pointer', 'shadow-md');
  } else {
    finishBtn.disabled = true;
    finishBtn.classList.add('bg-slate-300', 'text-slate-500', 'cursor-not-allowed');
    finishBtn.classList.remove('bg-purple-600', 'hover:bg-purple-700', 'text-white', 'cursor-pointer', 'shadow-md');
  }
}

function completeHomework() {
  const starsGain = 50;
  const xpGain = 80;

  userData.stars += starsGain;
  userData.xp += xpGain;
  saveData();
  updateUI();

  playWinSound();
  triggerConfetti();
  showRewardModal(starsGain, xpGain);

  const finishBtn = document.getElementById('btn-finish-homework');
  finishBtn.innerText = "Dever Concluído! 🎉 (+50 ⭐)";
  finishBtn.disabled = true;
  finishBtn.classList.replace('bg-purple-600', 'bg-emerald-500');
}

function redeemReward(rewardName, cost) {
  if (userData.stars >= cost) {
    userData.stars -= cost;
    saveData();
    updateUI();

    playWinSound();
    triggerConfetti();

    alert(`Parabéns Alice! Você resgatou: "${rewardName}" 🎉`);
  } else {
    alert(`Você precisa de mais ${cost - userData.stars} estrelas para este prêmio! Continue estudando ✨`);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  loadSavedData();
});