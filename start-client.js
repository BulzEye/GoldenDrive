const args = [ 'start' ];
const opts = { stdio: 'inherit', cwd: 'gd-frontend', shell: true };
require('child_process').spawn('npm', args, opts);