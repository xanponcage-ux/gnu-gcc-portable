import * as repository from "../repository/TTSM049Query";

export default class  TTSM049 {
    getCampaignDashBoardData(Plant: any) {
        return repository.getCampaignDashBoardData(Plant);
  };
};  