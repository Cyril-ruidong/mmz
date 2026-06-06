export const STORY_DATA = {
  intro: [
    {
      speaker: '爸爸',
      text: '什么，你说想成为超级勇士？还没放弃这种无聊的追求！',
      delay: 2500
    },
    {
      speaker: '姐姐',
      text: '爸爸，不要发这样大的火。',
      delay: 2000
    },
    {
      speaker: '爸爸',
      text: '没有你的事！人应该老老实实地生活，这才是主要的。说过多少次了还不懂？',
      delay: 3000
    },
    {
      speaker: '爸爸',
      text: '这个笨家伙！像你这样的，今天就从家里给我出去！让外面的冷风好好吹吹你那发昏的脑袋吧！',
      delay: 3500
    },
    {
      speaker: '旁白',
      text: '就这样，你被老爸揪出了家门……',
      delay: 2000
    },
    {
      speaker: '旁白',
      text: '夜晚，你在家门口睡着了……',
      delay: 2000
    },
    {
      speaker: '邻居',
      text: '哈哈，又淘气给爸爸赶出家了吧！',
      delay: 2000
    },
    {
      speaker: '旁白',
      text: '天亮了，新的冒险即将开始……',
      delay: 2000
    }
  ],
  missions: [
    {
      id: 1,
      name: '寻找战车',
      description: '去镇南的山洞里找到第一辆战车',
      target: 1,
      type: 'get_tank',
      reward: '获得第一辆战车'
    },
    {
      id: 2,
      name: '消灭水怪',
      description: '消灭镇北山洞里的水怪',
      target: 1,
      type: 'defeat_monster',
      reward: '获得1000G赏金'
    }
  ],
  npcs: {
    dad: {
      name: '爸爸',
      dialogs: [
        '什么，你说想成为超级勇士？还没放弃这种无聊的追求！',
        '人应该老老实实地生活，这才是主要的。',
        '快走吧！到哪儿去都行！',
        '……（沉默）'
      ]
    },
    sister: {
      name: '姐姐',
      dialogs: [
        '哦，终于回来了！',
        '累了？休息一下吧。',
        '爸爸也是为你好……'
      ]
    },
    neighbor: {
      name: '邻居',
      dialogs: [
        '哈哈，又淘气给爸爸赶出家了吧！',
        '就你？哈哈……你是个小孩耶～',
        '这是拉多镇，你不是修理厂的小孩吗？'
      ]
    },
    red_wolf: {
      name: '红狼',
      dialogs: [
        '……（沉默）',
        '哼，破车。',
        '小孩，让给你了。'
      ]
    },
    townsfolk: {
      name: '镇民',
      dialogs: [
        '镇的南面有个洞穴里有辆战车，勇士们都集中在这个镇了。',
        '山洞里的战车是红狼发现的。',
        '酒吧里来了一位驾驶红色战车的赏金杀手。',
        '镇子遭受过怪物的掠夺，南边的山洞是他们的老巢。',
        '连战车都没有就谈不上作勇士，只会老死街头。',
        '找到战车后就去找机械师和士兵作同伴。'
      ]
    },
    bar_drinker: {
      name: '醉汉',
      dialogs: [
        '这个世界是以去过多远的地方，见过多少人来衡量人生的价值。',
        '红狼？他在散布谣言。'
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
export let hasTank = false;
export let defeatedWaterMonster = false;

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
    }, STORY_DATA.intro[dialogIndex].delay || 2000);
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
    
    setTimeout(() => {
      currentDialog = null;
    }, 3000);
  }
}

export function collectCrystal() {
  collectedCrystals++;
  checkMissionComplete();
}

export function getTank() {
  hasTank = true;
  checkMissionComplete();
}

export function defeatWaterMonster() {
  defeatedWaterMonster = true;
  checkMissionComplete();
}

export function checkMissionComplete() {
  if (activeMission) {
    let completed = false;
    if (activeMission.type === 'get_tank') {
      completed = hasTank;
    } else if (activeMission.type === 'defeat_monster') {
      completed = defeatedWaterMonster;
    }
    
    if (completed) {
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
          text: '恭喜！你已经完成了拉多镇的所有任务！'
        };
      }
    }
  }
}

export function getMissionProgress() {
  if (!activeMission) return { current: 0, target: 0 };
  let current = 0;
  if (activeMission.type === 'get_tank') {
    current = hasTank ? 1 : 0;
  } else if (activeMission.type === 'defeat_monster') {
    current = defeatedWaterMonster ? 1 : 0;
  }
  return { current, target: activeMission.target, mission: activeMission };
}

export function skipDialog() {
  currentDialog = null;
}
