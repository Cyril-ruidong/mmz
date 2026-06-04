let score = 0
const scoreElement = document.getElementById('score-value')
const gameTipElement = document.getElementById('game-tip')

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
