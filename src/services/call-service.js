import ConnectyCube from 'react-native-connectycube';

export default class CallService {
  static MEDIA_OPTIONS = {audio: true, video: {facingMode: 'user'}};

  _session = null;
  mediaDevices = [];

  setMediaDevices() {
    return ConnectyCube.videochat.getMediaDevices().then((mediaDevices) => {
      this.mediaDevices = mediaDevices;
    });
  }

  startCall = (ids) => {
    const options = {};
    console.log(ConnectyCube, 'type', ids);
    const type = ConnectyCube.videochat.CallType.VIDEO; // AUDIO is also possible
    this._session = ConnectyCube.videochat.createNewSession(ids, type, options);
    this.setMediaDevices();

    return this._session
      .getUserMedia(CallService.MEDIA_OPTIONS)
      .then((stream) => {
        this._session.call({});
        return stream;
      });
  };

  stopCall = () => {
    // this.stopSounds();

    if (this._session) {
      console.log(this._session, 'session');
      // this.playSound('end');
      this._session.stop({});
      ConnectyCube.videochat.clearSession(this._session.ID);
      this._session = null;
      this.mediaDevices = [];
    }
  };
}
