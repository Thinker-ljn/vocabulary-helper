export interface MoreDefinition {
  detail: string
  dds: {
    words: string[]
    definition: string
  }[]
}

export interface Definition {
  classes: string
  definition: string
  examples: string[]
  more: MoreDefinition[]
}

export interface Word {
  text: string
  audio: string
  short: string
  long: string
  family: { word: string; pages: number; tips: string; id: number }[]
  definitions: Definition[]
}
