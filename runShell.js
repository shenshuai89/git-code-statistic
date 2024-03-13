const { spawn } = require('child_process');

// 
// const process = spawn(`echo -e "A line 1\nA line 2" | awk 'BEGIN{ print "Start" } { print } END{ print "End" }'`, { shell: true });
const process = spawn(`git log --author="shenshuai_dr" --pretty=tformat: --numstat --since=2024-3-01 --until=2024-3-31 | awk 'BEGIN{ print "Start" } { add += $1; subs += $2; all += $1 + $2 } END{ print "添加行: add "add " 移除行: remove "subs " 总计行: all "all }'`, { shell: true });

process.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

process.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

process.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});