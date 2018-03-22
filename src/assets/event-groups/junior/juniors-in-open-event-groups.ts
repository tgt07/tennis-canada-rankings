import {KeyedStaticCollection} from "../../../app/keyed-static-collection";
import {Rating} from "../../../app/rating";
import {EventGroup, RankingEvent} from "../../../app/ranking-event";

const INTERNATIONAL_FINISH_POSITIONS: number[] = [1,2,3,4,8,16,32,64];

// Conversion from Junior Girls nationals to ITF $25,000
// ITF 25,000 are rated at .96 times Junior Grand slams, which are rated at 11.5 times
// the U18 National Girls championship.
// To normalize to WTA points, we divide by 50 - the number of an ITF $25,000 is worth.
//(0.96 * 11.5) is really 11.04;
const u18ToWTAConversion = 11 / 50;

const WTA_EVENT_GROUP: KeyedStaticCollection<EventGroup> =
  new KeyedStaticCollection<EventGroup>({
    '2013': new EventGroup(
      "_WTA_eg_",  INTERNATIONAL_FINISH_POSITIONS,
      [
        new RankingEvent("_Cdn_Open_", new Rating(1.666667)),
        new RankingEvent("_WTA_Grand_Slam_", new Rating(2000 * u18ToWTAConversion)),
        new RankingEvent("_WTA_Champs_", new Rating(1500 * u18ToWTAConversion)),
        new RankingEvent("_WTA_Elite_", new Rating(700 * u18ToWTAConversion)),
        new RankingEvent("_WTA_Premier*_", new Rating(1000 * u18ToWTAConversion)),
        new RankingEvent("_WTA_Premier_5_", new Rating(900 * u18ToWTAConversion)),
        new RankingEvent("_WTA_Premier_12_", new Rating(470 * u18ToWTAConversion)),
        new RankingEvent("_WTA_280_", new Rating(280 * u18ToWTAConversion)),
        new RankingEvent("_WTA_$125K_Series_", new Rating(160 * u18ToWTAConversion)),
      ]
    )
  });

const WITF_EVENT_GROUP: KeyedStaticCollection<EventGroup> =
  new KeyedStaticCollection<EventGroup>({
    '2013': new EventGroup(
      "_WITF_eg_",  INTERNATIONAL_FINISH_POSITIONS,
      [
        new RankingEvent("_Cdn_Open_", new Rating(1.666667)),
        new RankingEvent("_ITF_$100K_+H_", new Rating(150 * u18ToWTAConversion)),
        new RankingEvent("_ITF_$100K_", new Rating(140 * u18ToWTAConversion)),
        new RankingEvent("_ITF_$80K_+H_", new Rating(130 * u18ToWTAConversion)),
        new RankingEvent("_ITF_$80K_", new Rating(115 * u18ToWTAConversion)),
        new RankingEvent("_ITF_$60K_+H_", new Rating(100 * u18ToWTAConversion)),
        new RankingEvent("_ITF_$60K_", new Rating(80 * u18ToWTAConversion)),
        new RankingEvent("_ITF_$25K_", new Rating(50 * u18ToWTAConversion)),
        new RankingEvent("_ITF_$15K_", new Rating(12 * u18ToWTAConversion)),
      ]
    )
  });

// Conversion from Junior Boys nationals to ATP Futures 10,000
// Futures 10,000 are rated at 1.3 times Junior Grand slams, which are rated at 12 times
// the U18 National Boys championship.
// To normalize to ATP points, we divide by 18 - the number of ATP points a Futures 10,000 is worth.
const u18ToATPConversion = (1.3 * 12) / 18;

const ATP_EVENT_GROUP1: KeyedStaticCollection<EventGroup> =
  new KeyedStaticCollection<EventGroup>({
    '2013': new EventGroup(
      "_ATP_Tier1_eg_",  INTERNATIONAL_FINISH_POSITIONS,
      [
        new RankingEvent("_Cdn_Open_", new Rating(1.666667)),
        new RankingEvent("_ATP_Grand_Slam_", new Rating(2000 * u18ToATPConversion)),
        new RankingEvent("_ATP_Final_", new Rating(1500 * u18ToATPConversion)),
        new RankingEvent("_ATP_1000_", new Rating(1000 * u18ToATPConversion)),
        new RankingEvent("_ATP_500_", new Rating(500 * u18ToATPConversion)),
        new RankingEvent("_ATP_250_", new Rating(250 * u18ToATPConversion)),
      ]
    )
  });

const ATP_EVENT_GROUP2: KeyedStaticCollection<EventGroup> =
  new KeyedStaticCollection<EventGroup>({
    '2013': new EventGroup(
      "_ATP_Tier2_eg_",  INTERNATIONAL_FINISH_POSITIONS,
      [
        new RankingEvent("_Cdn_Open_", new Rating(1.666667)),
        new RankingEvent("_Ch_150_+H_", new Rating(125 * u18ToATPConversion)),
        new RankingEvent("_Ch_150_", new Rating(110 * u18ToATPConversion)),
        new RankingEvent("_Ch_125_+H_", new Rating(110 * u18ToATPConversion)),
        new RankingEvent("_Ch_125_", new Rating(100 * u18ToATPConversion)),
        new RankingEvent("_Ch_100_+H_", new Rating(100 * u18ToATPConversion)),
        new RankingEvent("_Ch_100_", new Rating(90 * u18ToATPConversion)),
      ]
    )
  });

const ATP_EVENT_GROUP3: KeyedStaticCollection<EventGroup> =
  new KeyedStaticCollection<EventGroup>({
    '2013': new EventGroup(
      "_ATP_Tier3_eg_",  INTERNATIONAL_FINISH_POSITIONS,
      [
        new RankingEvent("_Cdn_Open_", new Rating(1.666667)),
        new RankingEvent("_Ch_75_+H_", new Rating(90 * u18ToATPConversion)),
        new RankingEvent("_Ch_75_", new Rating(80 * u18ToATPConversion)),
        new RankingEvent("_Ch_50_+H_", new Rating(80 * u18ToATPConversion)),
        new RankingEvent("_Futures_25_", new Rating(27 * u18ToATPConversion)),
        new RankingEvent("_Futures_15_", new Rating(18 * u18ToATPConversion)),
      ]
    )
  });

export const JUNIORS_IN_PROS_EVENT_GROUP: KeyedStaticCollection<EventGroup> =
  new KeyedStaticCollection<EventGroup>({
    '2013': new EventGroup(
      '_jr_in_open_eg_',  INTERNATIONAL_FINISH_POSITIONS,
      [],
      [
        WTA_EVENT_GROUP,
        WITF_EVENT_GROUP,
        ATP_EVENT_GROUP1,
        ATP_EVENT_GROUP2,
        ATP_EVENT_GROUP3,
      ]
    )
  });
