export const STORY_DATA = {
  intro: [
    {
      speaker: '旁白',
      text: '21XX年，世界陷入了无尽的战火...',
      delay: 2000
    },
    {
      speaker: '旁白',
      text: '你是「红狼」小队的幸存者，驾驶着传奇的红色战车...',
      delay: 2500
    },
    {
      speaker: '旁白',
      text: '传说中的「终极战车」就藏在这片区域...',
      delay: 2500
    },
    {
      speaker: '旁白',
      text: '收集能量晶石，找到传说中的战车！',
      delay: 2000
    }
  ],
  missions: [
    {
      id: 1,
      name: '收集晶石',
      description: '收集 10 颗能量晶石',
      target: 10,
      type: 'collect',
      reward: '解锁新地图'
    },
    {
      id: 2,
      name: '寻找线索',
      description: '与 5 位 NPC 对话',
      target: 5,
      type: 'talk',
      reward: '获得传说线索'
    }
  ],
  npcs: {
    tank_green: {
      name: '流浪战士',
      dialogs: [
        '这辆红色战车...难道是「红狼」？',
        '传说中的终极战车就在北方...',
        '小心那些蓝色坦克，它们是敌人的侦察兵！'
      ]
    },
    tank_red: {
      name: '敌方将领',
      dialogs: [
        '哼！红狼的余党吗？',
        '终极战车是我们的囊中之物！',
        '你不会得逞的！'
      ]
    },
    tank_blue: {
      name: '侦察兵',
      dialogs: [
        '发现目标！',
        '报告将军，发现红狼！',
        '这里发现可疑人员！'
      ]
    },
    human: {
      name: '村民',
      dialogs: [
        '谢谢你保护我们！',
        '传说战车就藏在废弃的工厂里...',
        '小心东边，那里有敌人的据点！',
        '红狼的传说...终于有人继承了！',
        '这里有一些能量晶石，送给你！'
      ]
    }
  }
};

export let currentDialog = null;
export let dialogIndex = 0;
export let isIntroPlaying = false;
export let collectedCrystals = 0;
export let talkedNPCs = new Set();
export let activeMission = STORY_DATA.missions[0];

export function startIntro() {
  isIntroPlaying = true;
  dialogIndex = 0;
  playIntroDialog();
}

function playIntroDialog() {
  if (dialogIndex < STORY_DATA.intro.length) {
    currentDialog = {
      type: 'intro',
      ...STORY_DATA.intro[dialogIndex]
    };
    setTimeout(() => {
      dialogIndex++;
      playIntroDialog();
    }, STORY_DATA.intro[dialogIndex].delay);
  } else {
    currentDialog = null;
    isIntroPlaying = false;
  }
}

export function talkToNPC(npcType, npcId) {
  if (talkedNPCs.has(npcId)) return;
  
  const npc = STORY_DATA.npcs[npcType];
  if (npc) {
    const randomDialog = npc.dialogs[Math.floor(Math.random() * npc.dialogs.length)];
    currentDialog = {
      type: 'npc',
      speaker: npc.name,
      text: randomDialog
    };
    talkedNPCs.add(npcId);
    
    if (currentDialog.text.includes('晶石')) {
      collectedCrystals += 3;
    }
    
    setTimeout(() => {
      currentDialog = null;
    }, 3000);
  }
}

export function collectCrystal() {
  collectedCrystals++;
  checkMissionComplete();
}

export function checkMissionComplete() {
  if (activeMission) {
    let current = 0;
    if (activeMission.type === 'collect') {
      current = collectedCrystals;
    } else if (activeMission.type === 'talk') {
      current = talkedNPCs.size;
    }
    
    if (current >= activeMission.target) {
      const missionIndex = STORY_DATA.missions.findIndex(m => m.id === activeMission.id);
      if (missionIndex < STORY_DATA.missions.length - 1) {
        activeMission = STORY_DATA.missions[missionIndex + 1];
        currentDialog = {
          type: 'mission',
          speaker: '系统',
          text: `任务完成！${activeMission.name}：${activeMission.description}`
        };
        setTimeout(() => {
          currentDialog = null;
        }, 3500);
      } else {
        currentDialog = {
          type: 'complete',
          speaker: '系统',
          text: '恭喜！你找到了传说中的终极战车！'
        };
      }
    }
  }
}

export function getMissionProgress() {
  if (!activeMission) return { current: 0, target: 0 };
  let current = 0;
  if (activeMission.type === 'collect') {
    current = collectedCrystals;
  } else if (activeMission.type === 'talk') {
    current = talkedNPCs.size;
  }
  return { current, target: activeMission.target, mission: activeMission };
}

export function skipDialog() {
  currentDialog = null;
}
