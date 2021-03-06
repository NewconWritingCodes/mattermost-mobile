// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {setChannelDisplayName} from 'app/actions/views/channel';
import {makeDirectChannel} from 'app/actions/views/more_dms';
import {getTheme} from 'app/selectors/preferences';
import {getProfiles, searchProfiles} from 'mattermost-redux/actions/users';
import {getMyPreferences} from 'mattermost-redux/selectors/entities/preferences';

import MoreDirectMessages from './more_dms';

function mapStateToProps(state, ownProps) {
    const {getProfiles: requestStatus, searchProfiles: searchRequest} = state.requests.users;
    const {createChannel: createChannelRequest} = state.requests.channels;

    function getUsers() {
        const {profiles, currentUserId} = state.entities.users;
        const users = {...profiles};
        Reflect.deleteProperty(users, currentUserId);
        return Object.values(users).sort((a, b) => {
            const nameA = a.username;
            const nameB = b.username;

            return nameA.localeCompare(nameB);
        });
    }

    return {
        ...ownProps,
        preferences: getMyPreferences(state),
        profiles: getUsers(),
        theme: getTheme(state),
        currentDisplayName: state.views.channel.displayName,
        createChannelRequest,
        requestStatus,
        searchRequest
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            makeDirectChannel,
            getProfiles,
            searchProfiles,
            setChannelDisplayName
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MoreDirectMessages);
