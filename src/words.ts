export type FocusSet = {
  label: string
  words: string[]
}

export const FOCUS_SETS: FocusSet[] = [
  {
    label: 'Z · V',
    words: ['zero','zone','zeal','zoom','zinc','zap','viz','vex','vow','vast','vibe','void','valve','vague','zest','vivid','vortex','zealot','venom','zenith'],
  },
  {
    label: 'Q · X',
    words: ['quiz','quip','quaff','quell','quox','flux','jinx','lynx','proxy','exact','exist','extra','expel','excel','oxide','axiom','index','pixel','nexus','annex'],
  },
  {
    label: 'Common Words',
    words: ['the','and','for','are','but','not','you','all','can','her','was','one','our','out','day','get','has','him','his','how','man','new','now','old','see','two','way','who','boy','did','its','let','put','say','she','too','use'],
  },
  {
    label: 'Home Row',
    words: ['flask','slash','glass','flash','flags','lash','dash','glad','flag','half','hall','fall','gall','shall','flask','salad','atlas','fatal','fads','lads'],
  },
]

export function getWords(set: FocusSet, count = 20): string[] {
  const result: string[] = []
  while (result.length < count) {
    result.push(...set.words)
  }
  return result.slice(0, count)
}
