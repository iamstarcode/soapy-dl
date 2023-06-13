import inquirer from 'inquirer';
import chalk from 'chalk';
const spinnerText = (title: string) => [
  `/ ${title}`,
  `| ${title}`,
  `\\ ${title}`,
  `- ${title}`,
];

let i = 4;
const ui = new inquirer.ui.BottomBar();

export const spinner = (title: string) => {
  const mSpinnerText = spinnerText(title);
  const spinnerIntervalId = setInterval(() => {
    ui.updateBottomBar(chalk.yellow.bold(mSpinnerText[i++ % 4]));
  }, 300);

  return { ui, spinnerIntervalId };
};

export const updateUpdateBottoomBar = (message: string) => {
  ui.updateBottomBar(`${message}!`);
};
