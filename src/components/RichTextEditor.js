import React, {useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {RichEditor, RichToolbar, actions} from 'react-native-pell-rich-editor';
import Icon from 'react-native-vector-icons/Ionicons';
import {COLORS, PADDING, TYPOGRAPHY} from '../constants/theme';

const RichTextEditor = ({placeholder, onChange,name,value}) => {
  const richText = useRef(null);

  return (
    <View style={styles.editorContainer}>
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
          contentCSSText: `font-size: 12px;padding: 12px 18px;color:${COLORS.placeHolderColor};fontFamily: Quicksand-Regular;fontWeight:500;height:220px;border-Radius:1px; border-color:${COLORS.black};`,
        }}
        styleWithCSS={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 4,
    paddingVertical: 8,
    position: 'relative',
    marginBottom: 8,
  },
  label: {
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.labelColor,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    marginLeft: 4,
  },
  editorContainer: {
    borderColor: '#E1E5E9',
    borderWidth: 1.5,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
    // iOS Shadows
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    // shadowOpacity: 0.06,
    shadowRadius: 1,
    // Android Shadow
    elevation: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    borderRadius: 12,
  },
  richBar: {
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E5E9',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  flatStyle: {
    paddingHorizontal: 4,
  },
  selectedButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginHorizontal: 2,
  },
  unselectedButton: {
    backgroundColor: 'transparent',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginHorizontal: 2,
  },
  editor: {
    backgroundColor: COLORS.white,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E1E5E9',
    backgroundColor: '#F8F9FA',
  },
  characterCount: {
    fontSize: 12,
    fontFamily: 'Quicksand-Regular',
    color: COLORS.placeHolderColor,
    fontWeight: '500',
  },
  overLimitText: {
    color: COLORS.red,
    fontWeight: '600',
  },
  errorText: {
    color: COLORS.red,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 16,
    fontFamily: 'Quicksand-Regular',
    fontWeight: '500',
  },
  warningText: {
    color: COLORS.red,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
    fontFamily: 'Quicksand-Regular',
    fontWeight: '600',
  },
});

export default RichTextEditor;
