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
Use `s3://` if you want to push to a s3 bucket

- onlyUpdateVersion (optional) - boolean
Only update the `version` and NOT the `appVersion`. This is useful if you have the chart in a different git repo than the application.

Pass credentials through environment variables accordingly:

```
export REGISTRY_USERNAME=<USERNAME>
export REGISTRY_PASSWORD=<PASSWORD>
```

If you want to use s3, use the folling environment variables for your AWS credentials:

```
export AWS_REGION=<REGION> (e.g. eu-central-1)
export AWS_ACCESS_KEY_ID=<KEY_ID>
export AWS_SECRET_ACCESS_KEY=<SECRET>
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

semantic-release-helm uses the [helm-s3](https://github.com/hypnoglow/helm-s3) plugin in the background. If you want to use a thrid party s3 repo, you can take a look at the documentation of the plugin.

This will update versions in `./chart/Chart.yaml`
and push the chart to `s3://my-s3-bucket/s3-prefix`.
The image will be tagged with the value of `version` from _Chart.yaml_.

```
{
  "plugins": [
    [
      "semantic-release-helm",
      {
        path: './chart',
        registry: 's3://my-s3-bucket-repo/s3-prefix',
      }
    ]
  ]
}
```
