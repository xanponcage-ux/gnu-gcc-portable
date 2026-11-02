import * as repository from "../repository/TTSM050Query";

export default class  TTSM050 {
  getCampaignData(Plant: any, Mill: any, Segment:any, Zone:any, TType:any) {
    return repository.getCampaignData(Plant, Mill, Segment, Zone, TType);
  };
  getCampaignDataByPOD(Plant: any, Mill: any, Segment: any, Zone: any, TType: any) {
    return repository.getCampaignDataByPOD(Plant, Mill, Segment, Zone, TType);
  };
  getCampaignDataByOD(Plant: any, Mill: any, Segment: any, Zone: any, TType: any) {
    return repository.getCampaignDataByOD(Plant, Mill, Segment, Zone, TType);
  };
  
}