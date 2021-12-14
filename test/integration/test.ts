import * as path from 'path';
import { RetryChunkLoadPluginOptions } from '../../src';
import webpack from './utils/webpack';

const mainOutputFile = path.join(__dirname, 'fixtures', 'dist', 'main.js');

const cases: (RetryChunkLoadPluginOptions | undefined)[] = [
  undefined,
  { chunks: [] },
  { chunks: ['main'] },
  { chunks: ['main'], retryDelay: 3000 },
  {
    chunks: ['main'],
    lastResortScript: "window.location.href='/500.html'",
  },
  {
    chunks: ['main'],
    dontThrow: true,
    lastResortScript: 'window.location.reload();',
  },
];

test.each(cases)('given config %j, match snapshot', async config => {
  const { result, fs } = webpack(config);
  await result;
  const mainContents = fs.readFileSync(mainOutputFile).toString();
  expect(mainContents).toMatchSnapshot();
});
