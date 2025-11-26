import React, {useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {RichEditor, RichToolbar, actions} from 'react-native-pell-rich-editor';
import Icon from 'react-native-vector-icons/Ionicons';
import {COLORS, PADDING, TYPOGRAPHY} from '../constants/theme';

const RichTextEditor = ({placeholder, onChange,name,value}) => {
  const richText = useRef(null);

  return (
    <View>
      <RichToolbar
        style={styles.richBar}
        flatContainerStyle={styles.flatStyle}
        selectedButtonStyle={{fontSize: 8}}
        unselectedButtonStyle={{fontSize: 8}}
        editor={richText}
        actions={[
          actions.undo,
          actions.redo,
          actions.setBold,
          actions.setItalic,
          actions.alignLeft,
          actions.alignCenter,
          actions.alignRight,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.insertLink,
          actions.insertImage,
        ]}
        iconSize={16}
        iconMap={{
          [actions.undo]: ({tintColor}) => (
            <Icon name="return-up-back" size={16} color={tintColor} />
          ),
          [actions.redo]: ({tintColor}) => (
            <Icon name="return-up-forward" size={16} color={tintColor} />
          ),
        }}
      />
      <RichEditor
        ref={richText}
        style={styles.editor}
        androidHardwareAccelerationDisabled
        androidLayerType="software"
        useContainer={true}
        initialHeight={220}
        name={name}
        enterKeyHint={'done'}
        placeholder={placeholder || 'Please input content'}
        onChange={onChange}
        initialContentHTML={value} 
        pasteAsPlainText={true}
        editorStyle={{
          contentCSSText: `font-size: 12px;padding: 12px 18px;color:${COLORS.placeHolderColor};fontFamily: Quicksand-Regular;fontWeight:500;height:220px`,
        }}
        styleWithCSS={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  richBar: {
    backgroundColor: COLORS.white,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    width: '100%',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    overflow: 'scroll',
  },
  editor: {
    // padding:PADDING.small,
    height:220,
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderColor: '#CCCCCC',
    borderWidth: 0.5,
    borderTopWidth: 0,
    fontSize: 8,
  },
});

export default RichTextEditor;
