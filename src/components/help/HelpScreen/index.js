import React from 'react';
import { Image, View } from 'react-native';
import { Container, Content, H1, H2, H3, Text, Badge, Icon } from 'native-base';
import AdroitScreen from 'src/components/common/AdroitScreen';
import AdroitHeader from 'src/components/common/AdroitHeader';
import Copy from 'src/assets/Copy';
import baseStyles from 'src/assets/style';
import styles from './style';

// Images
const introImage = require('src/assets/img/help/intro.png');
const tutorialImage = require('src/assets/img/help/tutorial.png');
const activityListImage = require('src/assets/img/help/activity_list.png');
const drawerImage = require('src/assets/img/help/drawer.png');
const statusBarImage = require('src/assets/img/help/status_bar.png');
const aheadImage = require('src/assets/img/help/status_ahead.png');
const onTrackImage = require('src/assets/img/help/status_ontrack.png');
const behindImage = require('src/assets/img/help/status_behind.png');
const warningImage = require('src/assets/img/help/status_warning.png');
const locationsImage = require('src/assets/img/help/locations.jpg');

const Bold = ({ children, ...props }) => (
  <Text {...props} style={baseStyles.boldText}>
    {children}
  </Text>
);

const Bullet = () => <Text>&#9679;&nbsp;</Text>;

export default class HelpScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <AdroitScreen>
        <Container>
          <AdroitHeader title={Copy.helpTitle} />
          <Content style={styles.wrapper}>
            <H1 style={styles.title}>Welcome to Adroit Mobile!</H1>
            <View style={styles.section}>
              <Text style={[baseStyles.paragraph, styles.paragraph]}>
                We are very excited to have the Adroit Mobile app available for our volunteers to use to capture all the
                exciting ministry they are doing throughout Thailand. Although the app is very user friendly, we do want
                to provide you with some brief information on using Adroit Mobile. These help pages will be divided into
                the following sections:
              </Text>
              <Text style={styles.sectionLink}>Interface Overview</Text>
              <Text style={styles.sectionLink}>Adroit Mobile User Guide</Text>
              <Text style={styles.sectionLink}>Updating Locations</Text>
              <Text>With that said, let&#39;s get to it!</Text>
            </View>

            <View style={styles.section}>
              <H2 style={styles.title}>Interface Overview</H2>
              <Text style={[baseStyles.paragraph, styles.paragraph]}>
                When you log in for the first time, you will be presented with the “Getting started with Adroit”
                tutorial screen shown below. Everyone is encouraged to walk through this tutorial to get a basic
                overview of the various parts of the Adroit App.
              </Text>
              <Image source={introImage} style={styles.fullScreenshot} />
              <Text style={[baseStyles.paragraph, styles.paragraph]}>
                If you ever want to go back and review the tutorial again, you can do so by clicking on the
                &#34;hamburger&#34; menu in the upper left and selecting &#34;Show Tutorial&#34;.
              </Text>
              <Image source={tutorialImage} style={styles.fullScreenshot} />
            </View>

            <View style={styles.section}>
              <H3 style={styles.title}>Basics of the Interface</H3>
              <Image source={activityListImage} style={styles.fullScreenshot} />
              <View style={styles.interfaceItem}>
                <View style={styles.interfaceItemTitle}>
                  <Badge style={styles.interfaceItemBadge}>
                    <Text>1</Text>
                  </Badge>
                  <Bold>&#34;Hamburger&#34; Menu</Bold>
                </View>
                <Text style={[baseStyles.paragraph, styles.paragraph]}>
                  This provides access to this help information, a link to provide feedback to FCF and its developers,
                  view the tutorial again, manage your locations, and log out.
                </Text>
                <Image source={drawerImage} style={styles.drawerImage} />
              </View>
              <View style={styles.interfaceItem}>
                <View style={styles.interfaceItemTitle}>
                  <Badge style={styles.interfaceItemBadge}>
                    <Text>2</Text>
                  </Badge>
                  <Bold>Status Bar</Bold>
                </View>
                <Text style={[baseStyles.paragraph, styles.paragraph]}>
                  This status bar provides you with details regarding the number of photos you have uploaded in relation
                  to the reporting period.
                </Text>
                <Image source={statusBarImage} style={styles.statusBarImage} />
                <Text style={[baseStyles.paragraph, styles.paragraph]}>The status bar shows...</Text>
                <Text style={styles.listItem}>
                  <Bullet />
                  How many of your uploaded photos have been approved
                </Text>
                <Text style={styles.listItem}>
                  <Bullet />
                  How many of your uploaded photos are new (and yet to be approved)
                </Text>
                <Text style={styles.listItem}>
                  <Bullet />
                  How many days are left in the current reporting period
                </Text>
                <Text style={styles.listItem}>
                  <Bullet />A quick visual on how you are doing:
                </Text>
                <View style={styles.statusContainer}>
                  <Image source={aheadImage} style={styles.statusImage} />
                  <Image source={onTrackImage} style={styles.statusImage} />
                  <Image source={behindImage} style={styles.statusImage} />
                  <Image source={warningImage} style={styles.statusImage} />
                </View>
                <Text style={styles.listItem}>
                  <Bullet />
                  The bar graph (on the bottom) compares how far through the current reporting period we are (black
                  vertical bar) with how many approved photos you have uploaded (green progress bar) and how many new
                  photos you have uploaded (black progress bar). A good goal is to keep the green progress bar ahead of
                  the black vertical bar.
                </Text>
              </View>
              <View style={styles.interfaceItem}>
                <View style={styles.interfaceItemTitle}>
                  <Badge style={styles.interfaceItemBadge}>
                    <Text>3</Text>
                  </Badge>
                  <Bold>Photo Stream</Bold>
                </View>
                <Text style={[baseStyles.paragraph, styles.paragraph]}>
                  This area shows the photos you have uploaded during the current reporting period, as well as the
                  Activity Container, the Ministry Team, and a preview of the Caption.
                </Text>
                <Text style={styles.listItem}>
                  <Bullet />
                  Grey framed pictures: new photos
                </Text>
                <Text style={styles.listItem}>
                  <Bullet />
                  Green framed pictures: approved photos
                </Text>
                <Text style={styles.listItem}>
                  <Bullet />
                  Red framed pictures: denied photos
                </Text>
              </View>
              <View style={styles.interfaceItem}>
                <View style={styles.interfaceItemTitle}>
                  <Badge style={styles.interfaceItemBadge}>
                    <Text>4</Text>
                  </Badge>
                  <Bold>Add Photo</Bold>
                </View>
                <Text style={[baseStyles.paragraph, styles.paragraph]}>
                  Tap on the Add Photo button to add a new activity image. You can either select a photo from your
                  camera roll or take a new photo.
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <H2 style={styles.title}>Adroit Mobile User Guide</H2>
              <Text style={[baseStyles.paragraph, styles.paragraph]}>
                To upload a photo, complete the following steps:
              </Text>
              <Text style={styles.listItem}>1. Click the Add Photo button (see note 1 below).</Text>
              <View style={styles.listItem}>
                <Text>
                  2. On the “select a photo screen,” select a previously taken photo or click the camera icon.
                </Text>
                <Text style={styles.subListItem}>
                  <Bullet />
                  If you select a photo, Adroit will display the photo; click Use Photo (in the upper right) to upload
                  the selected photo to Adroit.
                </Text>
                <Text style={styles.subListItem}>
                  <Bullet />
                  If you click the camera icon (see note 2 below), you can then take a new photo.
                </Text>
              </View>
              <Text style={styles.listItem}>
                3. After selecting a photo or taking a new one, Adroit Mobile will upload the photo. In the center of
                the photo, look for a green check mark to confirm that the photo was successfully uploaded.
              </Text>
              <Text style={styles.listItem}>4. Add a Caption.</Text>
              <Text style={styles.listItem}>5. Set the Date.</Text>
              <Text style={styles.listItem}>
                6. Pick or enter a Location. To add a new location, type the location at the top and click the blue “+
                Add” button (see note 3 below).
              </Text>
              <Text style={styles.listItem}>7. Select the Team.</Text>
              <Text style={styles.listItem}>
                8. Select the Activity. This is the “activity container” to which you want the current photo connected.
              </Text>
              <Text style={styles.listItem}>9. Tag people. Be sure to tag team members in the photo.</Text>
              <Text style={styles.listItem}>10. Click Save.</Text>
              <View style={styles.listItem}>
                <Text>11. After clicking save, you will be prompted with a confirmation pop-up:</Text>
                <Text style={styles.subListItem}>
                  <Bullet />
                  Confirm (tap the box) that your “caption” tells not only what you are doing but how this activity is
                  helping local Thais.
                </Text>
                <Text style={styles.subListItem}>
                  <Bullet />
                  Confirm (tap the box) that you have tagged everyone on your team in the photo.
                </Text>
                <Text style={styles.subListItem}>
                  <Bullet />
                  If everything looks correct, click Upload. To make changes, click Go Back.
                </Text>
              </View>
              <Text style={[baseStyles.paragraph, styles.note]}>
                <Bold>Note 1:</Bold> The first time you click the Add Photo button, you will be asked if you’d like to
                let Adroit to access your photos. Click OK to do so.
              </Text>
              <Text style={[baseStyles.paragraph, styles.note]}>
                <Bold>Note 2:</Bold> The first time you click the camera icon, you will be asked if you’d like to let
                Adroit access your camera. Click OK to do so.
              </Text>
              <Text style={[baseStyles.paragraph, styles.note]}>
                <Bold>Note 3:</Bold> Locations you add can be managed by clicking on the hamburger menu in the upper
                left and selecting &#34;My Locations&#34;.
              </Text>
            </View>

            <View style={styles.section}>
              <H2 style={styles.title}>Updating Locations</H2>
              <Image source={locationsImage} style={styles.locationsImage} />
              <Text style={[baseStyles.paragraph, styles.paragraph]}>
                To add a location, type the location at the top and click the blue plus (
                <Icon type="FontAwesome" name="plus" style={[styles.darkText, styles.inlineIcon]} />) button .
              </Text>
              <Text style={[baseStyles.paragraph, styles.paragraph]}>
                To remove a previously added location, click the red trash can (
                <Icon type="FontAwesome" name="trash" style={[styles.redText, styles.inlineIcon]} />) across from the
                location to be removed.
              </Text>
              <Text style={[baseStyles.paragraph, styles.note]}>
                <Bold>Note:</Bold> Take care when removing locations as there is no confirmation dialogue box upon
                deletion.
              </Text>
            </View>
          </Content>
        </Container>
      </AdroitScreen>
    );
  }
}
