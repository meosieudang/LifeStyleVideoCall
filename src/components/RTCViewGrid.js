import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {RTCView} from 'react-native-connectycube';
import {BlurView} from '@react-native-community/blur';
import Icon from 'react-native-vector-icons/Ionicons';

const URI =
  'https://cdn.pixabay.com/photo/2020/12/01/10/03/cathedral-5793622_1280.jpg';

const RTCViewRendered = (props) => {
  const {
    userId,
    stream,
    showCamera,
    muteVideoIds = [],
    muteMicIds = [],
    showMic,
    hasVideoCall,
    uriImage = URI,
  } = props;
  const hasMuteMic =
    (userId === 'localStream' && !showMic) || muteMicIds.includes(userId);
  const hasMuteCamera =
    (userId === 'localStream' && !showCamera) || muteVideoIds.includes(userId);

  if (hasMuteCamera || !hasVideoCall)
    return (
      <View style={[styles.blackView, !hasVideoCall && styles.notVideoCall]}>
        <View style={styles.wrapMic}>
          {hasMuteMic && (
            <Icon name={'mic-off-outline'} size={35} color={'white'} />
          )}
        </View>
        <Image
          key={'blurryImage'}
          source={{uri: uriImage}}
          style={styles.absolute}
        />
        <View style={styles.overlay} />

        {/* <BlurView
          style={styles.absolute}
          blurType={'dark'}
          blurAmount={10}
          reducedTransparencyFallbackColor={'white'}
        /> */}
      </View>
    );
  if (!stream)
    return (
      <View style={[styles.blackView, {justifyContent: 'center'}]}>
        <ActivityIndicator />
      </View>
    );
  return (
    <View style={styles.blackView}>
      <View style={styles.wrapMic}>
        {hasMuteMic && (
          <Icon name={'mic-off-outline'} size={35} color={'white'} />
        )}
      </View>
      <RTCView
        mirror={true}
        objectFit="cover"
        style={[styles.blackView]}
        key={userId}
        streamURL={stream.toURL()}
      />
    </View>
  );
};

const RTCViewGrid = (props) => {
  const {streams, showCamera, hasVideoCall, uriImage} = props;
  const streamsCount = streams.length;

  let RTCListView = null;

  switch (streamsCount) {
    case 1:
      RTCListView = (
        <RTCViewRendered
          userId={streams[0].userId}
          stream={streams[0].stream}
          {...props}
        />
      );
      break;

    case 2:
      RTCListView = (
        <View style={styles.inColumn}>
          <RTCViewRendered
            userId={streams[0].userId}
            stream={streams[0].stream}
            {...props}
          />
          <RTCViewRendered
            userId={streams[1].userId}
            stream={streams[1].stream}
            {...props}
          />
        </View>
      );
      break;

    case 3:
      RTCListView = (
        <View style={styles.inColumn}>
          <View style={styles.inRow}>
            <RTCViewRendered
              userId={streams[0].userId}
              stream={streams[0].stream}
              {...props}
            />
            <RTCViewRendered
              userId={streams[1].userId}
              stream={streams[1].stream}
              {...props}
            />
          </View>
          <RTCViewRendered
            userId={streams[2].userId}
            stream={streams[2].stream}
            {...props}
          />
        </View>
      );
      break;

    case 4:
      RTCListView = (
        <View style={styles.inColumn}>
          <View style={styles.inRow}>
            <RTCViewRendered
              userId={streams[0].userId}
              stream={streams[0].stream}
              {...props}
            />
            <RTCViewRendered
              userId={streams[1].userId}
              stream={streams[1].stream}
              {...props}
            />
          </View>
          <View style={styles.inRow}>
            <RTCViewRendered
              userId={streams[2].userId}
              stream={streams[2].stream}
              {...props}
            />
            <RTCViewRendered
              userId={streams[3].userId}
              stream={streams[3].stream}
              {...props}
            />
          </View>
        </View>
      );
      break;

    default:
      break;
  }

  return <View style={styles.blackView}>{RTCListView}</View>;
};

export default RTCViewGrid;

const styles = StyleSheet.create({
  blackView: {
    flex: 1,
    backgroundColor: 'black',
  },
  inColumn: {
    flex: 1,
    flexDirection: 'column',
  },
  inRow: {
    flex: 1,
    flexDirection: 'row',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  wrapMic: {
    position: 'absolute',
    zIndex: 99,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notVideoCall: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    backgroundColor: 'black',
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
});
