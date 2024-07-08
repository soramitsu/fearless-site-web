---
title: 'Fearless XOR Staking: The Advanced Guide'
date: Oct 15, 2023
cover: /blog/staking-guide/cover.jpg
og: /blog/staking-guide/og.jpg
---

Staking XOR natively on Fearless Wallet is easy and convenient. Here is an advanced guide to XOR staking, including payouts and validator selection.

---

## TL;DR

- Staking rewards depend on each validator. Factors like the commission percentage will vary in the amount paid out.
- Each validator triggers staking reward payouts. You can also trigger these rewards but must pay the transaction fee for all the nominators.
- You can easily change your validators in Fearless Wallet. However, there are some details to look out for to find the best validator to nominate.

With the arrival of [SORA network native staking to Fearless Wallet](https://medium.com/fearlesswallet/sora-staking-is-now-available-in-fearless-wallet-d7251e268aff), it is easy to nominate your favourite validators from the palm of your hand without the cumbersome [dotapps.io](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fws.mof.sora.org#/staking) interface. It is essential to clarify what Fearless Wallet XOR staking can and cannot do.

Using Fearless, you can choose up to 24 validators and allocate any amount of XOR you want. You can also modify the validators you have chosen to nominate and view the rewards you have received from your validator.

However, you cannot trigger these rewards’ payout in Fearless Wallet; they must be done on the Polkadot.JS interface.

The [Fearless Wallet wiki](https://wiki.fearlesswallet.io/staking/overview) has all the documentation to start staking natively on Substrate networks such as SORA (_or Polkadot, Kusama, etc._)

- To get started with staking on Fearless Wallet, the [Staking Walkthrough tutorial](https://wiki.fearlesswallet.io/staking/walkthrough) contains a step-by-step guide to get started. Remember to select SORA at the top of the staking interface. (**NOTE: The restake option is unavailable for SORA native staking.**)
- You can also find step-by-step information about staking on SORA in the [SORA Staking article on Medium](https://medium.com/fearlesswallet/sora-staking-is-now-available-in-fearless-wallet-d7251e268aff).

## How to Select/Change Your Validators

From the SORA Mainnet staking main view, click on the three dots next to “Your stake.”

![Screenshot](https://miro.medium.com/v2/resize:fit:1400/1*e9c3zfXRp7ixF7YNh9ajRQ.png)

In n the pop-up, click “Your validators,” this will bring up a list of the validators you have nominated. Click on the **i** icon next to the validator name. You can see exciting information, such as the status (active or waiting), the number of nominators, the total stake on the node, and the estimated reward percentage then if you click on the total stake, a pop-up with the amount staked on the node by nominators and the amount staked on the node by the validator.

![Screenshot](https://miro.medium.com/v2/resize:fit:1400/1*uGTYdEyUBLVbUhDlTfRoKQ.png)

Select those Fearless recommendations or stake with your validator to change your validator set. You can see the same information mentioned above if you click on the **i** icon on each validator.

![Screenshot](https://miro.medium.com/v2/resize:fit:1400/1*YyM-xUGuzM9wqgQbcD79wA.png)

After selecting your validators, verify the network fee, then click confirm. Congratulations, you are fearlessly staking XOR.

## Advanced Validator Selection

To get more details that will help make a better decision on who to nominate, advanced users can refer to the [staking interface on dotapps.io](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fws.mof.sora.org#/staking).

![Screenshot](https://miro.medium.com/v2/resize:fit:1400/1*6-cjIpes1D7Sl3_00Xk3dg.png)

In this screen, you can find all the validators, with some very interesting information to help you select a better pool of validators. The important details to note here are:

- **Commission percentage** — This is the amount of the payout taken by the validator. A lower commission % means higher rewards to nominators.
- **Era points** — Nodes with higher era points have produced more blocks. The more blocks produced equals more rewards. Choose a validator that has a good amount of points.
- **Other stake** — Although this information is visible in Fearless Wallet, trying to nominate validators with fewer nominators is always a good practice. This way, the rewards are less diluted.

## Reward Payouts

It is very important to note that Fearless Wallet does not support triggering reward payouts. The validator needs to trigger these payouts, and once this is done, all the nominators will automatically receive them in their associated wallet.

If the nominator has not paid out in a long time, or you urgently need the rewards and don’t mind paying for the transaction, here is a guide on triggering payouts for your account on [dotapps.io](http://dotapps.io/).

## Triggering Reward Payouts

- In the staking screen on [dotapps.io](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fws.mof.sora.org#/staking) click on Payouts. Here, you will find your account’s payouts and the nodes you have pending payouts.

![Screenshot](https://miro.medium.com/v2/resize:fit:1400/1*eKcpbaUDqjiZA6Sn4bHBVA.png)

- Click on Payout all and then check the details;

![Screenshot](https://miro.medium.com/v2/resize:fit:1400/1*zGiGlfx7VXbMRwuFyx96FQ.png)

- Here, you will see all the validators you are requesting the payouts from, with a maximum of 40 payouts processed at a go. *Remember that you will pay for all the other nominators to get their payout and if you are paying for many validators, your transaction fee could be higher.*

![Screenshot](https://miro.medium.com/v2/resize:fit:1400/1*2YUs2iwkEY46zLERSSop6Q.png)

- You will receive a summary of the transaction, with the fees included and a call hash, or receipt of the transaction.

**This operation could be costly, so it is recommended to wait, unless it is absolutely necessary to claim the rewards.**

![Screenshot](https://miro.medium.com/v2/resize:fit:1400/1*yIhjElxjixxB81ZWktMu6w.png)

- Sign and submit the transaction and you will know you were successful once the payout queue has been cleared.

**Many validators will wait until the amount they received is proportional to the payout fees to pay their nominators, but no more than twenty days, otherwise, the rewards will expire.**

## In Conclusion

Staking XOR on Fearless Wallet is a great and simple way to help secure the blockchain and ensure decentralization and financial freedom can move forward fearlessly! You can manage your stakers at a glance and view your rewards from the palm of your hands and if you want more details to make an informed decision as well as get to know more about who is securing the network, you can complement your fearless experience with [dotapps.io](http://dotapps.io/).

To further enhance user experience, features like “Reward history,” “Aggregated rewards in VAL,” and “Pending payouts” are in the pipeline. However, to implement these, projects powered by indexers, SubQuery or/and Subsquid need to be set up. The good news is these projects are already underway and are undergoing the final phases of testing and adjustments. Our team is committed to delivering these features as soon as they are ready. The pessimistic ETA for these implementations is 2 to 3 weeks.

Keep this guide handy to help you troubleshoot any issues you may have while staking or choosing nominators, or if you prefer, reach out to the Fearless team on [Telegram](https://t.me/fearlesshappiness), who will be happy to help you!

And as always, Stay Fearless!
