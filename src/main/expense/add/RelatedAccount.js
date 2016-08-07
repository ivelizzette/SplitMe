// @flow weak

import React, {PropTypes, Component} from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import {createStyleSheet} from 'stylishly/lib/styleSheet';
import ImmutablePropTypes from 'react-immutable-proptypes';
import TextField from 'material-ui-build/src/TextField';
import {connect} from 'react-redux';
import polyglot from 'polyglot';
import accountUtils from 'main/account/utils';
import screenActions from 'main/screen/actions';
import RelatedAccountDialog from 'main/expense/add/RelatedAccountDialog';
import MemberAvatars from 'main/member/Avatars';
import List from 'modules/components/List';

const styleSheet = createStyleSheet('ExpenseRelatedAccount', () => ({
  root: {
    width: '100%',
  },
}));

class ExpenseRelatedAccount extends Component {
  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    accounts: ImmutablePropTypes.list.isRequired,
    dispatch: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    openDialog: PropTypes.bool.isRequired,
    textFieldStyle: PropTypes.object,
  };

  static contextTypes = {
    styleManager: PropTypes.object.isRequired,
  };

  handleFocus = (event) => {
    event.target.blur();
  };

  handleTouchTap = () => {
    this.props.dispatch(screenActions.showDialog('relatedAccount'));
  };

  handleRequestClose = () => {
    this.props.dispatch(screenActions.dismissDialog());
  };

  render() {
    const classes = this.context.styleManager.render(styleSheet);
    const {
      account,
      accounts,
      onChange,
      openDialog,
      textFieldStyle,
    } = this.props;

    let relatedAccount;

    if (account.get('_id')) {
      relatedAccount = (
        <div>
          {polyglot.t('expense_related_account')}
          <List
            left={<MemberAvatars members={account.get('members')} />}
            onTouchTap={this.handleTouchTap}
            withoutMargin={true}
          >
            {accountUtils.getNameAccount(account)}
          </List>
        </div>
      );
    } else {
      relatedAccount = (
        <TextField
          hintText={polyglot.t('expense_related_account')}
          onTouchTap={this.handleTouchTap}
          onFocus={this.handleFocus}
          fullWidth={true}
          data-test="ExpenseAddRelatedAccount"
          style={textFieldStyle}
        />
      );
    }

    return (
      <div className={classes.root}>
        {relatedAccount}
        <RelatedAccountDialog
          accounts={accounts}
          selected={account.get('_id')}
          onChange={onChange}
          onRequestClose={this.handleRequestClose}
          open={openDialog}
        />
      </div>
    );
  }
}

export default compose(
  pure,
  connect(),
)(ExpenseRelatedAccount);
