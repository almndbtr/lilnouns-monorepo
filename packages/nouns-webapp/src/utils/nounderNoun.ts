import { Auction } from '../wrappers/nounsAuction';
import { AuctionState } from '../state/slices/auction';
import { BigNumber } from '@ethersproject/bignumber';

// checks for Lil Nounders reserved noun
export const isNounderNoun = (nounId: BigNumber) => {
  return nounId.mod(10).eq(0) || nounId.eq(0); /** zeroth lil noun is reserved by default */
};

// checks for nounsdao gifted nouns
export const isNounsDAONoun = (nounId: BigNumber) => {
  return nounId.mod(10).eq(1) || nounId.eq(1); /** first lil noun is reserved by default */
};

// This is a way of creating an Auction that matches the interface, all zero|nil values
const emptyNounderAuction = (onDisplayAuctionId: number): Auction => {
  return {
    amount: BigNumber.from(0).toJSON(),
    bidder: '',
    startTime: BigNumber.from(0).toJSON(),
    endTime: BigNumber.from(0).toJSON(),
    nounId: BigNumber.from(onDisplayAuctionId).toJSON(),
    settled: false,
  };
};

/**
 * 
 * @param id - the id of the auction
 * @param auctions - a list of auctions
 * @returns the auction, if it's found; else undefined if nothing else
 */
const findAuction = (id: BigNumber, auctions: AuctionState[]): Auction | undefined => {
  return auctions.find(auction => {
    return BigNumber.from(auction.activeAuction?.nounId).eq(id);
  })?.activeAuction;
};



//TODO: checkout
/**
 *
 * @param nounId - typically assumes the current nounid that belongs to a nounder
 * @param pastAuctions - an array of auctions that were conducted previously
 * @returns empty `Auction` object with `startTime` set to auction after param `nounId`
 */
export const generateEmptyNounderAuction = (
  nounId: BigNumber,
  pastAuctions: AuctionState[],
): Auction => {
  // Basically generate an auction with a bunch of zero values for the given noun id
  const nounderAuction = emptyNounderAuction(nounId.toNumber());
  // use nounderAuction.nounId + 1 to get mint time
  // almndbtr: try adding two and see what happens

  // try to determine the start time for this nounder auction based on the auctionabove
  // What is the auction above? According to this, 
  // it's taking the noun id that's passed in, adding one, and finding it in a list of past auctions
  // Lesson: hardcoding it works for the initial, but not for the next.
  // How to pivot?
  // Lesson: If you tried adding 2, then it will jump ahead twice which is what you don't want.
  // How to pivot, so that you ensure that you're always getting what's ahead of the nouns dao reserved noun?
  // Done: this is the way to always get the one that comes _after_ the nouns dao reserved noun
  // Is there a more elegant way of expressing this?
  // Find the auction above -- this is guaranteed nicely for the case of every 10, but now that we're skipping every two
  // this isn't as nice as we'd want or like it to be
  // maybe encapsulate this logic into its own function?
  // The order of auctions is lil nounders reserved, then nounsdao, then active.
  // Derive the date from the active by incrementing accordingly.
  const above = nounId.toNumber() % 10 === 1 ? 1 : 2;
  const auctionAbove = findAuction(nounId.add(above), pastAuctions);
  // here's a good question: what if the findAuction fn can't find it? What happens then?
  // answer: it will just return undefined
  // so it's possible that, if the auctionabovestarttime doesn't exist at all -- in other words,
  // it's undefined, then we leave the start time alone 
  // And that means that the nounder auction is left at the zero value
  // that explains why we're seeing the January 1, 1970 value
  // Here's the question you should pick up on:
  // What is a reliable way to find the date of an auction, or rather evaluate the date of an auction,
  // that isn't based relative to other auctions? Would it be best to read from the blockchain directly?
  // Should we read from the blockchain directly or something else?

  // WHEN YOU ARE BACK
  // Think about how this is currently structured. What are the difference cases to consider at the start, in the middle, and latest?
  // Start: 0 and 1 are known to be nounder nouns.
  // So, if we know that 2 is reliable, could we ... 
  // Next: Anything where mod evaluates to zero or 1 are also known to be nounder nouns.
  const auctionAboveStartTime = auctionAbove && BigNumber.from(auctionAbove.startTime);
  if (auctionAboveStartTime) nounderAuction.startTime = auctionAboveStartTime.toJSON();

  return nounderAuction;
};
