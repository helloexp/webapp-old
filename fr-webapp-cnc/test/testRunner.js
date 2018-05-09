import path from 'path';
import { Server } from 'karma';

function runEm() {
  const server = new Server({ configFile: path.resolve(__dirname, './karmaConfig') }, (exitCode) => {
    exitCode !== 0 && console.log(`Karma has exited with ${exitCode}`); // eslint-disable-line
    process.exit(exitCode);
  });

  server.start({ port: 9876 });
}

export default {
  runEm,
};

