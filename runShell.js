const { spawn } = require('child_process');
const dayjs = require('dayjs');
// console.log(dayjs().add(-5, 'month').startOf('month').format('YYYY-MM-DD'),dayjs().endOf('month').format('YYYY-MM-DD'));
let since = '2023-10-22';
let until = '2024-04-09';
// console.log(dayjs(since).format('YYYY-MM'));
// console.log(dayjs(until).format('YYYY-MM'));
// console.log(dayjs(until).startOf('month').format('YYYY-MM-DD'));
// console.log(dayjs(since).endOf('month').format('YYYY-MM-DD'));

let monthArr = [];
monthArr.push({
  label: dayjs(since).format('YYYY-MM'),
  start: since,
  end: dayjs(since).endOf('month').format('YYYY-MM-DD'),
});
let diff = dayjs(until).diff(since, 'month');
for (let i = 1; i <= diff; i++) {
  monthArr.push({
    label: dayjs(since).add(i, 'month').format('YYYY-MM'),
    start: dayjs(since).add(i, 'month').startOf('month').format('YYYY-MM-DD'),
    end: dayjs(since).add(i, 'month').endOf('month').format('YYYY-MM-DD'),
  });
}
monthArr.push({
  label: dayjs(until).format('YYYY-MM'),
  start: dayjs(until).startOf('month').format('YYYY-MM-DD'),
  end: until,
});
console.log(monthArr);

//
// const process = spawn(`echo -e "A line 1\nA line 2" | awk 'BEGIN{ print "Start" } { print } END{ print "End" }'`, { shell: true });
// const process = spawn(`git log --author="shenshuai_dr" --pretty=tformat: --numstat --since=2024-3-01 --until=2024-3-31 | awk 'BEGIN{ print "Start" } { add += $1; subs += $2; all += $1 + $2 } END{ print "添加行: add "add " 移除行: remove "subs " 总计行: all "all }'`, { shell: true });

// process.stdout.on('data', (data) => {
//     console.log(`stdout: ${data}`);
// });

// process.stderr.on('data', (data) => {
//     console.error(`stderr: ${data}`);
// });

// process.on('close', (code) => {
//     console.log(`child process exited with code ${code}`);
// });
