import ConnectyCube from 'react-native-connectycube';

export default class CallService {
  static MEDIA_OPTIONS = {audio: true, video: {facingMode: 'user'}};

  _session = null;
  mediaDevices = [];

  outgoingCall = new Sound(require('../../sounds/dialing.mp3'));
  incomingCall = new Sound(require('../../sounds/calling.mp3'));
  endCall = new Sound(require('../../sounds/end_call.mp3'));

  setMediaDevices() {
    return ConnectyCube.videochat.getMediaDevices().then((mediaDevices) => {
      this.mediaDevices = mediaDevices;
    });
  }

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
      console.log(this._session, 'session');
      this.playSound('end');
      this._session.stop({});
      ConnectyCube.videochat.clearSession(this._session.ID);
      this._session = null;
      this.mediaDevices = [];
    }
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
