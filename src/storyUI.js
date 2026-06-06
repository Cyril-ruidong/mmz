import { currentDialog, skipDialog, getMissionProgress } from './story.js';

let dialogContainer = null;
let missionContainer = null;

export function initUI() {
  createDialogContainer();
  createMissionContainer();
}

function createDialogContainer() {
  dialogContainer = document.createElement('div');
  dialogContainer.id = 'dialog-container';
  dialogContainer.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(20, 20, 40, 0.95);
    border: 3px solid #c42c2c;
    border-radius: 12px;
    padding: 20px 30px;
    max-width: 600px;
    width: 90%;
    z-index: 100;
    display: none;
    box-shadow: 0 0 30px rgba(196, 44, 44, 0.3);
  `;
  
  dialogContainer.innerHTML = `
    <div id="dialog-speaker" style="color: #c42c2c; font-weight: bold; margin-bottom: 8px; font-family: 'Courier New', monospace;"></div>
    <div id="dialog-text" style="color: #fff; line-height: 1.6; font-family: 'Courier New', monospace;"></div>
    <div id="dialog-hint" style="color: #888; margin-top: 10px; font-size: 12px; text-align: right; font-family: 'Courier New', monospace;">点击继续...</div>
  `;
  
  dialogContainer.addEventListener('click', skipDialog);
  document.body.appendChild(dialogContainer);
}

function createMissionContainer() {
  missionContainer = document.createElement('div');
  missionContainer.id = 'mission-container';
  missionContainer.style.cssText = `
    position: fixed;
    top: 80px;
    left: 20px;
    background: rgba(20, 20, 40, 0.9);
    border: 2px solid #4a6a9a;
    border-radius: 8px;
    padding: 12px 16px;
    z-index: 99;
    font-family: 'Courier New', monospace;
  `;
  
  missionContainer.innerHTML = `
    <div style="color: #4a9aff; font-weight: bold; margin-bottom: 6px;">📋 当前任务</div>
    <div id="mission-name" style="color: #fff; margin-bottom: 4px;"></div>
    <div id="mission-progress" style="color: #aaa; font-size: 13px;"></div>
  `;
  
  document.body.appendChild(missionContainer);
}

export function updateDialog() {
  if (currentDialog) {
    dialogContainer.style.display = 'block';
    document.getElementById('dialog-speaker').textContent = 
      currentDialog.type === 'mission' ? '🎯 任务' : 
      currentDialog.type === 'complete' ? '🎉 恭喜' : 
      currentDialog.speaker || '对话';
    document.getElementById('dialog-text').textContent = currentDialog.text;
    document.getElementById('dialog-hint').style.display = 
      currentDialog.type === 'intro' ? 'none' : 'block';
  } else {
    dialogContainer.style.display = 'none';
  }
}

export function updateMissionUI() {
  const progress = getMissionProgress();
  if (progress.mission) {
    document.getElementById('mission-name').textContent = progress.mission.name;
    document.getElementById('mission-progress').textContent = 
      `进度：${progress.current} / ${progress.target} - ${progress.mission.description}`;
  }
}

export function showStartScreen() {
  const container = document.createElement('div');
  container.id = 'start-screen';
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, #0a0a15 0%, #1a1020 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 200;
  `;
  
  container.innerHTML = `
    <h1 style="color: #c42c2c; font-size: 48px; margin-bottom: 20px; text-shadow: 0 0 20px rgba(196, 44, 44, 0.5); font-family: 'Courier New', monospace;">
      重装机兵
    </h1>
    <p style="color: #aaa; margin-bottom: 40px; font-size: 18px; font-family: 'Courier New', monospace;">
      红狼传说
    </p>
    <button id="start-btn" style="
      background: linear-gradient(180deg, #c42c2c, #7a0f0f);
      color: #fff;
      border: 3px solid #e84c4c;
      padding: 15px 60px;
      font-size: 20px;
      font-weight: bold;
      border-radius: 8px;
      cursor: pointer;
      font-family: 'Courier New', monospace;
      box-shadow: 0 4px 0 #4a0a0a;
    ">开始游戏</button>
    <div style="color: #666; margin-top: 40px; font-size: 14px; font-family: 'Courier New', monospace;">
      <p>🎮 移动鼠标控制坦克</p>
      <p>💎 收集能量晶石</p>
      <p>💬 点击 NPC 对话</p>
    </div>
  `;
  
  document.body.appendChild(container);
  
  return new Promise((resolve) => {
    document.getElementById('start-btn').addEventListener('click', () => {
      container.style.display = 'none';
      resolve();
    });
  });
}
