# Development Process for Adroit Mobile

## Local development

### Pre-requisites

1. Install **Node** (v8.#). We strongly recommend using nvm (Node Version Manager) to do this.
1. Install **Yarn** using [these instructions](https://yarnpkg.com/en/docs/install)
1. Install the **App Center CLI** tool: `yarn global add appcenter-cli`
1. Install **React Native Debugger** from [here](https://github.com/jhen0409/react-native-debugger/releases)
1. Install **Java Development Kit** (if you don't already have it) from [here](https://www.oracle.com/technetwork/java/javase/downloads/index.html)
    * Set the following environment variable: `JAVA_PATH=[path-to-jdk-folder]`
1. Install **Android Studio** from [here](https://developer.android.com/studio/)
    1. If you're not going to use a physical Android device for testing, create at least one Android Virtual Device.
    1. Go to 'SDK Manager', click on the 'SDK Tools' tab and make sure 'Google Play Services' is checked. Then click 'OK' and let Android Studio download the Google Play Services libraries (accept any licence popups!).
    1. Go to 'Virtual Device Manager' and set up a new Virtual Device using the defaults. You will probably have to download the relevant version of Android for the emulator.
    1. Ensure the following environment variable is set: `ANDROID_HOME=[path-to-android-skd-folder]`
    1. Ensure the `platform-tools` folder (`C:\Users\[user]\AppData\Local\Android\sdk\platform-tools` on Windows) is added to your system `PATH`.
    1. Add a new `android\local.properties` file with the following content (replace with correct path to Android SDK on your machine):
        * Windows:
        ```
        sdk.dir=C\:\\Users\\[user]\\AppData\\Local\\Android\\Sdk     
        ```
        * Mac:
        ```
        sdk.dir=/users/[user]/Android/Skd
        ```
1. (Mac OS only) 
    1. Install **XCode** from [here](https://developer.apple.com/xcode/)
    1. Install **CocoaPods** by following the instructions [here](https://guides.cocoapods.org/using/getting-started.html)
1. Install `gpg` from [here](https://gnupg.org/download/)
1. Install **git-crypt**. 
    * **Mac/Linux**: use [these instructions](https://github.com/AGWA/git-crypt/blob/master/INSTALL.md) 
    * **Windows**: download a pre-build binary from [here](https://github.com/oholovko/git-crypt-windows/releases) and save it somewhere on your system `PATH`. 
    * Once you have installed `git-crypt`:
        1. Generate a new GPG key pair: `gpg --gen-key`. Fill in the data you are asked for.
        1. Get your hexadecimal key ID: `gpg --list-keys`.
        1. Export your public key (`gpg --export --armor *your-key-ID*`) to a file and send it to the repo admin along with the email address you used for the key creation.
        1. Wait for confirmation from the repo admin that you have been added to the repo's trusted users.

### Getting started

1. Clone the adroit-mobile repo: `git clone https://github.com/appdevdesigns/adroit-mobile.git && cd adroit-mobile`
1. Unlock the encrypted files in the repo: `git-crypt unlock`
1. Install the dependencies: `yarn`
1. (Mac only) Install pods: `cd ios && pod install && cd ..`
1. To debug the app, ensure your test device is connected or your Android emulator/iOS simulator is running and then run the following:

```sh
# Android
> yarn run android-debug
# iOS
> yarn run ios-debug
```

## Making changes

Please follow this procedure whenever you make a code change - it will help ensure we always do things in an understandable, methodical way and don't cut any corners or leave steps out!

1. [Create a new issue](https://github.com/appdevdesigns/adroit-mobile/issues/new) describing the bug to fix or the task to do.
1. Create a new branch from `master`. Name the branch with the following convention: `#<issueId>_<IssueDescription>` where `<issueId>` is the ID number of the issue and `<IssueDescription>` is a short (one or two words) description of what the issue relates to (as an aide-memoire).
1. Make regular, atomic commits to this branch. Each commit must have a useful comment/description. Be as verbose as necessary! Include the issue number (e.g. #12) in the commit comment to automatically link the commit to the relevant issue.
1. If you add any assets (e.g. images), don't forget to call `yarn run bundle` to collect Android assets in the `android/app/src/main/res` directory. Commit any added files to the repo.
1. When you've completed the work or are ready for it to be reviewed, create a Pull Request. Get the code reviewed by at least one other developer.
1. Once the Pull Request has been approved and all testing (see below) is complete, merge the PR and delete the branch (both local and remote).
1. Close the issue with a comment explaining the issue resolution.

## Deployment

Adroit Mobile is a React Native application that can be thought of in three parts:

1. A **native Android app** - basically a shell application with a single activity that hosts the JavaScript bundle
1. A **native iOS app** - also a shell application with a single view that hosts the JavaScript bundle
1. A **JavaScript bundle** - the bundled JavaScript application code

### Versioning

The app version actually consists of two parts:

### 1. `#.#.#` the native app version

Android and iOS app versions will always be kept in sync.

The version of a running Adroit mobile app should be identified by using both parts of the version, e.g. `1.2.0 v32`

As the main version number appears in multiple places, a helper script, `bump_version.sh`, is used to ensure the version number is set correctly for the NPM package and the Android and iOS apps. To update the version everywhere:

```sh
# Run the script to update the version number everywhere. For example, to update to v1.0.0:
> .\bump_version.sh 1.0.0
# Check the changes and, assuming the version number updates are the only changes:
> git add .
> git commit -m 'Bumped version number to 1.0.0'
```

**Don't forget to update the [CHANGELOG.md](./CHANGELOG.md) when bumping the version number.**

### 2. `v##` the Code Push version

This is a single numeric version number that increments for every Code Push release. It indicates the version of the in-app Code Push update (see section on [Code Push](#code-push)).

The Code Push version number is managed automatically by Code Push.

### Manual Build and Deploy

For both platforms we can build either a `debug` version or a `release` version. Android also supports a `staging` version.

Building and publishing the Adroit mobile app requires careful co-ordination of all of this!

Debug and Release versions of both the Android and iOS apps can be built locally using the relevant NPM scripts (see [package.json](package.json)). _Note: the iOS app can only be built on a Mac OS host machine._

### App Center

Staging and Production builds are managed through Microsoft's [App Center](https://appcenter.ms/orgs/DigiServe/applications). There are separate App Center 'apps' for the [Android Adroit app](https://appcenter.ms/orgs/DigiServe/apps/adroit-android) and the [iOS Adroit app](https://appcenter.ms/orgs/DigiServe/apps/adroit-ios). Both apps are hooked up to the [adroit-mobile GitHub repo](https://github.com/appdevdesigns/adroit-mobile).

#### Builds

To start a new build of the application, click on the 'Build' link on the left side of the application page. Click on the branch you which to build (typically 'master') and then click the 'Build now' button.

Once the build has completed (it will take several minutes - go grab a cup of coffee or something!), you can download the build to test manually or publish it to the Store (see below).

#### Distributing Builds

Once you are happy with the build (i.e. you've tested it manually on a real device), you can use AppCenter to distribute it to the relevant app store. This is an automated process and is done entirely through the AppCenter web app.

To the left of the 'Download' button on the Build details page there is a 'Distribute' button. Click on this,and select 'Store' from the drop-down options to open the Distribution side-bar. Now select your distribution destination and click 'Next'. Then enter the release notes for this release and click 'Distribute'.

_Note: Be very careful when making edits in the side-bar as clicking anywhere outside of the side-bar will dismiss it and all your edits will be lost. Hopefully Microsoft will fix this behavior but in the mean-time its worth writing your release notes elsewhere and then pasting them into the side-bar textarea to avoid heartache if you accidentally click outside the side-bar and lose your work!_

For iOS distributions, it will take several minutes before the release shows up in the App Store Connect account.

#### Code Push

Code Push releases are managed by the App Center. There are two release configurations:

1. Staging
2. Release

Each configuration has a different key. Either the staging or release key is 'baked into' the app at build time, depending on the build configuration. The app will therefore only look for updates under the corresponding configuration. Read the [documentation](https://docs.microsoft.com/en-us/appcenter/distribution/codepush/cli) for a much fuller explanation!

NPM scripts are provided to create new Code Push releases. First check that all changes are committed and that you haven't made any 'native' code changes (as this will require a regular app update, not just a Code Push update). Then run one of the following commands:

```sh
# To create a staging Code Push release for Android:
> yarn run cp-release --os=android --environment=Staging

# To create a production Code Push release for Android:
> yarn run cp-release --os=android --environment=Production

# To create a staging Code Push release for iOS:
> yarn run cp-release --os=ios --environment=Staging

# To create a production Code Push release for iOS:
> yarn run cp-release --os=ios --environment=Production
```

## Development Workflows

### Code Push Update procedure

If you have not made any changes to the `android` or `ios` folders, code changes can be deployed as a Code Push release:

1. On your dev machine:
    1. Make code changes
    1. Commit & push changes
    1. Create `Staging` Code Push releases for Android and iOS:
        - `yarn run cp-release --os=android --environment=Staging`
        - `yarn run cp-release --os=ios --environment=Staging`
    1. Add an entry in [CHANGELOG.md](./CHANGELOG.md) with changes included in this Code Push release
1. Test the `Staging` Code Push update on staging apps installed on (registered) Android and iOS test devices
1. If there's no problems, **Promote** the `Staging` Code Push releases to `Production` (from the Code Push tab in App Center)

## App Update procedure

If you _have_ made changes to either the `android` or `ios` folders, code changes must be deployed as an App Update (bump the version number):

1. On your dev machine:
    1. Make code changes
    1. Bump version number (`.\bump_version.sh #.#.#`)
    1. Add an entry in [CHANGELOG.md](./CHANGELOG.md) with changes included in this release
    1. Commit & push changes
1. In App Center, build _staging_ builds for Android and iOS:
    - adroit-android: Set **Build Variant** to `releaseStaging` and uncheck the 'Build status badge' option
    - adroit-ios: Set **Shared Schema** to `adroit-staging` and uncheck the 'Build status badge' option
1. In App Center, distribute the staging builds to the Google Play Store (**Alpha**) and App Store (**App Store Connect Users**)
1. Install and test the new staging apps on (registered) Android and iOS test devices
1. If there's no problems, in App Center, build production builds for Android and iOS
    - adroit-android: Set **Build Variant** to `release` and check the 'Build status badge' option
    - adroit-ios: Set **Shared Schema** to `adroit` and check the 'Build status badge' option
1. (Optional) Distribute the production builds to the Google Play Store (**Beta**) and App Store (**Beta Testers**)
    - Test the new production app on Beta test user's devices
1. Distribute the production builds to the Google Play Store and App Store (**Production**)
1. Wait for app review & approval
1. Verify the new production app works on Android and iOS