import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import {
  Button, Icon, Input, Upload, Modal, Tag, Tooltip,
} from 'antd';
import 'tui-editor/dist/tui-editor-extScrollSync.min';
import { beforeUpload } from '../../util/tools';
import 'codemirror/lib/codemirror.css';
import 'tui-editor/dist/tui-editor.min.css';
import 'tui-editor/dist/tui-editor-contents.min.css';
import 'highlightjs/styles/github.css';
import './articleDetail.css';

const Dragger = Upload.Dragger;

@inject('articleDetailStore')
@observer
class ArticleDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { articleDetailStore } = this.props;
    articleDetailStore.initEditor();
    articleDetailStore.getPageType();
    if (articleDetailStore.pageType) articleDetailStore.getDataById();
    this.uploadImage();
  }

  uploadImage = () => {
    const { articleDetailStore } = this.props;
    const editor = articleDetailStore.editorInstance;
    editor.eventManager.addEventType('upload');
    editor.eventManager.listen('upload', () => {
      Modal.confirm({
        title: 'upload image',
        width: 700,
        content: (
          <div>
            <Dragger
              name="avatar"
              action="http://127.0.0.1:3001/api/uploads"
              beforeUpload={beforeUpload}
              onChange={articleDetailStore.onContentImageUploadChange}
            >
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
            </Dragger>
          </div>
        ),
        onOk() {
          editor.insertText(`\n\n![${articleDetailStore.editorImageName}](${articleDetailStore.editorImage})`);
        },
      });
    });
  };

  render() {
    const { articleDetailStore } = this.props;
    const uploadButton = (
      <div>
        <Icon type={articleDetailStore.uploadStatus ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const tagColorList = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
    return (
      <main className="wrapper article_detail_wrapper">
        <h1>
          { articleDetailStore.pageType ? 'Update this article' : 'Add new article'}
        </h1>
        <section className="article_detail_container">
          <span style={{ lineHeight: '102px' }}>
                Header Cover:
          </span>
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="http://127.0.0.1:3001/api/uploads"
            beforeUpload={beforeUpload}
            onChange={articleDetailStore.onHeaderCoverUploadChange}
          >
            {articleDetailStore.headerCover ? <img src={articleDetailStore.headerCover} alt="avatar" /> : uploadButton}
          </Upload>
          <span>
            Title:
          </span>
          <Input
            defaultValue={articleDetailStore.title}
            placeholder="Input Title..."
            onChange={event => articleDetailStore.onTitleChange(event)}
          />
          <span>
            Summary:
          </span>
          <textarea
            name="summary"
            id="summary"
            cols="30"
            rows="8"
            value={articleDetailStore.summary}
            onChange={event => articleDetailStore.onSummaryChange(event)}
            placeholder="Input Summary..."
          />
        </section>
        <span
          style={{ position: 'relative', top: 400 }}
        >
          Content:
        </span>
        <div id="editSection" />
        <span className="tags_label">
          Tags:
        </span>
        <div className="tags_container">
          {articleDetailStore.tags.map((tag, index) => {
            const isLongTag = tag.length > 10;
            const tagElem = (
              <Tag
                key={tag}
                closable
                color={tagColorList[index]}
                afterClose={() => articleDetailStore.handleClose(tag)}
              >
                {isLongTag ? `${tag.slice(0, 10)}...` : tag}
              </Tag>
            );
            return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
          })}
          {articleDetailStore.inputVisible && (
            <Input
              ref={articleDetailStore.saveInputRef}
              type="text"
              size="small"
              style={{ width: 78 }}
              value={articleDetailStore.inputValue}
              onChange={articleDetailStore.handleInputChange}
              onBlur={articleDetailStore.handleInputConfirm}
              onPressEnter={articleDetailStore.handleInputConfirm}
            />
          )}
          {!articleDetailStore.inputVisible && (
            <Tag
              onClick={articleDetailStore.showInput}
              style={{ background: '#fff', borderStyle: 'dashed' }}
            >
              <Icon type="plus" />
              {' '}
              New Tag
            </Tag>
          )}
        </div>
        <div className="submit_btn_group">
          <Button
            onClick={() => console.log(articleDetailStore.editorInstance.convertor.toHTML(articleDetailStore.editorInstance.getValue()))}
            type="primary"
            style={{
              marginBottom: 16,
            }}
          >
            Save and add another
          </Button>
          <Button
            onClick={() => articleDetailStore.handleSave(articleDetailStore.editorInstance.convertor.toHTML(articleDetailStore.editorInstance.getValue()))}
            style={{
              marginBottom: 16,
              marginLeft: 20,
              background: '#f90',
              borderColor: '#f90',
            }}
          >
            Save and continue editing
          </Button>
          <Button
            onClick={() => console.log(articleDetailStore.editorInstance.convertor.toHTML(articleDetailStore.editorInstance.getValue()))}
            style={{
              marginBottom: 16,
              marginLeft: 20,
              background: '#19be6b',
              borderColor: '#19be6b',
            }}
          >
            SAVE
          </Button>
        </div>
      </main>
    );
  }
}


export default ArticleDetail;
