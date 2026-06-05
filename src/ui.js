let score = 0
const scoreElement = document.getElementById('score-value')
const gameTipElement = document.getElementById('game-tip')
const toggleBtn = document.getElementById('toggle-vehicle-btn')

export function updateScore(newScore) {
  score = newScore
  if (scoreElement) {
    scoreElement.textContent = score
    scoreElement.style.transform = 'scale(1.2)'
    setTimeout(() => {
      scoreElement.style.transform = 'scale(1)'
    }, 100)
  }
}

export function getScore() {
  return score
}

export function showGameTip(message) {
  if (gameTipElement) {
    gameTipElement.textContent = message
  }
}

export function hideGameTip() {
  if (gameTipElement) {
    gameTipElement.style.opacity = '0'
    setTimeout(() => {
      gameTipElement.style.display = 'none'
    }, 500)
  }
}

export function updateToggleBtn(player) {
  if (toggleBtn) {
    if (player.isInTank) {
      toggleBtn.textContent = '下车'
      toggleBtn.disabled = false
    } else {
      const dist = Math.sqrt(
        (player.x - player.tankX) ** 2 +
        (player.y - player.tankY) ** 2
      )
      if (dist < 60) {
        toggleBtn.textContent = '上车'
        toggleBtn.disabled = false
      } else {
        toggleBtn.textContent = '靠近坦克'
        toggleBtn.disabled = true
      }
    }
  }
}
