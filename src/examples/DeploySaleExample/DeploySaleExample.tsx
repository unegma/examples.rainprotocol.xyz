import '../../App.css';
import React, {useState} from 'react';
import { networks } from "./networks";
import {ethers} from 'ethers';
import saleFactoryABI from "./saleFactoryABI.json";
import defaults from "./defaults.json";
import {Button, Divider, Link, Typography} from "@mui/material";
import SaleForm from "./SaleForm";
import RedeemableForm from "./RedeemableForm";

/**
 * DeploySaleExample
 * An example of how to create a Sale contract (using the Sale factory).
 *
 * This example will use USDCC (see the `redeemable` parameter in defaults)
 * This example will let the user define limited parameters in order to show functionality.
 *
 * Please be aware that this example does not follow best practices as there is no validation in place as
 * well as other checks which have been left out (especially re wallet connection/network switching).
 *
 * These have been left out for simplicity so the user can isolate the required functionality more easily
 * and iterate on that with their own setup.
 *
 * @constructor
 */
export default function DeploySaleExample({}: any) {

  const [currentAccount, setCurrentAccount] = useState("");
  const [saleState, setSaleState] = useState(defaults.sale);
  const [redeemableState, setRedeemableState] = useState(defaults.redeemable);

  /**
   * Minimal connectWalletHandler functinality
   */
  const connectWalletHandler = async () => {
    // @ts-ignore
    const { ethereum } = window;

    if (!ethereum) {
      console.log("No Web3 Wallet installed");
    }

    try {
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
        chainId: networks[0].config.chainId,
      });
      console.log(`Address ${accounts[0]} connected`);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Function for handling when the user submits the form
   */
  const deploySaleExample = async () => {
    // @ts-ignore
    const { ethereum } = window;

    if (!ethereum) {
      console.log("No Web3 Wallet installed");
    }

    try {
      console.log('Submitting the following state:', saleState, redeemableState);

      const provider = new ethers.providers.Web3Provider(ethereum, {
        name: networks[0].config.chainName,
        chainId: parseInt(networks[0].config.chainId),
      });

      // Prompt user for account connections
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      console.log("Account:", await signer.getAddress());

      // todo will use typechain
      // @ts-ignore
      const contractInstance = new ethers.Contract(networks[0].addresses.SALE_FACTORY, saleFactoryABI.abi, signer);
      const deployedAddress = await contractInstance.createChild(saleState);

      console.log(deployedAddress);
      // setResult(`Result: ${price._hex}`);

    } catch (err) {
      console.log(err);
    }
  }

  /**
   * View
   */
  return (
    <div className="App">
      <main className="App-main">

        <Typography variant="h4">Deploy Sale Example</Typography>

        <br/>

        <Button variant="contained" onClick={connectWalletHandler}>
          Connect
        </Button>

        <br/>

        <Typography>{`Connected as: ${currentAccount}`}</Typography>

        <br/>

        <SaleForm defaults={defaults.sale} saleState={saleState} setSaleState={setSaleState} currentAccount={currentAccount}/>

        <RedeemableForm defaults={defaults.redeemable} redeemableState={redeemableState} setRedeemableState={setRedeemableState}/>

        <Button variant="contained" onClick={deploySaleExample}>
          Deploy Sale Example
        </Button>

        <br/>

        <Divider variant="middle" style={{ background: 'white', width: '90%' }} />

        <br/>

        <Link href="https://docs.rainprotocol.xyz/guides/Opcodes/running-an-opcodes-example" variant="body2">
          Tutorial
        </Link>

        <Link href="https://github.com/beehive-innovation/examples.rainprotocol.xyz" variant="body2">
          Github
        </Link>

      </main>
    </div>
  )
}
