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
    await execa(
        'helm',
        ['dependency', 'update', configPath]
    );

    if (registry && registry.startsWith('s3://')) {
        await execa(
            'helm',
            ['package', configPath]
        );
        await execa(
            'helm',
            ['s3', 'push', path.join(configPath, `${name}-${version}.tgz`), 'semantic-release-helm-repo']
        );
        await execa(
            'rm',
            [path.join(configPath, `${name}-${version}.tgz`)]
        );
        await execa(
            'helm',
            ['repo', 'rm', 'semantic-release-helm-repo']
        );
        return;
    }

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
