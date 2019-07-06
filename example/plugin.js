import milady from '../lib';

export default function(api, opts = {}) {
  api.registerCommand('codegen', {}, args => {
    milady(opts);
  });
}
