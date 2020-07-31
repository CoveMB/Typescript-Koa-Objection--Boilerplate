/* eslint-disable import/order */
/* eslint-disable import/first */
// It is important for the command to works that executeCommand is imported first
import executeCommand from './executer';

executeCommand(() => {

  console.log('Hello from command');

});
