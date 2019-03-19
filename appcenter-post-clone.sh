#!/usr/bin/env bash
brew install git-crypt
brew install gnupg
gpg --keyserver https://pgp.mit.edu --recv-key $GPG_KEY_ID
git-crypt unlock
