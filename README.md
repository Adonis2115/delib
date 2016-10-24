# DeLib

Non-restrictive framework for Ethereum. Allows you to spawn your own Ethereum private blockchain with genesis control.

### Features

#### [Ethereum Library](#Ethereum)
Promise based library that provides the basic but core abstractions needed for building dapps with Ethereum. It gives you the freedom to customize your dapp development to fit your specific needs. You can create/unlock Ethereum accounts, write migration scripts, interact with smart contracts, and easily create tests.

#### [Ethereum CLI](#Cli)
The CLI lets you can compile, build, and deploy Ethereum Solidity smart contracts. After they are on the blockchain you can easily execute specific contract methods and get event logs. The deployed contract addresses are saved and tied together with your project's delib library, so you don't need to worry about keeping a reference to it.

#### [Geth Development Private Blockchain](#devchain)
Allows you to create a development private blockchain with access to the genesis file, and sets up configuration for you to connect to other private blockchains. The custom geth node generates a preset amount of accounts, distributes Ether to them, auto mines for pending transactions, displays transaction information such as gas used, and gives you useful methods in the JavaScript console.

### Requirements

You must [install geth](https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum)

Mac OSX install commands with brew

```sh
brew tap ethereum/ethereum
brew install ethereum
```

Must use [npm web3](https://www.npmjs.com/package/web3) version 0.17.0-alpha. DeLib installs it by default as a peer dependency.

### Installation and Usage

##### Global install
Install globally to use the CLI

```
npm install -g delib
```

##### Local install
```
npm install delib --save
```

##### Project creation

To create the config file ```delib.js```, development blockchain genesis file ```devgenesis.json``` , and project structure.

```
delib init
```
The library can be used without calling this command. You will need to pass in the rpc port, rpc host, and contract options (holding the paths to the Solidity contracts, built contracts, and addresses) into [delib.eth.init()](#Ethereum+init). To use the IPC methods you will pass in your own ipc path into [delib.eth.initIPC()](#Ethereum+initIPC).

The development blockchain can also be used without this command. It will create the blockchain data directory in the folder you called the command in.

<a name="projectStructure"></a>
##### Project Structure
Here are the folders and files that get created when you call ```delib init```.
```
- project folder
  -- addresses (addresses of deployed contracts)
  -- built (built Solidity contracts .sol.js)
  -- contracts (Solidity contracts .sol)
  -- devchain (development private blockchain data directory)
  -- delib.js (delib config file)
  -- devgenesis.json (development private blockchain genesis file)
```

##### Configuration
The configuration options are located in ```delib.js```. Here is a breakdown of what each of the options do. Make sure to not remove any of these properties from the file.

```
{
  /** Development mode status. If true it sets up IPC host to the development blockchain path */
  dev: true,

  /** Contract file paths */
  contracts: {
    path: './contracts/', // Path to Solidity contracts
    built: './built/', // Path to built contracts
    address: './addresses/' Path to deployed contract addresses
  },

  /** Transaction options for CLI. */
  /** If you want to change the options then you will need to re-save this file for each CLI transaction */
  cli: {
    options: {
      from: 0, // Account index
      value: 0,
      gas: 1000000
    }
  },

  /** The RPC connection options that the library and CLI will use to connect to a geth node */
  rpc: {
    host: 'localhost',
    port: 8545,
  },

  blockchain: {
    /** IPC host connection is based off these paths */
    path: {
      dev: './devchain/', // Development blockchain path
      production: process.env.HOME + '/Library/Ethereum/' // Path used if dev is set to false. This is the directory that geth uses for the actual Ethereum blockchain on Mac OSX
    },

    /** Development blockchain options */
    autoMine: true, // Status of toggling mining if there are transactions pending and whether to keep coinbank topped off at a minimum amount
    accountAmount: 3, // Number of accounts to create
    password: '', // Password to create accounts with
    minAmount: 50, // Amount for coinbank to mine to
    distributeAmount: 10, // Ether amount to distribute to accounts after mining

    /** Geth node start arguments */
    identity: 'delib', // RPC identity name
    rpcport: 8545, // RPC port to open for web3 calls
    port: 30303, // Geth p2p network listening port. Allows other nodes to connect

    /** Addresses of nodes to connect to */
    staticNodes: [
      // If the nodes have same genesis file and identities as yours then syncing will begin. Example enodes:
      // "enode://f4642fa65af50cfdea8fa7414a5def7bb7991478b768e296f5e4a54e8b995de102e0ceae2e826f293c481b5325f89be6d207b003382e18a8ecba66fbaf6416c0@33.4.2.1:30303", "enode://pubkey@ip:port"
    ]
  }
}
```





<a name="Ethereum"></a>

## Ethereum Library

### Usage

#### Connect to Ethereum node

```
const delib = require('delib');

/** Initialize connection to Ethereum node */
delib.eth.init(); // Sets up a rpc connection to port 8545 and IPC connection to '<path to project>/devchain/geth.ipc' by default

/** How to get Web3 object */
const web3 = delib.eth.init();
```

#### Build contract

```
delib.eth.build('Test');
```

#### Adjust transaction options

```
delib.eth.options = {
  from: delib.eth.accounts[0],
  value: 0,
  gas: 1000000, // unused gas is refunded
  // to: Optional. Sets it to the contract you're looking to call by default
  // gasValue: Optional. Sets it to the mean network gas price by default
};
```

#### Deploy contract and call a method
The address of the deployed contract is saved in your project directory. This address is used when you try and call methods on the contract.

The promise returns an instance of the contract.
```
delib.eth.deploy('Test')
  .then(instance => {
    const address = instance.address;

    return instance.testMethod();
  })
  .then(tx => {

  })
  .catch(err => {

  })
```

#### Call a contract method
The method will determine if it will perform a transaction (which requires gas) or if it will just call by whether or not you labeled your function with constant in your Solidity contract. A transaction will only return the transaction hash and a call will return a value.

To call a contract at the address saved when you deployed it:

```
delib.eth.exec('Test').testMethod()
  .then(tx => {

  })
  .catch(err => {

  })
```

To call a contract method at a specified address:
```
delib.eth.execAt('Test', '0xd023633dbf0d482884be40adad5ecc0851015d9b').testMethod()
  .then(tx => {

  })
  .catch(err => {

  })
```

#### Get all event logs
```
delib.eth.events('Test', 'testEvent', 0)
  .then(logs => {

  })
  .catch(err => {

  })
```

### API Reference

* [delib.eth](#Ethereum)
    * [.buildContracts(contractFiles, contractPath, buildPath)](#Ethereum+buildContracts)
    * [.init(rpcHost, rpcPort, contractOptions)](#Ethereum+init) ⇒ <code>Web3</code>
    * [.initIPC(ipcPath)](#Ethereum+initIPC) ⇒ <code>Web3</code>
    * [.check()](#Ethereum+check) ⇒ <code>bool</code>
    * [.changeAccount(index)](#Ethereum+changeAccount) ⇒ <code>string</code>
    * [.createAccount(password)](#Ethereum+createAccount) ⇒ <code>Promise</code>
    * [.unlockAccount(address, password, timeLength)](#Ethereum+unlockAccount) ⇒ <code>boolean</code>
    * [.getBalanceEther(index)](#Ethereum+getBalanceEther) ⇒ <code>number</code>
    * [.getBalanceWei(index)](#Ethereum+getBalanceWei) ⇒ <code>number</code>
    * [.toWei(amount)](#Ethereum+toWei) ⇒ <code>number</code>
    * [.toEther(amount)](#Ethereum+toEther) ⇒ <code>number</code>
    * [.deploy(contractName, args, options)](#Ethereum+deploy) ⇒ <code>Promise</code>
    * [.exec(contractName)](#Ethereum+exec) ⇒ <code>Contract</code>
    * [.execAt(contractName, contractAddress)](#Ethereum+execAt) ⇒ <code>Contract</code>
    * [.events(contractName, contractAddress, eventName, fromBlock, filter)](#Ethereum+events) ⇒ <code>Promise</code>

<a name="Ethereum+init"></a>

#### delib.eth.init(rpcHost, rpcPort, contractOptions) ⇒ <code>Web3</code>
Initializes a RPC connection with a local Ethereum node. The RPC provider is set in Ethereum.config.rpc.port. Need to call before using the Ethereum object. If RPC connection is already initalized and valid the RPC connection will be set to the current provider.

**Returns**: <code>Web3</code> - The Web3 object Ethereum uses set up to the RPC provider  

| Param | Type | Description |
| --- | --- | --- |
| rpcHost | <code>string</code> | The host URL path to the RPC connection. Optional. If not given the rpcHost path will be taken from the config file. |
| rpcPort | <code>number</code> | The port number to the RPC connection. Optional. If not given the rpcPort path will be taken from config file. |
| contractOptions | <code>Object</code> | Options to set up the contract paths. Takes in path, built, and address properties. Optional. |

<a name="Ethereum+initIPC"></a>

#### delib.eth.initIPC(ipcPath) ⇒ <code>Web3</code>
Initializes an IPC connection with a local Ethereum node. The IPC provider is set in the config file. Need to call before using the Ethereum object IPC methods.

**Returns**: <code>Web3</code> - The Web3 object Ethereum uses for its IPC connection.  

| Param | Type | Description |
| --- | --- | --- |
| ipcPath | <code>string</code> | Path to the IPC provider. Example for Unix: process.env.HOME + '/Library/Ethereum/geth.ipc'. Optional. |

<a name="Ethereum+check"></a>

#### delib.eth.check() ⇒ <code>bool</code>
Checks the connection to the RPC provider

**Returns**: <code>bool</code> - The true or false status of the RPC connection  

<a name="Ethereum+buildContracts"></a>

#### delib.eth.buildContracts(contractFiles, contractPath, buildPath)
Builds Solidity contracts.


| Param | Type | Description |
| --- | --- | --- |
| contractFiles | <code>array</code> | Array of contract file names in the contracts folder|
| contractPath | <code>string</code> | Optional. Directory path where contract files are located. If none is given the directory path will be retrieved from the config file|
| buildPath | <code>string</code> | Optional. Directory path where built contracts will be put. If none is given the directory path will be retrieved from the config file. |

<a name="Ethereum+deploy"></a>

#### delib.eth.deploy(contractName, args, options) ⇒ <code>Promise</code>
Deploy a built contract.

**Returns**: <code>Promise</code> - The response is a Contract object of the deployed instance.  

| Param | Type | Description |
| --- | --- | --- |
| contractName | <code>string</code> | Name of built contract located in the directory provided in Ethereum.config.built. |
| args | <code>Array</code> | Arguments to be passed into the deployed contract as initial parameters. |
| options | <code>Object</code> | Transaction options. Options are: {from: contract address, value: number, gas: number, gasValue: number}. |

<a name="Ethereum+exec"></a>

#### delib.eth.exec(contractName) ⇒ <code>Contract</code>
Calls a deployed contract. Will take the address provided in the config file.

**Returns**: <code>Contract</code> - Contract object that you can call methods with.  

| Param | Type | Description |
| --- | --- | --- |
| contractName | <code>string</code> | Name of built contract located in the directory provided in Ethereum.config.built. |

<a name="Ethereum+execAt"></a>

#### delib.eth.execAt(contractName, contractAddress) ⇒ <code>Contract</code>
Calls a deployed contract at a specific address.

**Returns**: <code>Contract</code> - Contract object that you can call methods with.  

| Param | Type | Description |
| --- | --- | --- |
| contractName | <code>string</code> | Name of built contract located in the directory provided in Ethereum.config.built. |
| contractAddress | <code>string</code> | Address of the contract. |

<a name="Ethereum+events"></a>

#### delib.eth.events(contractName, eventName, fromBlock, filter) ⇒ <code>Promise</code>
Gets the event logs for an event.

**Returns**: <code>Promise</code> - The response contains an array event logs.  

| Param | Type | Description |
| --- | --- | --- |
| contractName | <code>string</code> | Name of built contract located in the directory provided in Ethereum.config.built. |
| contractAddress | <code>string</code> | Address of the contract. |
| eventName | <code>string</code> | The name of the event method. |
| fromBlock | <code>number</code> | The block number to start getting the event logs. Optional. Defaults to 0. |
| filter | <code>Object</code> | Options to filter the events. Optional. Defaults to: { address: contractAddress }. |

<a name="Ethereum+changeAccount"></a>

#### delib.eth.changeAccount(index) ⇒ <code>string</code>
Change the account address being used by the Ethereum object.

**Returns**: <code>string</code> - The account address now being used.  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | Index of the account address returned from web3.eth.accounts to change to. |

<a name="Ethereum+createAccount"></a>

#### delib.eth.createAccount(password) ⇒ <code>Promise</code>
Creates a new Ethereum account. The account will be located in your geth Ethereum directory in a JSON file encrpyted with the password provided.
**Returns**: <code>Promise</code> - Promise return is a string with the newly created account's address.  

| Param | Type | Description |
| --- | --- | --- |
| password | <code>string</code> | The password to create the new account with. |

<a name="Ethereum+unlockAccount"></a>

#### delib.eth.unlockAccount(address, password, timeLength) ⇒ <code>boolean</code>
Unlocks an Ethereum account.

**Returns**: <code>boolean</code> - Status if account was sucessfully unlocked.  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | The address of the account. |
| password | <code>string</code> | Password of account. |
| timeLength | <code>number</code> | Time in seconds to have account remain unlocked for. |

<a name="Ethereum+getBalanceEther"></a>

#### delib.eth.getBalanceEther(index) ⇒ <code>number</code>
Get the Ether balance of an account in Ether denomination.

**Returns**: <code>number</code> - The amount of Ether contained in the account.  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | Index of the account to check the balance of in Ether. |

<a name="Ethereum+getBalanceWei"></a>

#### delib.eth.getBalanceWei(index) ⇒ <code>number</code>
Get the Ether balance of an account in Wei denomination. 1 Ether = 1,000,000,000,000,000,000 wei

**Returns**: <code>number</code> - The amount of Ether in Wei contained in the account.  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | Index of the account to check the balance. |

<a name="Ethereum+toWei"></a>

#### delib.eth.toWei(amount) ⇒ <code>number</code>
Convert an Ether amount to Wei

**Returns**: <code>number</code> - Converted Wei amount.  

| Param | Type | Description |
| --- | --- | --- |
| amount | <code>number</code> | Amount to convert. Can also be a BigNumber object. |

<a name="Ethereum+toEther"></a>

#### delib.eth.toEther(amount) ⇒ <code>number</code>
Convert a Wei amount to Ether.

**Returns**: <code>number</code> - Converted Ether amount.  

| Param | Type | Description |
| --- | --- | --- |
| amount | <code>number</code> | Amount to convert. Can also be a BigNumber object. |








<a name="Cli"></a>
## Ethereum CLI

### Usage

#### Build contract
```
-> delib build TestContract
```

#### Adjust transaction options
The transaction options for the CLI are located in the ```delib.js``` file.
```
{
  cli: {
    from: 0, // The account index of the account
    value: 0,
    gas: 1000000
  }
}
```

#### Deploy contract
```
-> delib deploy TestContract
```

#### Execute a contract method
```
-> delib exec TestContract testMethod
```

#### Get all the logs of an event
```
-> delib events TestContract eventName 0
```

#### Create an account
```
-> delib create mypassword
```

#### Unlock an account
```
-> delib unlock 0 mypassword 100000
```

### API Reference

* [delib](#Cli+build)
    * [init](#Cli+init)
    * [build(fileName)](#Cli+build)
    * [deploy (contractName) (...args)](#Cli+deploy)
    * [set(contractName) (contractAddress)](#Cli+set)
    * [exec (contractName) (methodName) (...args)](#Cli+exec)
    * [events (contractName) (eventName) (fromBlock)](#Cli+events)
    * [balance(accountIndex)](#Cli+balance)
    * [create(password)](#Cli+create)
    * [unlock (accountIndex) (password) (unlockTime)](#Cli+unlock)
    * [devchain](#Cli+devchain)

#### delib init
Create the config file ```delib.js```, development blockchain genesis file ```devgenesis.json``` , and [project structure](#projectStructure).

<a name="Cli+build"></a>
#### delib build (file)
Compile and build a Solidity smart contract ```.sol``` (contracts folder) into a JavaScript file ```.sol.js``` (built folder) that you can require. The paths are set in the ```delib.js``` file under  ```{contracts: {paths: '<path to .sol contracts>', built: '<path to .sol.js built contracts>' }}```

<a name="Cli+deploy"></a>
#### delib deploy (contractName)
Deploy a built Solidity smart contract located in the path set in the ```delib.js``` file under ```{contracts: {built: '<path to built contract'>}}``` The address

<a name="Cli+set"></a>
#### delib set (contractName) (contractAddress)
Set the address of contract to be used with the CLI exec method and also with the delib.exec() library method. It is saved in the addresses folder, and the path can be set in the ```delib.js``` file under  ```{contracts: {paths: '.sol contracts', address: '<path to contract addresses>' }}```

<a name="Cli+exec"></a>
#### delib exec (contractName) (methodName) [... args]
Call a deployed contract method with the provided arguments.

<a name="Cli+events"></a>
#### delib events (contractName) (eventName) (fromBlock)
Get the logs of a deployed contract's event from a block number. By default fromBlock is 0, so it gets all the logs of a particular event.

<a name="Cli+balance"></a>
#### delib balance (accountIndex)
Get the balance of one of your account by its account index.

<a name="Cli+create"></a>
#### delib create (password)
Create a new Ethereum account.

<a name="Cli+unlock"></a>
#### delib unlock (accountIndex) (password) (unlockTime)
Unlock an Ethereum account.

<a name="Cli+devchain"></a>
#### delib devchain
Start up a geth node running the [development private blockchain](#devchain).







<a name="devchain"></a>
## Geth Development Private Blockchain

This development blockchain mimics the behavior of the actual Ethereum blockchain. It gives you access to the blockchain's genesis file so you can adjust the mining difficulty. If it is used within your project folders, the DeLib CLI and library will automatically by default connect to it via RPC and IPC.

Start the geth node for the development blockchain with the following command:
```
-> delib devchain
```

### Using the custom geth node
A JavaScript file is preloaded into geth which creates accounts and starts mining. When your coinbase mines enough it will distribute Ether to all other accounts. Mining is stopped after your coinbase reaches a certain minimum amount, and resumes again when it falls below it. It also automatically mines if there are transactions pending on the blockchain, and displays the receipt of each transaction. The blockchain data is reset each time you start the node.

In the JavaScript console you're given a ```delib``` object that contains useful methods you can call. Auto mining can be toggled with ```delib.auto()``` and you can adjust the minimum amount with ```delib.minAmount```.

Here's a list of all the methods

```
delib.accounts() // Displays all accounts, balances, and indexes

delib.auto() // Toggles auto mining

delib.start(threads) // Start mining -- <threads> defaults to 1

delib.stop() // Stop mining

delib.transfer(fromIndex, toIndex, etherAmount) // Transfer Ether between your accounts

delib.distribute(fromIndex, etherAmount) // Distribute Ether to all your accounts from one account

delib.mine(blockAmount) // Mine a certain amount of blocks -- <blockAmount> defaults to 1

delib.block(blockNumber) // Display block information -- <blockNumber> defaults to latest

delib.coinbase(accountIndex) // Change coinbase
```

### Options
A folder called ```devchain``` is created which contains the data directory of the blockchain. The folder contains all the blocks and accounts. The data path and other options can be specified in the ```delib.js``` file.

Calling ```delib init``` will create a file for you called ```devgenesis.json```. This is the [genesis file](http://ethereum.stackexchange.com/questions/2376/what-does-each-genesis-json-parameter-mean) of the blockchain (information about the genesis file can be found in the link). By default the difficulty is set to 800.

The options you can set in ```delib.js```
```
blockchain: {
  path: {
    dev: './devchain/', // path to blockchain data
  },
  autoMine: true, // Auto mine status
  accountAmount: 3, // Amount of accounts to create
  password: '', // Password of accounts
  minAmount: 50, // Minimum amount to keep above
  distributeAmount: 10, // How much to distribute to other accounts
  identity: 'delib', // Geth node identity
  rpcport: 8545, // Geth rpc port
  port: 30303, // Geth p2p network port

  staticNodes: [
    // Geth enode addresses to connect to
  ]
}
```

### To connect to other private blockchains
Get the geth enode address you wish to connect with and add it to the staticNodes array in ```delib.js```. If they are running a blockchain with the same identity and genesis file as you, then syncing will begin.

Your enode address is shown when you start up the development blockchain. It will look like this: ```enode://f4642fa65af50cfdea8fa7414a5def7bb7991478b768e296f5e4a54e8b995de102e0ceae2e826f293c481b5325f89be6d207b003382e18a8ecba66fbaf6416c0@33.4.2.1:30303```

You can have multiple blockchains synced on your computer by configuring them with an unique rpc port and network p2p port. By default these are 8545 and 30303 respectively.


## Examples

Link to repo used for testing purposes: [delib-test](https://github.com/zhiwenhuang/delib-test)

### Example 1
Initialize the project structure
```
-> delib init
```

Create a contract file called ```Example.sol``` in the contracts folder
```
contract Example {
  address owner;
  string message;

  function Example(string _message) {
    owner = msg.sender;
    message = _message;
  }

  function getOwner() constant returns (address) {
    return owner;
  }

  function setMessage(string _message) public {
    message = _message;
  }

  function getMessage() constant returns (string) {
    return message;
  }
}
```

Start up the geth development node
```
-> delib devchain
```

Build ```Example.sol``` with the CLI
```
delib build Example
```
A file called ```Example.sol.js``` will be created in the built folder

Deploy the built contract with arguments for the constructor
```
delib deploy Example hello
```
A file called ```ExampleAddresss``` will be created in your addresses folder with the deployed contract's address

In your scripts
```
const delib = require('delib');

delib.eth.init();

// Adjust the transaction options
delib.eth.options = {
  from: delib.eth.accounts[0],
  value: 0,
  gas: 100000,
};

delib.eth.exec('Example').getMessage()
  .then(message => {
    console.log(message); // -> hello
    return delib.eth.exec.setMessage('coffee'); // chain promise calls
  })
  .then(tx => {
    console.log(tx); // displays the transaction receipt
    return delib.eth.exec('Example').getMessage();
  })
  .then(message => {
    console.log(message); // -> coffee  
  })
  .catch(err => {
    console.log(err);
  });
```
In the command line you can call methods on the deployed contract

```
-> delib exec Example getMessage
coffee

-> delib exec Example setMessage apples
Transaction response: 0x456e1934eef8c38b9de6c8fd09df0a285c8c42f86373d2c2a74157a68592209b

-> delib exec Example getMessage
apples
```
More examples are coming!

## Support
If you found DeLib useful please leave a star on [GitHub](https://github.com/DeStore/delib) or give feedback!
