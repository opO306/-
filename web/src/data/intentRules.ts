import { IntentType } from "../types/situation";
import { ButterflyAxis } from "../types/butterfly";

export const INTENT_MARK_RULES: Record<IntentType, Partial<Record<ButterflyAxis, number>>> = {
    cautious: { orderChaos: -1 },
    responsible: { altruismSelf: +1 },
    curious: { knowledgeDestruction: -1 },
    exploitative: { altruismSelf: -1 },
    detached: { orderChaos: +1 },
    decisive: { asceticHedon: +1 },
    protective: { altruismSelf: +1, orderChaos: -1 },
    experimental: { knowledgeDestruction: +1 },
    defiant: { orderChaos: +1, altruismSelf: -1 },
    conservative: { orderChaos: -1, asceticHedon: -1 },
    bold: { asceticHedon: +1, orderChaos: +1 },
};
