# semantic-release-helm

This is a plugin for _semantic-release_.
It updates `version` and `appVersion` of a [Helm](https://helm.sh/) chart's _Chart.yaml_. 

The `version` is increased according to `nextRelease.type`,
which can be one of

- major
- premajor
- minor
- preminor
- patch
- prepatch
- prerelease

or _null_ if it's not valid.

The `appVersion` is set to `nextRelease.version`.

##### Examples:

```
version 0.1.0  
appVersion 1.16.0
```

1. patch (1.16.0 -> 1.16.1)  
New chart version is 0.1.1

2. minor (1.16.0 -> 1.17.0)  
New chart version is 0.2.0

3. major (1.16.0 -> 2.0.0)  
New chart version is 1.0.0

## Configuration

- path (required) - string
Chart directory, where the _Chart.yaml_ is located.

- registry (optional) - string
URI of a container registry.

- useS3 (optional) - boolean
Use S3 instead of a HTTP repo (see example for more details)

- onlyUpdateVersion (optional) - boolean
Only update the `version` and NOT the `appVersion`. This is useful if you have the chart in a different git repo than the application.
**IMPORTANT:** `version` will be set to `nextRelease.version`!

Pass credentials through environment variables accordingly:

```
export REGISTRY_USERNAME=<USERNAME>
export REGISTRY_PASSWORD=<PASSWORD>
```

## Example

This will update versions in `./chart/Chart.yaml`
and push the chart to `localhost:5000/repo/chart`.
The image will be tagged with the value of `version` from _Chart.yaml_.

```
{
  "plugins": [
    [
      "semantic-release-helm",
      {
        path: './chart',
        registry: 'localhost:5000/repo/chart'
      }
    ]
  ]
}
```

## S3 Example

In order to use s3 as a helm repo, you need to use the [helm-s3](https://github.com/hypnoglow/helm-s3) plugin.
Before you run semantic release, you need to add your s3 bucket to your repos: `helm repo add my-s3-bucket-repo s3://my-s3-bucket/charts`.

This will update versions in `./chart/Chart.yaml`
and push the chart to `my-s3-bucket`.
The image will be tagged with the value of `version` from _Chart.yaml_.

```
{
  "plugins": [
    [
      "semantic-release-helm",
      {
        path: './chart',
        registry: 'my-s3-bucket-repo',
        useS3: true,
      }
    ]
  ]
}
```
