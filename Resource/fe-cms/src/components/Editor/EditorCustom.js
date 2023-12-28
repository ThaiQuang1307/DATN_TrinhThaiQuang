import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import './style.scss';

const fontSizeOptions = [8, 9, 10, 11, 12, 13, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

const EditorCustom = (props) => {

    const {
        // attribute
        id,
        isReadOnly,
        data,
        shouldNotGroupWhenFull = true,
        toolbarCustomItems = [],
        // plugin
        useTittlePlugin = false,
        // function
        onReady,
        onChange,
        onBlur,
        onFocus
    } = props;

    return(
        <CKEditor
            id={id}
            editor={ Editor }
            width='100%'
            config={{
                fontSize: {
                    options: fontSizeOptions
                },
                toolbar: {
                    items: toolbarCustomItems?.length > 0 ? toolbarCustomItems : Editor.defaultConfig.toolbar.items,
                    shouldNotGroupWhenFull
                },
                removePlugins: [!useTittlePlugin && 'Title']
            }}
            disabled={isReadOnly}
            data={data}
            onReady={(editor) =>  {
                if(isReadOnly) {
                    editor.ui.view.toolbar.element.style.display = 'none';
                }
                onReady && onReady();
            }}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
        />
    )
}

export default EditorCustom;