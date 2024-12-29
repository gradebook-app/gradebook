# About: 

An App to Display Genesis Parent Portal Data.
This is an Open Source Project, any PRs are Welcomed.

# View Project

View the project at https://apps.apple.com/us/app/genesus/id1594653519

# Run from Xcode

1. Ensure `node` is configured properly 
> Both commands should output the same node version, if they don't, follow the node symlink steps
`/usr/local/bin/node -v`
`node -v`

## Useful Commands
1. clear watchman cache: `watchman watch-del-all`

## Create Node Symlink 

`rm -rf /usr/local/bin/node`
`ln -s $(which node) /usr/local/bin/node`