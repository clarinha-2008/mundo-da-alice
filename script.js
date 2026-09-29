// ESTRUTURA DE DADOS COM LOCALSTORAGE
let userData = {
  stars: 120,
  xp: 450,
  level: 2,
  streak: 3
};

// Carregar dados salvos ao iniciar a página
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

// Salvar progresso
function saveData() {
  localStorage.setItem('alice_gamification_data', JSON.stringify(userData));
}

// Atualizar interface
function updateUI() {
  document.getElementById('user-stars').innerText = userData.stars;
  document.getElementById('user-xp').innerText = userData.xp;
  document.getElementById('user-level').innerText = userData.level;
  document.getElementById('user-streak').innerText = `${userData.streak} Dias`;
  
  if (document.getElementById('shop-star-balance')) {
    document.getElementById('shop-star-balance').innerText = userData.stars;
  }

  // Atualizar barra de XP
  const xpPercentage = Math.min(100, Math.floor((userData.xp / 1000) * 100));
  document.getElementById('xp-bar').style.width = `${xpPercentage}%`;
}

// Tocar Som de Vitória
function playWinSound() {
  try {
    const synth = new Tone.Synth().toDestination();
    const now = Tone.now();
    synth.triggerAttackRelease("C5", "8n", now);
    synth.triggerAttackRelease("E5", "8n", now + 0.1);
    synth.triggerAttackRelease("G5", "8n", now + 0.2);
    synth.triggerAttackRelease("C6", "4n", now + 0.3);
  } catch (e) {
    console.log("Audio Web API aguardando interação.");
  }
}

// Soltar Confete
function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  }
}

// Troca de Abas
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

// Lógica de Atividade / Quizzes
function answerQuiz(containerId, isCorrect, btnElement) {
  const container = document.getElementById(containerId);
  const buttons = container.querySelectorAll('button');

  buttons.forEach(b => {
    b.disabled = true;
    b.classList.add('opacity-50', 'cursor-not-allowed');
  });

  if (isCorrect) {
    btnElement.classList.remove('opacity-50');
    btnElement.classList.add('bg-emerald-500', 'text-white', 'border-emerald-600');
    
    userData.stars += 20;
    userData.xp += 30;
    saveData();
    updateUI();
    
    playWinSound();
    triggerConfetti();
  } else {
    btnElement.classList.remove('opacity-50');
    btnElement.classList.add('bg-rose-500', 'text-white', 'border-rose-600');
  }
}

// Checklist do Dever de Casa
function toggleHomeworkStep() {
  const checkboxes = document.querySelectorAll('#homework-list input[type="checkbox"]');
  const allChecked = Array.from(checkboxes).every(cb => cb.checked);
  const finishBtn = document.getElementById('btn-finish-homework');

  if (allChecked) {
    finishBtn.disabled = false;
    finishBtn.classList.remove('bg-slate-200', 'text-slate-400', 'cursor-not-allowed');
    finishBtn.classList.add('bg-purple-600', 'hover:bg-purple-700', 'text-white', 'cursor-pointer', 'shadow-md');
  } else {
    finishBtn.disabled = true;
    finishBtn.classList.add('bg-slate-200', 'text-slate-400', 'cursor-not-allowed');
    finishBtn.classList.remove('bg-purple-600', 'hover:bg-purple-700', 'text-white', 'cursor-pointer', 'shadow-md');
  }
}

function completeHomework() {
  userData.stars += 50;
  userData.xp += 80;
  saveData();
  updateUI();

  playWinSound();
  triggerConfetti();

  const finishBtn = document.getElementById('btn-finish-homework');
  finishBtn.innerText = "Dever Concluído! 🎉 (+50 ⭐)";
  finishBtn.disabled = true;
  finishBtn.classList.replace('bg-purple-600', 'bg-emerald-500');
}

// Resgate de Prêmios
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

// Inicializar ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
  loadSavedData();
});