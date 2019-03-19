#!/usr/bin/env bash
brew install git-crypt
brew install gnupg
echo $GPG_PUBLIC_KEY > gpg.public.key
gpg --import gpg.public.key
git-crypt unlock
