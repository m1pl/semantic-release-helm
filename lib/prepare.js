const fsPromises = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');
const semver = require('semver');

module.exports = async (pluginConfig, context) => {
    const logger = context.logger;

    let version;
    const appVersion = context.nextRelease.version;

    const filePath = path.join(pluginConfig.path, 'Chart.yaml');

    const chartYaml = await fsPromises.readFile(filePath);
    const oldChart = yaml.safeLoad(chartYaml);

    if (pluginConfig.onlyUpdateVersion) {
        version = appVersion;

        const newChart = yaml.safeDump({...oldChart, version: version});
        await fsPromises.writeFile(filePath, newChart);

        logger.log('Chart.yaml updated with version %s.', version);
        return;
    }

    version = semver.inc(oldChart.version, context.nextRelease.type);

    const newChart = yaml.safeDump({...oldChart, version: version, appVersion: appVersion});
    await fsPromises.writeFile(filePath, newChart);

    logger.log('Chart.yaml updated with version %s and appVersion %s.', version, appVersion);
};
