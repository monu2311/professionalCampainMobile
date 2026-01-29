import React, {useRef, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {RichEditor, RichToolbar, actions} from 'react-native-pell-rich-editor';
import Icon from 'react-native-vector-icons/Ionicons';
import {COLORS, PADDING, TYPOGRAPHY} from '../constants/theme';
import { useTranslation } from '../localization/hooks/useTranslation';
import { NAMESPACES } from '../localization/config/namespaces';
import { useLanguageContext } from '../localization/LanguageProvider';
import { getFlexDirection, getTextAlign, getWritingDirection } from '../localization/RTLProvider';

const RichTextEditor = ({placeholder, onChange,name,value}) => {
  const richText = useRef(null);
  const { t } = useTranslation([NAMESPACES.SCREENS, NAMESPACES.FORMS, NAMESPACES.COMMON]);
  const { isRTL, currentLanguage, forceUpdate } = useLanguageContext();

  // RTL-aware actions array
  const toolbarActions = isRTL ? [
    // Reverse order for RTL
    actions.insertImage,
    actions.insertLink,
    actions.insertOrderedList,
    actions.insertBulletsList,
    actions.alignRight,
    actions.alignCenter,
    actions.alignLeft,
    actions.setItalic,
    actions.setBold,
    actions.redo,
    actions.undo,
  ] : [
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
  ];

  // Listen for language changes and update editor direction
  useEffect(() => {
    if (richText.current) {
      console.log(`📝 RichTextEditor: Language changed to ${currentLanguage}, RTL: ${isRTL}`);
      // Force editor to re-render with new direction
      richText.current.setContentHTML(value || '');
    }
  }, [currentLanguage, isRTL, forceUpdate, value]);

  return (
    <View>
      <RichToolbar
        style={[styles.richBar, {
          flexDirection: getFlexDirection(isRTL, 'row'),
        }]}
        flatContainerStyle={[styles.flatStyle, {
          flexDirection: getFlexDirection(isRTL, 'row'),
        }]}
        selectedButtonStyle={{fontSize: 8}}
        unselectedButtonStyle={{fontSize: 8}}
        editor={richText}
        actions={toolbarActions}
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
        style={[styles.editor, {
          borderTopRightRadius: isRTL ? 8 : 0,
          borderTopLeftRadius: isRTL ? 0 : 8,
        }]}
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
          contentCSSText: `
            font-size: 12px;
            padding: 12px 18px;
            color: ${COLORS.placeHolderColor};
            font-family: Quicksand-Regular;
            font-weight: 500;
            height: 220px;
            direction: ${getWritingDirection(isRTL)};
            text-align: ${getTextAlign(isRTL, 'left')};
            unicode-bidi: ${isRTL ? 'bidi-override' : 'normal'};
          `,
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
  flatStyle: {
    paddingHorizontal: 8,
  },
  editor: {
    height: 220,
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
