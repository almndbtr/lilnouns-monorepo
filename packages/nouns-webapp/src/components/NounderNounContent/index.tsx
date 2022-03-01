/* eslint-disable react/jsx-no-comment-textnodes */
import { Col, Row } from 'react-bootstrap';
import { BigNumber } from 'ethers';
import AuctionActivityWrapper from '../AuctionActivityWrapper';
import AuctionNavigation from '../AuctionNavigation';
import AuctionActivityNounTitle from '../AuctionActivityNounTitle';
import AuctionActivityDateHeadline from '../AuctionActivityDateHeadline';
import AuctionTitleAndNavWrapper from '../AuctionTitleAndNavWrapper';
import { Link } from 'react-router-dom';
import nounContentClasses from './NounderNounContent.module.css';
import auctionBidClasses from '../AuctionActivity/BidHistory.module.css';
import bidBtnClasses from '../BidHistoryBtn/BidHistoryBtn.module.css';
import auctionActivityClasses from '../AuctionActivity/AuctionActivity.module.css';
import CurrentBid, { BID_N_A } from '../CurrentBid';
import Winner from '../Winner';

import { useAppSelector } from '../../hooks';

const NounderNounContent: React.FC<{
  mintTimestamp: BigNumber;
  nounId: BigNumber;
  isFirstAuction: boolean;
  isLastAuction: boolean;
  onPrevAuctionClick: () => void;
  onNextAuctionClick: () => void;
}> = props => {
  const {
    mintTimestamp,
    nounId,
    isFirstAuction,
    isLastAuction,
    onPrevAuctionClick,
    onNextAuctionClick,
  } = props;

  const isCool = useAppSelector(state => state.application.isCoolBackground);

  const nounIdNumber: number = nounId.toNumber();
  let block: any;
  let isNoundersNoun: boolean = false
  let isNounsDAONoun: boolean = false

  if (nounIdNumber % 10 === 0) {
    isNoundersNoun = true
    isNounsDAONoun = false

    block = (
      <ul className={auctionBidClasses.bidCollection}>
        <li
          className={
            (isCool ? `${auctionBidClasses.bidRowCool}` : `${auctionBidClasses.bidRowWarm}`) +
            ` ${nounContentClasses.bidRow}`
          }
        >
          All Noun auction proceeds are sent to the{' '}
          <Link to="/vote" className={nounContentClasses.link}>
            Lil Nouns DAO
          </Link>
          . For this reason, we, the project's founders (‘Lil Nounders’) have chosen to compensate
          ourselves with Lil Nouns. Every 10th Lil Noun for the first 5 years of the project will be
          sent to our multisig, where it will be vested and distributed to individual Nounders.
        </li>
      </ul>
    );
  }

  if (nounIdNumber - 1 % 10 === 0) {
    isNoundersNoun = false
    isNounsDAONoun = true

    block = (
      <ul className={auctionBidClasses.bidCollection}>
        <li
          className={
            (isCool ? `${auctionBidClasses.bidRowCool}` : `${auctionBidClasses.bidRowWarm}`) +
            ` ${nounContentClasses.bidRow}`
          }
        >
          As a thank you to the{' '}
          <Link to="https://nouns.wtf" className={nounContentClasses.link}>
            Nouns DAO 
          </Link>
          {" "} for being selfless stewards of cc0 we, the project's founders (‘Lil Nounders’) have chosen to compensate
          the NounsDAO with Lil Nouns. Every 11th Lil Noun for the first 5 years of the project will be
          sent to the NounsDAO, where they'll be distributed to individual Nouns, Nouners, and community members alike.
        </li>
      </ul>
    );
  }

  return (
    <AuctionActivityWrapper>
      <div className={auctionActivityClasses.informationRow}>
        <Row className={auctionActivityClasses.activityRow}>
          <AuctionTitleAndNavWrapper>
            <AuctionNavigation
              isFirstAuction={isFirstAuction}
              isLastAuction={isLastAuction}
              onNextAuctionClick={onNextAuctionClick}
              onPrevAuctionClick={onPrevAuctionClick}
            />
            <AuctionActivityDateHeadline startTime={mintTimestamp} />
          </AuctionTitleAndNavWrapper>
          <Col lg={12}>
            <AuctionActivityNounTitle nounId={nounId} />
          </Col>
        </Row>
        <Row className={auctionActivityClasses.activityRow}>
          <Col lg={4} className={auctionActivityClasses.currentBidCol}>
            <CurrentBid currentBid={BID_N_A} auctionEnded={true} />
          </Col>
          <Col
            lg={5}
            className={`${auctionActivityClasses.currentBidCol} ${nounContentClasses.currentBidCol} ${auctionActivityClasses.auctionTimerCol}`}
          >
            <div className={auctionActivityClasses.section}>
              <Winner winner={''} isNounders={isNoundersNoun} isNounsDAO={isNounsDAONoun} />
            </div>
          </Col>
        </Row>
      </div>
      <Row className={auctionActivityClasses.activityRow}>
        <Col lg={12}>
          {block}

          <div
            className={
              isCool ? bidBtnClasses.bidHistoryWrapperCool : bidBtnClasses.bidHistoryWrapperWarm
            }
          >
            <Link
              to="/nounders"
              className={isCool ? bidBtnClasses.bidHistoryCool : bidBtnClasses.bidHistoryWarm}
            >
              Learn more →
            </Link>
          </div>
        </Col>
      </Row>
    </AuctionActivityWrapper>
  );
};
export default NounderNounContent;