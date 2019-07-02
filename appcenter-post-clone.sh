#!/usr/bin/env bash

# First install git-crypt and gpg
brew install git-crypt
brew install gnupg

# Then use the GPG key to unlock the repo
echo "$GPG_KEY" |base64 -D >temp.key 
git crypt unlock temp.key

chmod +x ./postinstall.sh
