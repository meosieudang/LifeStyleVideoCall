import ConnectyCube from 'react-native-connectycube';
import InCallManager from 'react-native-incall-manager';
import Sound from 'react-native-sound';

export default class CallService {
  static MEDIA_OPTIONS = {audio: true, video: {facingMode: 'user'}};

  _session = null;
  mediaDevices = [];

  outgoingCall = new Sound(require('../../sounds/dialing.mp3'));
  incomingCall = new Sound(require('../../sounds/calling.mp3'));
  endCall = new Sound(require('../../sounds/end_call.mp3'));

  getSession = () => this._session;

  setMediaDevices() {
    return ConnectyCube.videochat.getMediaDevices().then((mediaDevices) => {
      this.mediaDevices = mediaDevices;
    });
  }

  acceptCall = (session) => {
    this.stopSounds();
    this._session = session;
    this.setMediaDevices();

    return this._session
      .getUserMedia(CallService.MEDIA_OPTIONS)
      .then((stream) => {
        this._session.accept({});
        return stream;
      });
  };

  startCall = (ids) => {
    const options = {};
    const type = ConnectyCube.videochat.CallType.VIDEO; // AUDIO is also possible

    this._session = ConnectyCube.videochat.createNewSession(ids, type, options);
    this.setMediaDevices();
    this.playSound('outgoing');

    return this._session
      .getUserMedia(CallService.MEDIA_OPTIONS)
      .then((stream) => {
        this._session.call({});
        return stream;
      });
  };

  stopCall = () => {
    this.stopSounds();

    if (this._session) {
      this.playSound('end');
      this._session.stop({});
      ConnectyCube.videochat.clearSession(this._session.ID);
      this._session = null;
      this.mediaDevices = [];
    }
  };

  rejectCall = (session, extension) => {
    this.stopSounds();
    session.reject(extension);
  };

  processOnAcceptCallListener(session, userId, extension = {}) {
    return new Promise((resolve, reject) => {
      if (userId === session.currentUserID) {
        this._session = null;
        // this.showToast('You have accepted the call on other side');

        reject();
      } else {
        // const userName = this.getUserById(userId, 'name');
        // const message = `${userName} has accepted the call`;

        // this.showToast(message);
        this.stopSounds();

        resolve();
      }
    });
  }

  processOnCallListener(session) {
    return new Promise((resolve, reject) => {
      if (session.initiatorID === session.currentUserID) {
        reject();
      }

      if (this._session) {
        this.rejectCall(session, {busy: true});
        reject();
      }

      resolve();
    });
  }

  processOnRejectCallListener(session, userId, extension = {}) {
    this.stopSounds();
    return new Promise((resolve, reject) => {
      if (userId === session.currentUserID) {
        this._session = null;
        // this.showToast('You have rejected the call on other side');
        console.log('no busy');

        reject();
      } else {
        // const userName = this.getUserById(userId, 'name');
        // const message = extension.busy
        //   ? `${userName} is busy`
        //   : `${userName} rejected the call request`;

        // this.showToast(message);
        console.log('busy');

        resolve();
      }
    });
  }

  processOnStopCallListener(userId, isInitiator) {
    return new Promise((resolve, reject) => {
      this.stopSounds();

      if (!this._session) {
        reject();
      } else {
        // const userName = this.getUserById(userId, 'name');
        // const message = `${userName} has ${
        //   isInitiator ? 'stopped' : 'left'
        //   } the call`;

        // this.showToast(message);

        resolve();
      }
    });
  }

  processOnRemoteStreamListener = () => {
    return new Promise((resolve, reject) => {
      if (!this._session) {
        reject();
      } else {
        resolve();
      }
    });
  };

  processOnUserNotAnswerListener(userId) {
    return new Promise((resolve, reject) => {
      if (!this._session) {
        reject();
      } else {
        // const userName = this.getUserById(userId, 'name');
        // const message = `${userName} did not answer`;

        // this.showToast(message);

        resolve();
        this.stopSounds();
      }
    });
  }

  processOnMessageListener = () => {
    return new Promise((resolve, reject) => {
      if (!this._session) {
        reject();
      } else {
        resolve();
      }
    });
  };

  switchCamera = (localStream) => {
    localStream.getVideoTracks().forEach((track) => track._switchCamera());
  };

  setAudioMuteState = (mute) => {
    if (!this._session) return;
    if (mute) {
      this._session.mute('audio');
    } else {
      this._session.unmute('audio');
    }
  };

  setVideoMuteState = (mute) => {
    if (!this._session) return;
    if (mute) {
      this._session.mute('video');
    } else {
      this._session.unmute('video');
    }
  };

  setSpeakerphoneOn = (flag) => InCallManager.setSpeakerphoneOn(flag);
  setKeepScreenOn = (flag) => InCallManager.setKeepScreenOn(flag);

  playSound = (type) => {
    switch (type) {
      case 'outgoing':
        this.outgoingCall.setNumberOfLoops(-1);
        this.outgoingCall.play();
        break;
      case 'incoming':
        this.incomingCall.setNumberOfLoops(-1);
        this.incomingCall.play();
        break;
      case 'end':
        this.endCall.play();
        break;

      default:
        break;
    }
  };

  stopSounds = () => {
    if (this.incomingCall.isPlaying()) {
      this.incomingCall.pause();
    }
    if (this.outgoingCall.isPlaying()) {
      this.outgoingCall.pause();
    }
  };
}
