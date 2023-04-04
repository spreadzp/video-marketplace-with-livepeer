import { Web3InstanceProps } from './../interfaces/types';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import Marketplace from '../contracts/ethereum-contracts/Marketplace.json'
import EncodedNft from '../contracts/ethereum-contracts/ENCNFT.json'


export async function getWeb3Instance(): Promise<Web3InstanceProps> {
    try{
        const web3Modal = new Web3Modal()
        const provider = await web3Modal.connect()
        const web3 = new Web3(provider)
        const networkId = await web3.eth.net.getId()
        const accounts = await web3.eth.getAccounts();
        const currentAddress = accounts[0]    
        let marketPlaceContract = null;
    
        let encodedNftContract = null;
        // Get all listed NFTs
        const deployedId = Object.keys(EncodedNft.networks)[0]
        if (networkId - +deployedId !== 0) {
            //if (networkId !== +deployedId) {
            // throw Error(`it works for only Mantle network 
            // now current networkId ${networkId}`)
      
            window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: web3.utils.toHex(deployedId) }]
            }).then(() => {
                marketPlaceContract = new web3.eth.Contract(Marketplace.abi as any, Marketplace.networks[`${networkId}` as keyof typeof Marketplace.networks]['address'])
    
                encodedNftContract = new web3.eth.Contract(EncodedNft.abi as any, EncodedNft.networks[`${networkId}` as keyof typeof EncodedNft.networks]['address'])    
            }).catch((err: any) => {
              console.log('@@@@@@@@@@@@@@@@@err', err)
              if (err.code === 4902) {
                console.log("🚀 ~ file: web3.ts:49 ~ getWeb3Instance ~ err.code:", err.code)
                window.ethereum.request({
                  jsonrpc: '2.0',
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainName: 'Localhost 8545',
                      chainId: web3.utils.toHex(3141),
                      nativeCurrency: { name: 'tFIL', decimals: 18, symbol: 'tFIL' },
                      rpcUrls: ['https://api.hyperspace.node.glif.io/rpc/v1/']
                    }],
                  // params: [
                  //   {
                  //     chainName: 'Localhost 8545',
                  //     chainId: web3.utils.toHex(deployedId),
                  //     nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' },
                  //     rpcUrls: ['http://localhost:8545/']
                  //   }
                  // ],
                  // params: [
                  //   {
                  //     chainName: 'Mantle Testnet',
                  //     chainId: web3.utils.toHex(deployedId),
                  //     nativeCurrency: { name: 'BIT', decimals: 18, symbol: 'BIT' },
                  //     rpcUrls: ['https://rpc.testnet.mantle.xyz/']
                  //   }
                  // ],
                  id: 0
      
                }).then(() => {
                     marketPlaceContract = new web3.eth.Contract(Marketplace.abi as any, Marketplace.networks[`${networkId}` as keyof typeof Marketplace.networks]['address'])
    
                     encodedNftContract = new web3.eth.Contract(EncodedNft.abi as any, EncodedNft.networks[`${networkId}` as keyof typeof EncodedNft.networks]['address'])    
                })
      
              }
            })
          } else {
             marketPlaceContract = new web3.eth.Contract(Marketplace.abi as any, Marketplace.networks[`${networkId}` as keyof typeof Marketplace.networks]['address'])
    
             encodedNftContract = new web3.eth.Contract(EncodedNft.abi as any, EncodedNft.networks[`${networkId}` as keyof typeof EncodedNft.networks]['address'])    
          } 

        return { currentAddress: currentAddress, marketPlaceContract: marketPlaceContract, encNftContract: encodedNftContract, web3Instance: web3 }
    } catch(err) {
        console.log('err', err)
        alert(`Need to use Metamask wallet with  Mumbai network` )
        return {} as Web3InstanceProps
    }
}