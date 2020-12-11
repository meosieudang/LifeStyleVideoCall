import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {RTCView} from 'react-native-connectycube';
import {BlurView} from '@react-native-community/blur';

const URI =
  'https://cdn.pixabay.com/photo/2020/12/01/10/03/cathedral-5793622_1280.jpg';

const RTCViewRendered = ({
  userId,
  stream,
  muteVideoOpponent,
  showCamera,
  muteUserId,
}) => {
  if (
    (userId === muteUserId && muteVideoOpponent) ||
    (userId === 'localStream' && !showCamera)
  )
    return (
      <View style={styles.blackView}>
        <Image
          key={'blurryImage'}
          source={{uri: URI}}
          style={styles.absolute}
        />
        <BlurView
          style={styles.absolute}
          blurType={'dark'}
          blurAmount={10}
          reducedTransparencyFallbackColor="white"
        />
      </View>
    );
  if (stream) {
    return (
      <RTCView
        mirror={true}
        objectFit="cover"
        style={styles.blackView}
        key={userId}
        streamURL={stream.toURL()}
      />
    );
  }
  return (
    <View style={styles.blackView}>
      <Text style={{color: 'white'}}>loading</Text>
      {/* <CallingLoader name={CallService.getUserById(userId, 'name')} /> */}
    </View>
  );
};

const RTCViewGrid = ({streams, muteVideoOpponent, showCamera, muteUserId}) => {
  const streamsCount = streams.length;
  let RTCListView = null;

  switch (streamsCount) {
    case 1:
      RTCListView = (
        <RTCViewRendered
          userId={streams[0].userId}
          stream={streams[0].stream}
          muteVideoOpponent={muteVideoOpponent}
          showCamera={showCamera}
        />
      );
      break;

    case 2:
      RTCListView = (
        <View style={styles.inColumn}>
          <RTCViewRendered
            userId={streams[0].userId}
            stream={streams[0].stream}
            muteVideoOpponent={muteVideoOpponent}
            showCamera={showCamera}
            muteUserId={muteUserId}
          />
          <RTCViewRendered
            userId={streams[1].userId}
            stream={streams[1].stream}
            muteVideoOpponent={muteVideoOpponent}
            showCamera={showCamera}
            muteUserId={muteUserId}
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
              muteVideoOpponent={muteVideoOpponent}
              showCamera={showCamera}
            />
            <RTCViewRendered
              userId={streams[1].userId}
              stream={streams[1].stream}
              muteVideoOpponent={muteVideoOpponent}
              showCamera={showCamera}
            />
          </View>
          <RTCViewRendered
            userId={streams[2].userId}
            stream={streams[2].stream}
            muteVideoOpponent={muteVideoOpponent}
            showCamera={showCamera}
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
              muteVideoOpponent={muteVideoOpponent}
              showCamera={showCamera}
            />
            <RTCViewRendered
              userId={streams[1].userId}
              stream={streams[1].stream}
              muteVideoOpponent={muteVideoOpponent}
              showCamera={showCamera}
            />
          </View>
          <View style={styles.inRow}>
            <RTCViewRendered
              userId={streams[2].userId}
              stream={streams[2].stream}
              muteVideoOpponent={muteVideoOpponent}
              showCamera={showCamera}
            />
            <RTCViewRendered
              userId={streams[3].userId}
              stream={streams[3].stream}
              muteVideoOpponent={muteVideoOpponent}
              showCamera={showCamera}
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
});
