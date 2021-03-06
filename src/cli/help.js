'use strict';

/** Additional help */
module.exports = () => {
  console.log('  Command Options:');
  console.log('  ');
  console.log('    [command] -h --help', '  Display command description and available options');
  console.log('    ');
  console.log('    Transaction Options:');
  console.log('      -i --account <index>', '   Account to use for transaction. Takes the account index');
  console.log('      -f --from <address>', '    From transaction option. Replaces --account');
  console.log('      -t --to <address>', '      To transaction option');
  console.log('      -v --value <ether>', '     Value transaction option in Ether. Converts the value to wei');
  console.log('      -g --gas <number>', '      Gas transaction option. If gas amount is not given it is estimated');
  console.log('      -p --gasprice <number>', ' Gas price transaction option');
  console.log('      -n --nonce <number>', '    Nonce transaction option');
  console.log('      -m --maxgas <number>', '   Max gas allowed when estimating');
  console.log('    ');
  console.log('    Connections:');
  console.log('      -h --rpchost <value>', '   RPC host');
  console.log('      -r --rpcport <port>', '    RPC port');
  console.log('      -c --ipchost [path]', '    Relative path to IPC host');
  console.log('    ');
  console.log('    Paths:');
  console.log('      -o --contract <path>', '   Relative path to contracts folder');
  console.log('      -b --built <path>', '      Relative path to built contracts folder');
  console.log('      -a --address <path>', '    Relative path to addresses folder');
  console.log('  ');
  console.log('  Examples:');
  console.log('  ');
  console.log('    Build a contract from a remote folder:');
  console.log('      delib build Contract --contract ./../contracts');
  console.log('  ');
  console.log('    Deploy a contract from your 2nd account with gas amount estimated:');
  console.log('      delib deploy Contract arg1 arg2 -i 1');
  console.log('  ');
  console.log('    Execute a contract method, choose gas amount, and send 5 Ether:');
  console.log('      delib exec Contract method arg1 arg2 --gas 35000 --value 5');
  console.log('');
};
