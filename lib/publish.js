const fsPromises = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');
const execa = require('execa');

module.exports = async (pluginConfig, context) => {
    const logger = context.logger;

    if (pluginConfig.registry) {
        const filePath = path.join(pluginConfig.path, 'Chart.yaml');

        const chartYaml = await fsPromises.readFile(filePath);
        const chart = yaml.safeLoad(chartYaml);

        await publishChart(pluginConfig.path, pluginConfig.registry, chart.name, chart.version);

        logger.log('Chart successfully published.');
    } else {
        logger.log('Registry not configured.');
    }
};

async function publishChart(configPath, registry, name, version) {
    if (registry) {
        if (registry.startsWith('s3://')) {
            const chartName = `${name}-${version}.tgz`;
            await execa(
                'helm',
                ['dependency', 'build', configPath]
            );
            await execa(
                'helm',
                ['package', configPath]
            );
            await execa(
                'helm',
                ['s3', 'push', path.join(configPath, chartName), 'semantic-release-helm', '--relative']
            );
            await execa(
                'rm',
                ['-f', path.join(configPath, chartName)]
            );
            await execa(
                'helm',
                ['repo', 'remove', 'semantic-release-helm']
            );
        } else {
            await execa(
                'helm',
                ['chart', 'save', configPath, registry + ':' + version],
                {
                    env: {
                        HELM_EXPERIMENTAL_OCI: 1
                    }
                }
            );
            await execa(
                'helm',
                ['chart', 'push', registry + ':' + version],
                {
                    env: {
                        HELM_EXPERIMENTAL_OCI: 1
                    }
                }
            );
        }
    }
}
