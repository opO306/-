export type SeasonReportInput = {
  seasonId: string;
  finalCompositeJob: {
    name: string;
    description: string;
  };
  finalArchetypeSummary: string;
  titleTimeline: {
    name: string;
    acquiredAt: number;
    consumedInto?: string;
  }[];
  notableActions: string[]; // 사전 정의된 이벤트 문구
};

