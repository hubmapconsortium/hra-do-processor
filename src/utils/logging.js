import chalk from 'chalk';

export function banner(title) {
  info('');
  info('-----------------------------------------------------');
  info(chalk.whiteBright(title));
  info('-----------------------------------------------------');
}

export function header(context, pipeline) {
  const { type, name, version, iri } = context.selectedDigitalObject;
  info('');
  info(chalk.whiteBright('---') + ' ' + 
       chalk.green(`${type}:${version}:${name}`) + ' ' + 
       chalk.whiteBright(`(${pipeline})`) + ' @ ' +
       chalk.cyanBright(iri) + ' ' +
       chalk.whiteBright('---'));
}

export function info(message) {
  console.log('[' + chalk.blueBright('INFO') + '] ' + message);
}

export function warning(message) {
  console.log('[' + chalk.yellowBright('WARNING') + '] ' + chalk.yellowBright(message));
}

export function error(message) {
  console.log('[' + chalk.redBright('ERROR') + '] ' + chalk.redBright(message));
}

export function more(message) {
  console.log(message);
}
