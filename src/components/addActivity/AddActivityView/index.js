import React from 'react';
import PropTypes from 'prop-types';
import { when } from 'mobx';
import { inject, observer } from 'mobx-react';
import { View, Keyboard, TouchableOpacity } from 'react-native';
import {
  Container,
  Content,
  Footer,
  FooterTab,
  Button,
  Spinner,
  Textarea,
  DatePicker,
  Input,
  Left,
  Body,
  Right,
  Title,
  Card,
  CardItem,
  CheckBox,
  Text,
  Label,
  Icon,
} from 'native-base';
import DraftActivityStore, { ActivityStatus } from 'src/store/DraftActivityStore';
import Copy from 'src/assets/Copy';
import Theme from 'src/assets/theme';
import baseStyles from 'src/assets/style';
import selectStyles from 'src/components/common/Select/style';
import { format } from 'src/util/date';
import styles from './style';

const c = Copy.addActivity;
const MAX_CHARS = 240;

@inject('draftActivity')
@observer
class AddActivityView extends React.Component {
  constructor(props) {
    super(props);
    this.inputs = {
      activityName: React.createRef(),
      activityNameGovt: React.createRef(),
      startDate: React.createRef(),
      endDate: React.createRef(),
      description: React.createRef(),
      descriptionGovt: React.createRef(),
    };
    this.state = {
      isFooterVisible: true,
    };
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
    when(
      () => this.props.draftActivity.status === ActivityStatus.succeeded,
      () => {
        this.props.onDone(this.props.draftActivity.addedActivity);
      }
    );
  }

  componentDidMount() {
    const { draftActivity, team } = this.props;
    draftActivity.initNewDraft(team.IDProject, team.IDMinistry);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardDidShow = () => {
    this.setState({ isFooterVisible: false });
  };

  keyboardDidHide = () => {
    this.setState({ isFooterVisible: true });
  };

  focusNextField = id => {
    this.inputs[id].current.wrappedInstance.focus();
  };

  save = () => {
    this.props.draftActivity.save();
  };

  copyActivityName = () => {
    this.props.draftActivity.updateDraft({ activityNameGovt: this.props.draftActivity.activityName });
    Keyboard.dismiss();
  };

  copyDescription = () => {
    this.props.draftActivity.updateDraft({ descriptionGovt: this.props.draftActivity.description });
    Keyboard.dismiss();
  };

  setDraftProp = item => value => {
    this.props.draftActivity.updateDraft({ [item]: value });
  };

  toggleTeamObjective = objectiveIndex => () => {
    const { draftActivity } = this.props;
    const wasSelected = draftActivity.teamObjectives[objectiveIndex].selected;
    this.props.draftActivity.setTeamObjective(objectiveIndex, !wasSelected);
    Keyboard.dismiss();
  };

  render() {
    const { isFooterVisible } = this.state;
    const { draftActivity, onDone } = this.props;
    return (
      <Container>
        <View style={[baseStyles.manualHeader, selectStyles.header]}>
          <Left style={baseStyles.headerLeft} />
          <Body style={baseStyles.headerBody}>
            <Title>{c.screenTitle}</Title>
          </Body>
          <Right style={baseStyles.headerRight} />
        </View>
        <Content contentContainerStyle={styles.main}>
          <Card style={styles.card}>
            <CardItem header style={styles.cardHeader}>
              <Text>{c.headingActivityName}</Text>
            </CardItem>
            <CardItem style={styles.cardItem}>
              <Text style={styles.sectionDescription}>{c.descActivityName}</Text>
            </CardItem>
            <CardItem stackedLabel style={styles.cardItem}>
              <Text style={styles.charCount}>{MAX_CHARS - draftActivity.activityName.length}</Text>
              <Label style={styles.label}>{c.labelActivityName}</Label>
              <Input
                ref={this.inputs.activityName}
                style={styles.input}
                maxLength={MAX_CHARS}
                returnKeyType="next"
                enablesReturnKeyAutomatically
                blurOnSubmit={false}
                placeholder={c.placeholderActivityName}
                value={draftActivity.activityName}
                onChangeText={this.setDraftProp('activityName')}
                onSubmitEditing={() => {
                  this.focusNextField('activityNameGovt');
                }}
              />
            </CardItem>
            <CardItem stackedLabel style={styles.cardItem}>
              <Text style={styles.charCount}>{MAX_CHARS - draftActivity.activityNameGovt.length}</Text>
              <View style={styles.labelWrapper}>
                <Label style={styles.label}>{c.labelActivityNameGovt}</Label>
                <TouchableOpacity onPress={this.copyActivityName}>
                  <Icon type="FontAwesome" name="copy" style={styles.linkIcon} />
                </TouchableOpacity>
              </View>
              <Input
                ref={this.inputs.activityNameGovt}
                style={styles.input}
                maxLength={MAX_CHARS}
                returnKeyType="next"
                enablesReturnKeyAutomatically
                blurOnSubmit={false}
                placeholder={c.placeholderActivityNameGovt}
                value={draftActivity.activityNameGovt}
                onChangeText={this.setDraftProp('activityNameGovt')}
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                }}
              />
            </CardItem>
          </Card>
          <Card style={styles.card}>
            <CardItem header style={styles.cardHeader}>
              <Text style={styles.sectionTitle}>{c.headingDuration}</Text>
            </CardItem>
            <CardItem style={styles.cardItem}>
              <View style={styles.dateContent}>
                <View style={styles.dateWrapper}>
                  <Label style={styles.label}>{c.headingStartDate}</Label>
                  <DatePicker
                    ref={this.inputs.startDate}
                    style={styles.input}
                    defaultDate={draftActivity.startDate}
                    maximumDate={draftActivity.endDate}
                    locale="en"
                    formatChosenDate={d => format(d, 'Do MMM')}
                    timeZoneOffsetInMinutes={undefined}
                    modalTransparent={false}
                    textStyle={styles.date}
                    animationType="fade"
                    androidMode="default"
                    onDateChange={this.setDraftProp('startDate')}
                  />
                </View>
                <View style={styles.dateWrapper}>
                  <Label style={styles.label}>{c.headingEndDate}</Label>
                  <DatePicker
                    ref={this.inputs.endDate}
                    style={styles.input}
                    defaultDate={draftActivity.endDate}
                    minimumDate={draftActivity.startDate}
                    locale="en"
                    formatChosenDate={d => format(d, 'Do MMM')}
                    timeZoneOffsetInMinutes={undefined}
                    modalTransparent={false}
                    textStyle={styles.date}
                    animationType="fade"
                    androidMode="default"
                    onDateChange={this.setDraftProp('endDate')}
                  />
                </View>
              </View>
            </CardItem>
          </Card>
          <Card style={styles.card}>
            <CardItem header style={styles.cardHeader}>
              <Text style={styles.sectionTitle}>{c.headingTeamObjectives}</Text>
            </CardItem>
            <CardItem style={styles.cardItem}>
              <Text style={styles.sectionDescription}>{c.descTeamObjectives}</Text>
            </CardItem>
            <CardItem style={styles.cardItem}>
              <View style={styles.checkboxList}>
                {draftActivity.teamObjectives.map(({ description, id, selected }, index) => (
                  <View key={id} style={styles.checkboxRow}>
                    <CheckBox style={styles.checkbox} checked={selected} onPress={this.toggleTeamObjective(index)} />
                    <TouchableOpacity onPress={this.toggleTeamObjective(index)}>
                      <Text style={styles.checkboxLabel}>{description}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </CardItem>
          </Card>
          <Card style={styles.card}>
            <CardItem header style={styles.cardHeader}>
              <Text style={styles.sectionTitle}>{c.headingDescription}</Text>
            </CardItem>
            <CardItem style={styles.cardItem}>
              <Text style={styles.sectionDescription}>{c.descDescription}</Text>
            </CardItem>
            <CardItem style={styles.cardItem}>
              <Text style={styles.charCount}>{MAX_CHARS - draftActivity.description.length}</Text>
              <Label style={styles.label}>{c.labelDescription}</Label>
              <Textarea
                ref={this.inputs.description}
                value={draftActivity.description}
                onChangeText={this.setDraftProp('description')}
                returnKeyType="done"
                blurOnSubmit={false}
                enablesReturnKeyAutomatically
                rowSpan={3}
                textAlignVertical="top"
                style={styles.input}
                maxLength={MAX_CHARS}
                placeholder={c.placeholderDescription}
                placeholderTextColor="#999"
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                }}
              />
            </CardItem>
            <CardItem style={styles.cardItem}>
              <Text style={styles.charCount}>{MAX_CHARS - draftActivity.descriptionGovt.length}</Text>
              <View style={styles.labelWrapper}>
                <Label style={styles.label}>{c.labelDescriptionGovt}</Label>
                <TouchableOpacity onPress={this.copyDescription}>
                  <Icon type="FontAwesome" name="copy" style={styles.linkIcon} />
                </TouchableOpacity>
              </View>
              <Textarea
                ref={this.inputs.descriptionGovt}
                value={draftActivity.descriptionGovt}
                onChangeText={this.setDraftProp('descriptionGovt')}
                returnKeyType="done"
                enablesReturnKeyAutomatically
                blurOnSubmit
                rowSpan={3}
                textAlignVertical="top"
                style={styles.input}
                maxLength={MAX_CHARS}
                placeholder={c.placeholderDescriptionGovt}
                placeholderTextColor="#999"
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                }}
              />
            </CardItem>
          </Card>
        </Content>
        {isFooterVisible && (
          <Footer>
            <FooterTab>
              <Button
                style={styles.footerButton}
                full
                light
                disabled={draftActivity.isSaving}
                onPress={() => {
                  onDone();
                }}
              >
                <Text style={styles.buttonText}>{c.buttonCancel}</Text>
              </Button>
              <Button
                style={styles.footerButton}
                active
                full
                disabled={draftActivity.isSaving || !draftActivity.isReadyForPosting}
                onPress={this.save}
              >
                {draftActivity.isSaving ? (
                  <Spinner size="small" style={baseStyles.buttonSpinner} color={Theme.btnPrimaryColor} />
                ) : (
                  <Icon type="FontAwesome" name="save" />
                )}
                <Text style={styles.buttonText}>{c.buttonAdd}</Text>
              </Button>
            </FooterTab>
          </Footer>
        )}
      </Container>
    );
  }
}

AddActivityView.propTypes = {
  onDone: PropTypes.func,
  team: PropTypes.shape(),
};

AddActivityView.defaultProps = {
  onDone: () => {},
  team: undefined,
};

AddActivityView.wrappedComponent.propTypes = {
  draftActivity: PropTypes.instanceOf(DraftActivityStore).isRequired,
};

export default AddActivityView;
