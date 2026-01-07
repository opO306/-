export type PlayerAction =
  | "HELP"
  | "GAIN"
  | "INTIMIDATE"
  | "WITHDRAW";

const BASE_LABELS: Record<PlayerAction, string> = {
  HELP: "돕는다",
  GAIN: "이익을 취한다",
  INTIMIDATE: "위협한다",
  WITHDRAW: "물러난다"
};

type ToneVariant = Partial<Record<PlayerAction, string>>;

const TONE_VARIANTS: Record<string, ToneVariant> = {
  trust: {
    HELP: "기꺼이 돕는다",
    GAIN: "공정한 이익을 챙긴다"
  },

  fear: {
    INTIMIDATE: "침묵을 강요한다",
    WITHDRAW: "상황을 지켜본다"
  },

  resentment: {
    HELP: "마지못해 돕는다",
    GAIN: "더 많은 것을 요구한다"
  },

  distance: {
    HELP: "관여하지 않고 돕는다",
    WITHDRAW: "말없이 떠난다"
  },

  respect: {
    HELP: "책임지고 나선다",
    INTIMIDATE: "단호하게 경고한다"
  }
};

export function buildChoiceLabels(
  actions: PlayerAction[],
  dominantTone: string | null
) {
  return actions.map(action => {
    const toneLabel =
      dominantTone &&
      TONE_VARIANTS[dominantTone]?.[action];

    return {
      action,
      label: toneLabel ?? BASE_LABELS[action]
    };
  });
}
